/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Person's signature prodvided either as a base64 encoded image or as a file path on the storage server.
 */
export type PersonSignature = {
    /**
     * Base64 encoded signature image.<br>Either base64 image or file path should be provided
     */
    base64Image?: string;
    /**
     * Path of the signature image on storage server.<br>Either base64 image or file path should be provided.<br>The same path should also be referenced in the archive_documents instruction.
     */
    filePath?: string;
};

