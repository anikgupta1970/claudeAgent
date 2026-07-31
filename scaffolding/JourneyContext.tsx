import React, { createContext, useContext, useReducer } from 'react';
import type { JourneyState, JourneyAction } from '../types';
import { BEARER_TOKEN } from '../api/client';

const initialState: JourneyState = {
  step: 1,
  bearerToken: BEARER_TOKEN,
  customer: null,
  account: null,
  fdType: '',
  depositAmount: '',
  interestPaymentOption: '',
  maturityOption: '',
  tenureYears: '',
  tenureMonths: '',
  tenureDays: '',
  roi: null,
  maturityAmount: null,
  interestEarned: null,
  maturityDate: null,
  productConfig: null,
  fundingMethod: '',
  branch: null,
  nominee: null,
  applicationId: null,
  fdAccountNo: null,
};

function reducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_AUTH':
      return { ...state, ...action.payload, step: 2 };
    case 'SET_PRODUCT_CONFIG':
      return { ...state, productConfig: action.payload };
    case 'SET_FD_TYPE':
      return { ...state, fdType: action.payload };
    case 'SET_DEPOSIT_AMOUNT':
      return { ...state, depositAmount: action.payload };
    case 'SET_INTEREST_OPTION':
      return { ...state, interestPaymentOption: action.payload };
    case 'SET_MATURITY_OPTION':
      return { ...state, maturityOption: action.payload };
    case 'SET_TENURE':
      return { ...state, tenureYears: action.payload.years, tenureMonths: action.payload.months, tenureDays: action.payload.days };
    case 'SET_CALCULATION_RESULT':
      return { ...state, ...action.payload };
    case 'SET_FUNDING_METHOD':
      return { ...state, fundingMethod: action.payload };
    case 'SET_BRANCH':
      return { ...state, branch: action.payload };
    case 'SET_NOMINEE':
      return { ...state, nominee: action.payload };
    case 'SET_APPLICATION_ID':
      return { ...state, applicationId: action.payload, step: 5 };
    case 'SET_FD_ACCOUNT_NO':
      return { ...state, fdAccountNo: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const JourneyContext = createContext<{
  state: JourneyState;
  dispatch: React.Dispatch<JourneyAction>;
} | null>(null);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <JourneyContext.Provider value={{ state, dispatch }}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used inside JourneyProvider');
  return ctx;
}
