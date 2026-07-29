/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayinSectionCash } from './PayinSectionCash.js';
import type { PayinSectionCheque } from './PayinSectionCheque.js';
import type { PayinSectionNetBanking } from './PayinSectionNetBanking.js';
import type { PayinSectionTransfer } from './PayinSectionTransfer.js';
import type { PayinSectionUpi } from './PayinSectionUpi.js';
/**
 * Payment section detailing how account funding will be processed
 */
export type PayinSection = (PayinSectionCash | PayinSectionCheque | PayinSectionNetBanking | PayinSectionTransfer | PayinSectionUpi);

