/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact.js';
import type { Employment } from './Employment.js';
import type { ExistingCustomerDemographics } from './ExistingCustomerDemographics.js';
import type { Fatca } from './Fatca.js';
import type { Income } from './Income.js';
import type { InstructionType } from './InstructionType.js';
import type { KYC } from './KYC.js';
import type { PersonAddress } from './PersonAddress.js';
import type { TaxIdentification } from './TaxIdentification.js';
/**
 * The Instruction to update data for existing individual Customer
 */
export type UpdateIndividualCustomerInstruction = {
    /**
     * The Instruction to update data for existing individual Customer
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Customer Id of existing customer.<br>If the values are only numeric, then allowed length is 6 to 12 characters.<br>If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId: string;
    /**
     * Demographics of the existing customer
     */
    demographics?: ExistingCustomerDemographics;
    /**
     * Identification information
     */
    taxIdentifications?: Array<TaxIdentification>;
    /**
     * Address information
     */
    addresses?: Array<PersonAddress>;
    /**
     * Contact information
     */
    contacts?: Array<Contact>;
    /**
     * Employment information
     */
    employment?: Employment;
    /**
     * Income information
     */
    income?: Array<Income>;
    /**
     * FATCA information
     */
    fatca?: Fatca;
    /**
     * Indicates if politically exposed person
     */
    isPoliticallyExposed?: boolean;
    /**
     * KYC information
     */
    kyc?: KYC;
};

