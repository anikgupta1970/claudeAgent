/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArchiveDocumentsInstruction } from './ArchiveDocumentsInstruction.js';
import type { CreateIndividualCustomerInstruction } from './CreateIndividualCustomerInstruction.js';
import type { EnableInternetBankingInstruction } from './EnableInternetBankingInstruction.js';
import type { EnablePhoneBankingInstruction } from './EnablePhoneBankingInstruction.js';
import type { IssueDebitCardInstruction } from './IssueDebitCardInstruction.js';
import type { OpenFDAccountInstruction } from './OpenFDAccountInstruction.js';
import type { OpenSavingAccountInstruction } from './OpenSavingAccountInstruction.js';
import type { SetupInstaAlertInstruction } from './SetupInstaAlertInstruction.js';
import type { SetupSweepOutInstruction } from './SetupSweepOutInstruction.js';
import type { UpdateIndividualCustomerInstruction } from './UpdateIndividualCustomerInstruction.js';
/**
 * Instruction for various banking operations such as account opening, customer onboarding, sweep out setup, alerts, and digital banking enablement.
 */
export type Instruction = (OpenFDAccountInstruction | OpenSavingAccountInstruction | CreateIndividualCustomerInstruction | SetupSweepOutInstruction | SetupInstaAlertInstruction | EnableInternetBankingInstruction | EnablePhoneBankingInstruction | IssueDebitCardInstruction | ArchiveDocumentsInstruction | UpdateIndividualCustomerInstruction);

