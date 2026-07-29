/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * This field is required when openMode is "joint" ; otherwise, it will be ignored even if provided.
 * Who will operate the account in case of joint holding
 * - former: the account is operated by the former account holder
 * - anyone: the account can be operated by any of the joint holders
 * - jointly: the account must be operated jointly by all joint holders
 *
 */
export enum AccountOperatedBy {
    FORMER = 'former',
    ANYONE = 'anyone',
    JOINTLY = 'jointly',
}
