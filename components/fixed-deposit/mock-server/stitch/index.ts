/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { AuthService } from './services/AuthService.js';
import { CustomerService } from './services/CustomerService.js';
import { FdService } from './services/FdService.js';
import { FormsService } from './services/FormsService.js';
import { InfoService } from './services/InfoService.js';
import { PaymentService } from './services/PaymentService.js';
import { VerificationService } from './services/VerificationService.js';
import { OpenAPI } from './core/OpenAPI.js';

export { ApiError } from './core/ApiError.js';
export { CancelablePromise, CancelError } from './core/CancelablePromise.js';
export type { OpenAPIConfig } from './core/OpenAPI.js';

export type { AadhaarOTPVerification } from './models/AadhaarOTPVerification.js';
export type { AccountHolderDocument } from './models/AccountHolderDocument.js';
export type { AccountHolderRef } from './models/AccountHolderRef.js';
export type { AccountHolderResult } from './models/AccountHolderResult.js';
export type { AccountNoAllocation } from './models/AccountNoAllocation.js';
export { AccountNoAllocationMode } from './models/AccountNoAllocationMode.js';
export { AccountOpenMode } from './models/AccountOpenMode.js';
export { AccountOperatedBy } from './models/AccountOperatedBy.js';
export { AccountPermission } from './models/AccountPermission.js';
export type { AccountRef } from './models/AccountRef.js';
export { AccountRefType } from './models/AccountRefType.js';
export { AddressType } from './models/AddressType.js';
export type { Allocation } from './models/Allocation.js';
export type { ApplicationDetailedStatus } from './models/ApplicationDetailedStatus.js';
export type { ApplicationDetailedStatusInquiryArgs } from './models/ApplicationDetailedStatusInquiryArgs.js';
export { ApplicationDetailedStatusType } from './models/ApplicationDetailedStatusType.js';
export type { ApplicationDocument } from './models/ApplicationDocument.js';
export type { ApplicationProcessingStatus } from './models/ApplicationProcessingStatus.js';
export { ApplicationProcessingStatusType } from './models/ApplicationProcessingStatusType.js';
export type { ApplicationStatusInquiryArgs } from './models/ApplicationStatusInquiryArgs.js';
export { ApplicationStatusType } from './models/ApplicationStatusType.js';
export type { ArchiveDocumentsInstruction } from './models/ArchiveDocumentsInstruction.js';
export type { BankAccountVerificationResult } from './models/BankAccountVerificationResult.js';
export type { Bda } from './models/Bda.js';
export type { BiometricVerification } from './models/BiometricVerification.js';
export { BiometricVerificationType } from './models/BiometricVerificationType.js';
export type { CalculationArgs } from './models/CalculationArgs.js';
export type { Claim } from './models/Claim.js';
export type { Contact } from './models/Contact.js';
export { ContactCategory } from './models/ContactCategory.js';
export { ContactType } from './models/ContactType.js';
export { ConversionOption } from './models/ConversionOption.js';
export type { CreateIndividualCustomerInstruction } from './models/CreateIndividualCustomerInstruction.js';
export type { CreateIndividualCustomerInstructionResult } from './models/CreateIndividualCustomerInstructionResult.js';
export type { Customer } from './models/Customer.js';
export type { Customer1 } from './models/Customer1.js';
export type { CustomerApplicationForm } from './models/CustomerApplicationForm.js';
export type { CustomerGroup } from './models/CustomerGroup.js';
export { CustomerRefType } from './models/CustomerRefType.js';
export { CustomerType } from './models/CustomerType.js';
export type { DebitCardRequest } from './models/DebitCardRequest.js';
export type { Demographics } from './models/Demographics.js';
export type { DirectBenefitTransfer } from './models/DirectBenefitTransfer.js';
export type { Disability } from './models/Disability.js';
export { DocumentProofCategory } from './models/DocumentProofCategory.js';
export type { DrivingLicenseVerification } from './models/DrivingLicenseVerification.js';
export type { Education } from './models/Education.js';
export type { EmailContact } from './models/EmailContact.js';
export type { Employment } from './models/Employment.js';
export { EmploymentType } from './models/EmploymentType.js';
export type { EnableInternetBankingInstruction } from './models/EnableInternetBankingInstruction.js';
export type { EnableInternetBankingInstructionResult } from './models/EnableInternetBankingInstructionResult.js';
export type { EnablePhoneBankingInstruction } from './models/EnablePhoneBankingInstruction.js';
export type { EnablePhoneBankingInstructionResult } from './models/EnablePhoneBankingInstructionResult.js';
export type { ExistingCustomerDemographics } from './models/ExistingCustomerDemographics.js';
export type { ExistingDebitCardLinkage } from './models/ExistingDebitCardLinkage.js';
export type { ExternalBankAccount } from './models/ExternalBankAccount.js';
export { Facility } from './models/Facility.js';
export type { Family } from './models/Family.js';
export type { Fatca } from './models/Fatca.js';
export type { Father } from './models/Father.js';
export { FDInterestPaymentOption } from './models/FDInterestPaymentOption.js';
export { FDMaturityOption } from './models/FDMaturityOption.js';
export { FDRenewalOption } from './models/FDRenewalOption.js';
export type { FindCustomerArgs } from './models/FindCustomerArgs.js';
export type { FindCustomerWithMobileAndDobArgs } from './models/FindCustomerWithMobileAndDobArgs.js';
export type { FindCustomerWithPanAndMobileArgs } from './models/FindCustomerWithPanAndMobileArgs.js';
export type { Form60Identification } from './models/Form60Identification.js';
export { Gender } from './models/Gender.js';
export type { GeneratedAccountIdAllocation } from './models/GeneratedAccountIdAllocation.js';
export type { GetAccountsResult } from './models/GetAccountsResult.js';
export type { Guardian } from './models/Guardian.js';
export type { GuardianRef } from './models/GuardianRef.js';
export type { HttpProblem } from './models/HttpProblem.js';
export type { HttpValidationProblem } from './models/HttpValidationProblem.js';
export type { Income } from './models/Income.js';
export type { Income1 } from './models/Income1.js';
export type { IndividualName } from './models/IndividualName.js';
export type { InlineNomination } from './models/InlineNomination.js';
export type { InPersonVerification } from './models/InPersonVerification.js';
export type { Instruction } from './models/Instruction.js';
export type { InstructionResult } from './models/InstructionResult.js';
export { InstructionStatus } from './models/InstructionStatus.js';
export { InstructionType } from './models/InstructionType.js';
export type { InterestPaymentInstruction } from './models/InterestPaymentInstruction.js';
export type { IssueDebitCardInstruction } from './models/IssueDebitCardInstruction.js';
export type { IssueDebitCardInstructionResult } from './models/IssueDebitCardInstructionResult.js';
export type { JointHolder } from './models/JointHolder.js';
export type { KYC } from './models/KYC.js';
export { KYCStatus } from './models/KYCStatus.js';
export type { KYCVerification } from './models/KYCVerification.js';
export { KYCVerificationMode } from './models/KYCVerificationMode.js';
export type { Lead } from './models/Lead.js';
export type { ListAccountsArgs } from './models/ListAccountsArgs.js';
export { LoginCredentialType } from './models/LoginCredentialType.js';
export type { MaturityCalculationResult } from './models/MaturityCalculationResult.js';
export type { MaturityInstruction } from './models/MaturityInstruction.js';
export type { MinorCustomerRef } from './models/MinorCustomerRef.js';
export type { Mis } from './models/Mis.js';
export type { MobileContact } from './models/MobileContact.js';
export type { Money } from './models/Money.js';
export type { Mother } from './models/Mother.js';
export type { NewDebitCard } from './models/NewDebitCard.js';
export type { Nomination } from './models/Nomination.js';
export type { Nomination1 } from './models/Nomination1.js';
export { NominationMethod } from './models/NominationMethod.js';
export { NominationRefType } from './models/NominationRefType.js';
export type { NominationSection } from './models/NominationSection.js';
export type { Nominee } from './models/Nominee.js';
export type { Nominee1 } from './models/Nominee1.js';
export type { NomineesGuardian } from './models/NomineesGuardian.js';
export type { OfficeUseSection } from './models/OfficeUseSection.js';
export type { OpenFDAccountInstruction } from './models/OpenFDAccountInstruction.js';
export type { OpenFDAccountInstructionResult } from './models/OpenFDAccountInstructionResult.js';
export type { OpenSavingAccountInstruction } from './models/OpenSavingAccountInstruction.js';
export type { OpenSavingAccountInstructionResult } from './models/OpenSavingAccountInstructionResult.js';
export type { Originator } from './models/Originator.js';
export { OVDType } from './models/OVDType.js';
export type { OVDVerification } from './models/OVDVerification.js';
export { OVDVerificationCategory } from './models/OVDVerificationCategory.js';
export type { PanApplication } from './models/PanApplication.js';
export type { PanIdentification } from './models/PanIdentification.js';
export type { PassportVerification } from './models/PassportVerification.js';
export type { PayinSection } from './models/PayinSection.js';
export type { PayinSectionCash } from './models/PayinSectionCash.js';
export type { PayinSectionCheque } from './models/PayinSectionCheque.js';
export type { PayinSectionNetBanking } from './models/PayinSectionNetBanking.js';
export type { PayinSectionTransfer } from './models/PayinSectionTransfer.js';
export type { PayinSectionUpi } from './models/PayinSectionUpi.js';
export type { PaymentGateway } from './models/PaymentGateway.js';
export type { PaymentInitiationArgs } from './models/PaymentInitiationArgs.js';
export type { PaymentInitiationResult } from './models/PaymentInitiationResult.js';
export { PaymentMethod } from './models/PaymentMethod.js';
export { PaymentNetwork } from './models/PaymentNetwork.js';
export { PaymentStatus } from './models/PaymentStatus.js';
export type { PaymentStatusArgs } from './models/PaymentStatusArgs.js';
export type { PaymentStatusResult } from './models/PaymentStatusResult.js';
export { PaymentTransactionStatus } from './models/PaymentTransactionStatus.js';
export type { PersonAddress } from './models/PersonAddress.js';
export type { PersonName } from './models/PersonName.js';
export type { PersonSignature } from './models/PersonSignature.js';
export type { PhoneContact } from './models/PhoneContact.js';
export type { PostalAddress } from './models/PostalAddress.js';
export type { PredefinedAccountIdAllocation } from './models/PredefinedAccountIdAllocation.js';
export type { PreferredAccountIdAllocation } from './models/PreferredAccountIdAllocation.js';
export type { Problem } from './models/Problem.js';
export { ProcessingBatchType } from './models/ProcessingBatchType.js';
export { ProductCategory } from './models/ProductCategory.js';
export type { Profile } from './models/Profile.js';
export type { ProfileArgs } from './models/ProfileArgs.js';
export type { Promotion } from './models/Promotion.js';
export type { RefNomination } from './models/RefNomination.js';
export type { RelationshipManager } from './models/RelationshipManager.js';
export type { ReplicateNomination } from './models/ReplicateNomination.js';
export { ResidentialStatus } from './models/ResidentialStatus.js';
export type { Salaried } from './models/Salaried.js';
export type { SavingsJointHolder } from './models/SavingsJointHolder.js';
export type { SavingsSoloCustomerRef } from './models/SavingsSoloCustomerRef.js';
export type { Section } from './models/Section.js';
export { SectionType } from './models/SectionType.js';
export type { SelfEmployed } from './models/SelfEmployed.js';
export type { SelfEmployedProfessional } from './models/SelfEmployedProfessional.js';
export type { SetupInstaAlertInstruction } from './models/SetupInstaAlertInstruction.js';
export type { SetupInstaAlertInstructionResult } from './models/SetupInstaAlertInstructionResult.js';
export type { SetupSweepOutInstruction } from './models/SetupSweepOutInstruction.js';
export type { SetupSweepOutInstructionResult } from './models/SetupSweepOutInstructionResult.js';
export type { SoloCustomerRef } from './models/SoloCustomerRef.js';
export type { Spouse } from './models/Spouse.js';
export type { SubmitApplicationFormStatus } from './models/SubmitApplicationFormStatus.js';
export { SweepOutFrequencyType } from './models/SweepOutFrequencyType.js';
export { TaxAddressLocationType } from './models/TaxAddressLocationType.js';
export { TaxAddressType } from './models/TaxAddressType.js';
export type { TaxIdentification } from './models/TaxIdentification.js';
export { TaxIdentificationType } from './models/TaxIdentificationType.js';
export type { TaxResidency } from './models/TaxResidency.js';
export type { TokenResponse } from './models/TokenResponse.js';
export type { UpdateIndividualCustomerInstruction } from './models/UpdateIndividualCustomerInstruction.js';
export type { UPI } from './models/UPI.js';
export type { UpiVpaVerificationResult } from './models/UpiVpaVerificationResult.js';
export { VerificationStatus } from './models/VerificationStatus.js';
export type { VerifyBankAccountArgs } from './models/VerifyBankAccountArgs.js';
export type { VerifyUpiVpaArgs } from './models/VerifyUpiVpaArgs.js';
export { Violation } from './models/Violation.js';
export type { Violation1 } from './models/Violation1.js';
export type { VoterIdVerification } from './models/VoterIdVerification.js';

export {
  AuthService,
  CustomerService,
  FdService,
  FormsService,
  InfoService,
  PaymentService,
  VerificationService,
  OpenAPI,
};

export default {
  AuthService,
  CustomerService,
  FdService,
  FormsService,
  InfoService,
  PaymentService,
  VerificationService,
  OpenAPI,
};
