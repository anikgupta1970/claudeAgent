/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact.js';
import type { Demographics } from './Demographics.js';
import type { Employment } from './Employment.js';
import type { Fatca } from './Fatca.js';
import type { Income } from './Income.js';
import type { IndividualName } from './IndividualName.js';
import type { InstructionType } from './InstructionType.js';
import type { KYC } from './KYC.js';
import type { PersonAddress } from './PersonAddress.js';
import type { PersonSignature } from './PersonSignature.js';
import type { TaxIdentification } from './TaxIdentification.js';
/**
 * The Instruction to create a new individual Customer
 */
export type CreateIndividualCustomerInstruction = {
    /**
     * The Instruction to create new individual customer
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * Pre-allocated customer ID. <br> This field is required if in OpenSavingAccountInstruction -> allocation -> mode is set to 'predefined' and if in OpenSavingAccountInstruction -> holder/holders/minor/guardian -> type is set to 'ref' which refering to this instruction id If the values are only numeric, then allowed length is 6 to 12 characters. <br> If the values are other than numeric, then allowed length is 6 to 48 characters.
     */
    customerId?: string;
    /**
     * Demographics of the customer.
     */
    demographics: Demographics;
    /**
     * Name of the customer.
     */
    name: IndividualName;
    /**
     * Tax Identification information.
     */
    taxIdentifications: Array<TaxIdentification>;
    /**
     * Address information of the customer.<br>It is required to provide mailing and permanent addresses. Office address can also be provided but it is optional.
     */
    addresses: Array<PersonAddress>;
    /**
     * Contact information of the customer.<br>It is required to provide mobile contact information. Email and phone contact information can also be provided but it is optional.<br>
     */
    contacts: Array<Contact>;
    /**
     * Employment information
     */
    employment: Employment;
    /**
     * Income information
     */
    income: Array<Income>;
    /**
     * FATCA information
     */
    fatca: Fatca;
    /**
     * Indicates if customer is a politically exposed person
     */
    isPoliticallyExposed: boolean;
    /**
     * KYC information.
     */
    kyc: KYC;
    /**
     * Signature information
     */
    signature?: PersonSignature;
};

