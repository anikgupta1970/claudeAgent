import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DynamicUIEngine } from '@frontend/backend-ui.dynamic-ui-engine';
import {
  AuthenticationProvider,
  useJourneyContext,
} from '@api-banking/fixed-deposit.hooks.use-journey-context';
import { createStepsRegistry } from '@api-banking/fixed-deposit.wizard.steps-registry';
import { ResumeSessionPrompt } from '@api-banking/fixed-deposit.ui.resume-session-prompt';
import { saveCurrentStep } from '@api-banking/fixed-deposit.utils.session-storage';
import { postMessageToParent } from '@api-banking/fixed-deposit.utils.iframe-utils';
import { PaymentCallback } from '@api-banking/fixed-deposit.wizard.payment-callback';
import {
  detectPaymentStatus,
  cleanPaymentUrl,
} from '@api-banking/fixed-deposit.utils.payment-url';
import {
  I18nProvider,
  SUPPORTED_LANGUAGES,
} from '@api-banking/fixed-deposit.i18n';
import {
  StitchClientProvider,
  useStitchClientWithFallback,
  isBitPreviewEnvironment,
} from '@api-banking/stitch.stitch-client';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Header } from '@api-banking/design.navigation.header';
import { Stepper } from './stepper.js';

type RouterProvider = any;

const DEFAULT_CLIENT_ID = process.env.CLIENT_ID || 'test-client-id';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const DEPLOY_DATE = process.env.VITE_DEPLOY_DATE || '';

interface DynamicUIRendererProps {
  registry: any;
  data: any;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  renderKey?: number;
}

const DynamicUIRenderer = ({
  registry,
  data,
  initialStep = 0,
  onStepChange,
  renderKey,
}: DynamicUIRendererProps) => {
  const engine = useMemo(() => {
    const themeProvider: any = { resolve: (cls: string) => cls };
    const routerProvider: RouterProvider = {};
    const engineInstance = new DynamicUIEngine({
      componentRegistry: registry,
      themeProvider,
      routerProvider,
    });

    // Register Stepper as a layout processor
    engineInstance.registerLayoutProcessor('Stepper', {
      process: (layout: any, context: any, innerEngine: any) => {
        const steps = innerEngine.renderChildren(layout.children, context);
        return (
          <Stepper
            key={`stepper-${renderKey}-${initialStep}`}
            {...layout.config}
            stepTitles={layout.config.stepTitles}
            initialStep={initialStep}
            onComplete={layout.config.onComplete}
            onStepChange={onStepChange}
          >
            {steps}
          </Stepper>
        );
      },
    });

    return engineInstance;
  }, [registry, initialStep, onStepChange, renderKey]);

  return engine.render(data, 'DESKTOP' as any);
};

// Inner component that can access the authentication context
const FixedDepositFlowAppContent = () => {
  const {
    journeyConfig,
    setJourneyConfig,
    hasResumableSession,
    isRestoring,
    restoreSession,
    clearSession,
    formData,
  } = useJourneyContext();
  const { tenant } = useParams<{ tenant?: string }>();
  const stitchClient = useStitchClientWithFallback();
  const { i18n } = useTranslation();

  // Resume prompt state
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isResuming, setIsResuming] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  // Track if we're returning from a payment redirect (suppress resume prompt)
  const [isPaymentReturn] = useState(() => detectPaymentStatus() !== null);

  // If this page is loaded inside a popup (window.opener exists) at a payment callback URL,
  // render the PaymentCallback component instead of the full app.
  const [isPopupCallback] = useState(
    () => detectPaymentStatus() !== null && !!window.opener
  );

  // Handle payment callback on page reload after redirect from payment gateway
  // CCAvenue redirects to /payment/success or /payment/failure
  // This only runs in non-popup mode (direct navigation / non-iframe)
  useEffect(() => {
    if (isPopupCallback) return; // Popup handles its own callback via PaymentCallback component

    const paymentStatus = detectPaymentStatus();
    if (!paymentStatus) return;

    // Clean up URL — removes fdPayment param or legacy pathname
    cleanPaymentUrl();

    // Read and clear payment state from sessionStorage
    const paymentStateRaw = sessionStorage.getItem('fd_payment_pending');
    sessionStorage.removeItem('fd_payment_pending');

    if (paymentStatus === 'success') {
      // Restore the session and advance past the funding step to submit
      restoreSession().then((result) => {
        if (result) {
          // Advance one step beyond the restored step (funding → submit)
          setCurrentStep(result.step + 1);
          setRenderKey((prev) => prev + 1);
        }
      });
    } else {
      // Payment failed — store failure flag and restore to funding step for retry
      sessionStorage.setItem('fd_payment_failed', 'true');
      restoreSession().then((result) => {
        if (result) {
          setCurrentStep(result.step);
          setRenderKey((prev) => prev + 1);
        }
      });
    }
  }, [isPopupCallback]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show resume prompt when resumable session is detected (but not on payment return)
  useEffect(() => {
    if (hasResumableSession && !isRestoring && !isPaymentReturn) {
      setShowResumePrompt(true);
    }
  }, [hasResumableSession, isRestoring, isPaymentReturn]);

  // Handle resume action
  const handleResume = useCallback(async () => {
    setIsResuming(true);
    try {
      const result = await restoreSession();
      if (result) {
        // Navigate to the saved step
        setCurrentStep(result.step);
        // Force re-render of stepper with new initial step
        setRenderKey((prev) => prev + 1);
      }
      setShowResumePrompt(false);
    } catch (error) {
      // If restore fails, start fresh
      clearSession();
      setShowResumePrompt(false);
    } finally {
      setIsResuming(false);
    }
  }, [restoreSession, clearSession]);

  // Handle start fresh action
  const handleStartFresh = useCallback(() => {
    clearSession();
    setCurrentStep(0);
    setShowResumePrompt(false);
  }, [clearSession]);

  // Handle step changes to persist to storage and notify parent
  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    saveCurrentStep(step);
    postMessageToParent('FD_FLOW_STEP_CHANGE', { step });
  }, []);

  // Handle language change from Header
  const handleLanguageChange = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  // Fetch journey config on mount (only requires clientId, no auth needed)
  useEffect(() => {
    const fetchJourneyConfig = async () => {
      try {
        const response = (await stitchClient.getJourneyConfig(tenant)) as {
          journeyConfig?: any;
        };
        if (response?.journeyConfig) {
          setJourneyConfig(response.journeyConfig);
        }
      } catch (error) {
        // Handle error - journey config fetch failed
      }
    };

    if (!journeyConfig) {
      fetchJourneyConfig();
    }
  }, [stitchClient, journeyConfig, setJourneyConfig, tenant]);

  const needsFundingStep =
    formData?.bank?.fundingOption === 'other-bank' ||
    formData?.bank?.fundingOption === 'combined-funds';

  const registry = useMemo(() => createStepsRegistry({ Stepper }), []);

  // Build cmsData dynamically based on journeyConfig
  const cmsData = useMemo(() => {
    // Login, Preview, and Submit are always fixed steps (not from API)
    const baseComponents: Record<string, any> = {
      'login-page': {
        id: 'login-page',
        type: 'LoginPage',
        props: {
          credentials: 'mobile_dob_pan',
        },
      },
      'preview-step': {
        id: 'preview-step',
        type: 'PreviewStep',
        props: {},
      },
      'submit-step': {
        id: 'submit-step',
        type: 'SubmitStep',
        props: {},
      },
      ...(needsFundingStep
        ? {
            'funding-step': {
              id: 'funding-step',
              type: 'FundingStep',
              props: {},
            },
          }
        : {}),
    };

    // If no journeyConfig yet, show only the login step
    if (!journeyConfig) {
      return {
        components: baseComponents,
        layout: {
          id: 'auth-root',
          type: 'Stepper',
          config: {
            stepTitles: ['Login'],
            onComplete: () => {
              // eslint-disable-next-line no-console
              console.log('Login step completed.');
            },
          },
          children: [{ componentId: 'login-page' }],
        },
      };
    }

    // Build components from journeyConfig, excluding preview and submit (they're hardcoded)
    const excludedComponents = ['preview-step', 'submit-step'];
    const journeyComponents: Record<string, any> = {};
    Object.entries(journeyConfig.components).forEach(([id, config]) => {
      if (!excludedComponents.includes(id)) {
        journeyComponents[id] = {
          id: config.id,
          type: config.type,
          props: config.props || {},
        };
      }
    });

    // Merge base components with journey components
    const allComponents = { ...baseComponents, ...journeyComponents };

    // Filter out preview and submit from API layout children
    const apiLayoutChildren = (journeyConfig.layout.children || []).filter(
      (child: { componentId: string }) =>
        !excludedComponents.includes(child.componentId)
    );

    // Build layout children - Login first, then API journey steps, then Preview, optionally Funding, and Submit (fixed)
    const layoutChildren = [
      { componentId: 'login-page' },
      ...apiLayoutChildren,
      { componentId: 'preview-step' },
      ...(needsFundingStep ? [{ componentId: 'funding-step' }] : []),
      { componentId: 'submit-step' },
    ];

    // Filter out Preview and Submit FD from API step titles
    const excludedTitles = ['Preview', 'Submit FD'];
    const apiStepTitles = journeyConfig.stepTitles.filter(
      (title: string) => !excludedTitles.includes(title)
    );

    // Build step titles - Login first, then API steps, then Preview, optionally Funding, and Submit (fixed)
    const stepTitles = [
      'Login',
      ...apiStepTitles,
      'Preview',
      ...(needsFundingStep ? ['Funding'] : []),
      'Submit FD',
    ];

    return {
      components: allComponents,
      layout: {
        id: 'auth-root',
        type: 'Stepper',
        config: {
          stepTitles,
          onComplete: () => {
            // eslint-disable-next-line no-console
            console.log('Flow completed via stepper.');
            postMessageToParent('FD_FLOW_COMPLETE', {});
          },
        },
        children: layoutChildren,
      },
    };
  }, [journeyConfig, needsFundingStep]);

  // If this is a popup callback page, render the callback component only
  if (isPopupCallback) {
    return <PaymentCallback />;
  }

  return (
    <>
      <Header
        logoProps={
          journeyConfig?.logoUrl
            ? {
                logo: (
                  <img
                    src={journeyConfig.logoUrl}
                    alt="Logo"
                    style={{ height: 40 }}
                  />
                ),
              }
            : undefined
        }
        languages={SUPPORTED_LANGUAGES}
        selectedLanguage={i18n.language}
        onLanguageChange={handleLanguageChange}
      />
      {showResumePrompt && (
        <ResumeSessionPrompt
          onResume={handleResume}
          onStartFresh={handleStartFresh}
          isLoading={isResuming}
        />
      )}
      <DynamicUIRenderer
        registry={registry}
        data={cmsData}
        initialStep={currentStep}
        onStepChange={handleStepChange}
        renderKey={renderKey}
      />
      {DEPLOY_DATE && (
        <footer
          style={{
            textAlign: 'center',
            padding: '8px',
            fontSize: '12px',
            color: 'var(--colors-text-subtle, #999)',
          }}
        >
          Deployed:{' '}
          {new Date(DEPLOY_DATE).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </footer>
      )}
    </>
  );
};

// Wrapper that reads journeyConfig from context and passes theme overrides to ApiBankingTheme
function ThemedAppContent() {
  const { journeyConfig } = useJourneyContext();
  return (
    <ApiBankingTheme overrides={journeyConfig?.theme}>
      <FixedDepositFlowAppContent />
    </ApiBankingTheme>
  );
}

export function FixedDepositFlowApp() {
  return (
    <I18nProvider backendUrl={API_BASE_URL}>
      <StitchClientProvider mock={isBitPreviewEnvironment()}>
        <AuthenticationProvider clientId={DEFAULT_CLIENT_ID}>
          <ThemedAppContent />
        </AuthenticationProvider>
      </StitchClientProvider>
    </I18nProvider>
  );
}
