/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountHolderDocument } from './AccountHolderDocument.js';
import type { ApplicationDocument } from './ApplicationDocument.js';
import type { InstructionType } from './InstructionType.js';
/**
 * Instruction to archive the given set of documents. One of the document lists must be non-empty.
 */
export type ArchiveDocumentsInstruction = {
    /**
     * The Instruction type to archive the document(s)
     */
    instruction: InstructionType;
    /**
     * A unique sequential identifier assigned to each instruction
     */
    id: string;
    /**
     * List of account holder documents
     */
    holderDocuments?: Array<AccountHolderDocument>;
    /**
     * List of documents at application level i.e. not specific to any individual customer
     */
    applicationDocuments?: Array<ApplicationDocument>;
};

