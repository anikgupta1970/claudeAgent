/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Specifies the type of instruction to be executed.
 * - open_fd: Open a fixed deposit account.
 * - open_sa: Open a savings account.
 * - create_ind_customer: Create a new individual customer.
 * - setup_sweepout: Setup sweep-out instruction.
 * - enable_internet_banking: Enable internet banking for a account.
 * - enable_phone_banking: Enable phone banking for a account.
 * - setup_insta_alerts: Setup insta-alerts for a account.
 * - issue_debit_card: Issue a debit card for a savings account to the account holder.
 * - archive_documents: Archive the given set of documents.
 * - update_ind_customer: Update data for existing individual customer.
 *
 */
export enum InstructionType {
    OPEN_FD = 'open_fd',
    OPEN_SA = 'open_sa',
    CREATE_IND_CUSTOMER = 'create_ind_customer',
    SETUP_SWEEPOUT = 'setup_sweepout',
    ENABLE_INTERNET_BANKING = 'enable_internet_banking',
    ENABLE_PHONE_BANKING = 'enable_phone_banking',
    SETUP_INSTA_ALERTS = 'setup_insta_alerts',
    ISSUE_DEBIT_CARD = 'issue_debit_card',
    ARCHIVE_DOCUMENTS = 'archive_documents',
    UPDATE_IND_CUSTOMER = 'update_ind_customer',
}
