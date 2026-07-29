/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountRef } from './AccountRef.js';
import type { FDMaturityOption } from './FDMaturityOption.js';
import type { FDRenewalOption } from './FDRenewalOption.js';
/**
 * Instructions for what to do with the Fixed Deposit amount upon maturity.
 */
export type MaturityInstruction = {
    /**
     * FD Maturity Options: <br> - close: Close the fixed deposit at maturity. <br> - renew: Renew the fixed deposit for another term. <br> - transfer: Transfer the maturity amount to a linked account. <br> If the Interest Payment Option is "monthly" or "quarterly" then the maturity option can only be "close" or "renew" (renewal option to be set to "full").
     */
    option: FDMaturityOption;
    /**
     * FD Renewal Options: <br> - full: On maturity, renew the fixed deposit for the full amount including principal and interest. <br> - principal: Renew the fixed deposit for the principal amount only. <br> This field is required if option is "renew" ; otherwise, it will be ignored even if provided.
     */
    renewalOption?: FDRenewalOption;
    /**
     * This field is deprecated. Use payoutAccount input attribute instead. The account ID for the maturity payout, if not specified, the payout will be made to the debit account
     * @deprecated
     */
    payoutAccountId?: string;
    /**
     * Reference to the savings account where maturity payout will be done. If this input is not provided then debitAccountId will be used for this purpose.
     */
    payoutAccount?: AccountRef;
    /**
     * Indicates whether a manager's cheque to be issued or not.
     */
    managersCheque?: boolean;
};

