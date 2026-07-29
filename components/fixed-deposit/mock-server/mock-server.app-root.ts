import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { MockServer } from './mock-server.js';
import Stitch, {
  AccountPermission,
  FDInterestPaymentOption,
  FDMaturityOption,
  FDRenewalOption,
} from './stitch/index.js';
import type {
  AuthorizeRequest,
  DepositRequest,
  BankRequest,
  AuthorizeCredential,
  FDCalculatorRequest,
} from './types.js';

// Setup Stitch client base URL
Stitch.OpenAPI.BASE =
  'https://stitch-individual-customer.apps.rosa.sdev.mi7j.p3.openshiftapps.com';

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 3600 * 1000, // 1 hour
  path: '/',
};

interface AuthenticatedRequest extends Request {
  userCredential?: AuthorizeCredential;
  accessToken?: string;
}

export function run() {
  const app = express();
  const mockServer = MockServer.from();
  const port = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());
  app.use(cookieParser());

  // CORS for local development
  app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Client-Id'
    );
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Bearer token middleware for protected routes
  // Also checks cookies as fallback for httpOnly cookie auth
  const requireBearerToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authReq = req as AuthenticatedRequest;
    const authHeader = req.headers.authorization;

    // Try Authorization header first
    let token: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7); // Remove 'Bearer ' prefix
    }

    // Fallback to cookie if no Authorization header
    if (!token && req.cookies?.fd_access_token) {
      token = req.cookies.fd_access_token;
    }

    if (!token) {
      res
        .status(401)
        .json({
          errors: [
            { field: 'authorization', message: 'Authorization required' },
          ],
        });
      return;
    }

    const result = mockServer.validateAccessToken(token);

    if (!result.valid) {
      res
        .status(401)
        .json({
          errors: [
            { field: 'authorization', message: 'Invalid or expired token' },
          ],
        });
      return;
    }

    authReq.userCredential = result.credential;
    authReq.accessToken = token;
    next();
  };

  // Hello endpoint
  app.get('/', async (_req, res) => {
    const greeting = await mockServer.getHello();
    res.send(greeting);
  });

  // ============================================
  // New Auth API Endpoints
  // ============================================

  // GET /login/terms - Get terms that must be accepted
  app.get('/login/terms', (req: Request, res: Response) => {
    const clientId = req.headers['client-id'] as string | undefined;
    const terms = mockServer.getTerms(clientId);
    res.json({ terms });
  });

  // POST /login/authorize - Authorize with credentials and accepted terms
  app.post('/login/authorize', (req: Request, res: Response) => {
    const data = req.body as AuthorizeRequest;
    const result = mockServer.validateAuthorize(data);

    if (!result.valid) {
      res.status(400).json({ errors: result.errors });
      return;
    }

    const session = mockServer.createOtpSession(data);
    const hint = mockServer.generateOtpHint(data.credential);

    res.json({
      sessionId: session.id,
      hint,
      expiresIn: 60,
      maxAttempts: session.maxAttempts,
      otpLength: session.otpLength,
    });
  });

  // POST /login/token - Exchange OTP for access/refresh tokens
  app.post('/login/token', (req: Request, res: Response) => {
    const { sessionId, otp } = req.body as { sessionId: string; otp: string };

    if (!sessionId) {
      res
        .status(400)
        .json({
          errors: [{ field: 'sessionId', message: 'Session ID is required' }],
        });
      return;
    }

    if (!otp) {
      res
        .status(400)
        .json({ errors: [{ field: 'otp', message: 'OTP is required' }] });
      return;
    }

    const result = mockServer.verifyOtpAndGenerateTokens(sessionId, otp);

    if (result.valid === false) {
      res.status(400).json({ errors: result.errors });
      return;
    }

    // Get the session for cookie
    const session = mockServer.getSessionByToken(result.accessToken);

    // Set httpOnly cookies for secure token storage
    res.cookie('fd_access_token', result.accessToken, COOKIE_OPTIONS);
    if (session) {
      res.cookie('fd_session_id', session.id, COOKIE_OPTIONS);
    }

    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
    });
  });

  // GET /translations/:lang - Get language pack for the requested language (public)
  app.get('/translations/:lang', async (req: Request, res: Response) => {
    const lang = req.params.lang || 'en';
    const translations = await mockServer.getTranslations(lang);
    res.json(translations);
  });

  // GET /journey/config - Get journey configuration (public - no auth required)
  app.get('/journey/config', (req: Request, res: Response) => {
    const clientId = req.headers['client-id'] as string | undefined;
    const journeyConfig = mockServer.generateJourneyConfig(clientId);
    res.json({ journeyConfig });
  });

  // GET /ifsc/:code - Lookup bank details by IFSC code (public)
  app.get('/ifsc/:code', (req: Request, res: Response) => {
    const ifscCode = (req.params.code || '').toUpperCase();
    const result = mockServer.lookupIFSC(ifscCode);

    if (result.valid === false) {
      res.status(400).json({ success: false, errors: result.errors });
      return;
    }

    res.json({ success: true, ...result.result });
  });

  // POST /account/verify - Verify bank account number (public)
  app.post('/account/verify', async (req: Request, res: Response) => {
    const { accountNumber, ifsc } = req.body as {
      accountNumber: string;
      ifsc: string;
    };

    try {
      const result =
        await Stitch.VerificationService.postIndividualCustomersVerificationsBankAccount(
          {
            customerId: 'mock-customer-123',
            accountNo: accountNumber,
            ifsc,
          }
        );

      res.json(result);
    } catch (error: any) {
      console.error('Error verifying account:', error);
      res
        .status(error.status || 500)
        .json({
          success: false,
          errors: [{ field: 'general', message: 'Failed to verify account' }],
        });
    }
  });

  // GET /branches - Get branches at a location (public - no auth required)
  app.get('/branches', (req: Request, res: Response) => {
    const params = {
      country: req.query.country as string | undefined,
      pin: req.query.pin as string | undefined,
      city: req.query.city as string | undefined,
      district: req.query.district as string | undefined,
      state: req.query.state as string | undefined,
    };
    const branches = mockServer.getBranches(params);
    res.json({ branches });
  });

  // ============================================
  // Protected Step Endpoints (Bearer token auth)
  // ============================================

  // GET /my/fd/session - Get current session state for resume functionality
  app.get(
    '/my/fd/session',
    requireBearerToken,
    (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const session = mockServer.getSessionByToken(authReq.accessToken!);

      if (!session) {
        res
          .status(404)
          .json({
            errors: [{ field: 'session', message: 'Session not found' }],
          });
        return;
      }

      // Calculate current step based on saved data
      const currentStep = mockServer.calculateCurrentStep(session);

      res.json({
        success: true,
        session: {
          depositData: session.depositData || null,
          bankData: session.bankData || null,
          currentStep,
          createdAt: session.createdAt.toISOString(),
        },
      });
    }
  );

  // GET /my/nominee - Get existing nominee details (protected)
  app.get('/my/nominee', requireBearerToken, (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const result = mockServer.getNominee(authReq.accessToken!);
    if ('success' in result && result.success === false) {
      res.status(401).json(result);
      return;
    }
    res.json(result);
  });

  // POST /individual-customers/info/accounts - Get customer accounts (protected)
  app.post(
    '/individual-customers/info/accounts',
    requireBearerToken,
    async (req: Request, res: Response) => {
      const { customerId, currency } = req.body as {
        customerId: string;
        currency?: string;
      };

      if (!customerId) {
        res
          .status(400)
          .json({ errors: [{ field: 'customerId', message: 'Customer ID is required' }] });
        return;
      }

      try {
        const result = await Stitch.InfoService.postIndividualCustomersInfoAccounts({
          customerId,
          permission: AccountPermission.DEBIT,
          currency: currency ?? 'INR',
        });

        res.json(result);
      } catch (error: any) {
        console.error('Error fetching customer accounts:', error);
        res
          .status(error.status || 500)
          .json({ errors: [{ field: 'general', message: 'Failed to fetch customer accounts' }] });
      }
    }
  );

  // Deposit details - validate and save (protected)
  app.put(
    '/my/fd/details/deposit',
    requireBearerToken,
    (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const data = req.body as DepositRequest;
      const result = mockServer.validateDeposit(data);

      if (!result.valid) {
        res.status(400).json({ success: false, errors: result.errors });
        return;
      }

      mockServer.updateSessionByToken(authReq.accessToken!, 'deposit', data);
      res.json({ success: true });
    }
  );

  // Bank details - validate and save (protected)
  app.put(
    '/my/fd/details/bank',
    requireBearerToken,
    (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const data = req.body as BankRequest;
      const result = mockServer.validateBank(data);

      if (!result.valid) {
        res.status(400).json({ success: false, errors: result.errors });
        return;
      }

      mockServer.updateSessionByToken(authReq.accessToken!, 'bank', data);
      res.json({ success: true });
    }
  );

  // FD Calculator - Calculate interest and maturity amount
  app.post('/my/fd/calculator', async (req: Request, res: Response) => {
    const data = req.body as FDCalculatorRequest;

    try {
      const years = parseInt(data.tenureYears, 10) || 0;
      const months = parseInt(data.tenureMonths, 10) || 0;
      const days = parseInt(data.tenureDays, 10) || 0;

      let tenureString = 'P';
      if (years > 0) tenureString += `${years}Y`;
      if (months > 0) tenureString += `${months}M`;
      if (days > 0) tenureString += `${days}D`;
      if (tenureString === 'P') tenureString = 'P0D'; // Default

      let interestPaymentOption = FDInterestPaymentOption.AT_MATURITY;
      if (data.interestPayout === 'monthly') interestPaymentOption = FDInterestPaymentOption.MONTHLY;
      else if (data.interestPayout === 'quarterly')
        interestPaymentOption = FDInterestPaymentOption.QUARTERLY;

      const result = await Stitch.FdService.postIndividualCustomersFdCalculator(
        {
          customerId: 'mock-customer-123',
          productVariant: 'regular',
          depositAmount: {
            amount: parseFloat(data.amount) || 0,
            currency: 'INR',
          },
          tenure: tenureString,
          interestPaymentOption,
          maturityInstruction: {
            option: FDMaturityOption.RENEW,
            renewalOption: FDRenewalOption.FULL,
          },
        }
      );

      res.json(result);
    } catch (error: any) {
      console.error('Error calculating FD:', error);
      res
        .status(error.status || 500)
        .json({
          success: false,
          errors: [{ field: 'general', message: 'Failed to calculate FD' }],
        });
    }
  });

  // Final submission (protected)
  app.post(
    '/my/fd/submit',
    requireBearerToken,
    (req: Request, res: Response) => {
      const authReq = req as AuthenticatedRequest;
      const session = mockServer.getSessionByToken(authReq.accessToken!);

      if (!session) {
        res
          .status(400)
          .json({
            success: false,
            errors: [{ field: 'session', message: 'Session not found' }],
          });
        return;
      }

      // In a real app, this would submit to a backend service
      res.json({
        success: true,
        message: 'Application submitted successfully',
        applicationId: `APP-${Date.now()}`,
      });
    }
  );

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at: http://localhost:${port}`);
  });

  return {
    port,
    // implement stop to support HMR.
    stop: async () => {
      server.closeAllConnections();
      server.close();
    },
  };
}
