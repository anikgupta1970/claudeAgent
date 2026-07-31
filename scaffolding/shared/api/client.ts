const BASE_URL = 'https://mahendra-shetake.mocks.apibanking.com';

const DEMO_TOKEN = 'demo-bearer-token';

interface ApiError extends Error {
  status: number;
  data: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token: string = DEMO_TOKEN,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error((data as { detail?: string }).detail || 'Request failed') as ApiError;
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return res.json() as Promise<T>;
}

export const BEARER_TOKEN = DEMO_TOKEN;

export interface SendOtpResponse {
  sessionId: string;
}

export interface VerifyOtpResponse {
  token: string;
  customerId: string;
  name: string;
  dob: string;
  pan?: string;
}

export interface FindCustomerResponse {
  customerId: string;
  name: string;
  mobile: string;
  dob: string;
  pan?: string;
}

export interface AccountResponse {
  accountId: string;
  accountNo: string;
  productCategory?: string;
  status?: string;
  currentBalance?: { amount: number | string; currency: string };
}

export interface BranchResponse {
  code: string;
  name: string;
  ifsc: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
}

export interface ProductConfigResponse {
  id?: number;
  product: string;
  terms: {
    interestPaymentOption?: { allow: string[] };
    maturityOption?: { allow: string[] };
    tenure?: { min?: { value: string }; max?: { value: string } };
    initialDeposit?: {
      min?: { value: { amount: number } };
      max?: { value: { amount: number } };
    };
  };
}

export interface CalculatorResponse {
  roi: number;
  maturityAmount: { amount: number; currency: string };
  maturityDate?: string;
  startDate?: string;
  interestEarned?: { amount: number; currency: string };
}

export function sendOtp(params: { mobile: string; credentialType: 'mobile_dob' | 'mobile_pan' }) {
  return request<SendOtpResponse>('/auth/otp/send', { method: 'POST', body: JSON.stringify(params) });
}

export function verifyOtp(params: { sessionId: string; otp: string; mobile: string; dob?: string; pan?: string }) {
  return request<VerifyOtpResponse>('/auth/otp/verify', { method: 'POST', body: JSON.stringify(params) });
}

export function findCustomer(params: { mobile: string; dob?: string; pan?: string }) {
  return request<FindCustomerResponse>(
    '/individual-customers/find',
    { method: 'POST', body: JSON.stringify(params) },
  );
}

export function getCustomerAccounts(customerId: string) {
  return request<AccountResponse[]>('/individual-customers/info/accounts', {
    method: 'POST',
    body: JSON.stringify({ customerId }),
  });
}

export function getProductConfig(product: string) {
  return request<ProductConfigResponse[]>(`/config/mgmt/fi/products?product=${product}`);
}

export function calculateFD(params: {
  productVariant: string;
  depositAmount: { amount: string; currency: string };
  tenure: string;
  openMode: string;
  interestPaymentOption: string;
}) {
  return request<CalculatorResponse>(
    '/individual-customers/fd/calculator',
    { method: 'POST', body: JSON.stringify(params) },
  );
}

export function getBranches() {
  return request<BranchResponse[]>('/config/mgmt/fi/branches');
}

export function getNomineeRelationships() {
  return request<Array<{ choices: string[] }>>(
    '/config/mgmt/fi/enums?name=nominee.relationship',
  );
}

export function submitForm(body: unknown, idempotencyKey: string, token: string) {
  return request<{ applicationId: string; status: string }>('/forms', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Idempotency-Key': idempotencyKey },
  }, token);
}

export function getFormStatus(applicationId: string, token: string) {
  return request<{ applicationId: string; status: string }>('/forms/status', {
    method: 'POST',
    body: JSON.stringify({ applicationId }),
  }, token);
}

export function getFormDetailedStatus(applicationId: string, token: string) {
  return request<{
    applicationId: string;
    status: string;
    instructions: Array<{ instructionId: string; instructionType: string; status: string; accountNo?: string }>;
  }>('/forms/detailed-status', {
    method: 'POST',
    body: JSON.stringify({ applicationId }),
  }, token);
}

export function initiatePayment(body: unknown, idempotencyKey: string, token: string) {
  return request<{ paymentTxnId: string; paymentLink?: { url: string; method: string; parameters: Record<string, string> } }>(
    '/payments',
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Idempotency-Key': idempotencyKey },
    },
    token,
  );
}

export function getPaymentStatus(clientReferenceNumber: string, token: string) {
  return request<{ paymentTxnId: string; clientReferenceNumber: string; status: 'success' | 'pending' | 'failed' }>(
    '/payments/status',
    { method: 'POST', body: JSON.stringify({ clientReferenceNumber }) },
    token,
  );
}
