import React, { useState } from 'react';
import classNames from 'classnames';
import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Card } from '@api-banking/design.content.card';
import { CtaButton } from '@api-banking/design.actions.cta-button';
import { DatePicker } from '@api-banking/design.inputs.date-picker';
import { InputGroup } from '@api-banking/design.inputs.input-group';
import { RadioButton } from '@api-banking/design.inputs.radio-button';
import { TextInput } from '@api-banking/design.inputs.text-input';
import { Link } from '@api-banking/design.navigation.link';
import { Heading } from '@api-banking/design.typography.heading';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { LoginTerms } from '@api-banking/authentication.login-terms';
import { ConsentModal } from '@api-banking/authentication.overlays.consent-modal';
import { type ConsentItem } from './consent-item-type.js';
import styles from './login.module.scss';

// Fallback terms if none provided
const defaultTerms: ConsentItem[] = [
  {
    id: '1',
    summary:
      'I/we have read, understood, and hereby accept the Privacy Policy.',
    documentUrl: 'https://example.com/privacy-policy',
  },
  {
    id: '2',
    summary:
      'I/we hereby give consent (V.1.0) in relation to Requested Products',
    content:
      'This is the content of the consent. By accepting, you agree to our terms and conditions.',
  },
];

export type CredentialsMode =
  | 'mobile_dob'
  | 'mobile_pan'
  | 'mobile_dob_pan'
  | 'debit_card'
  | 'ucic_password';

export type ValidationError = {
  field: string;
  message: string;
};

export type LoginFormData = {
  acceptedTerms: Array<{ id: string }>;
  credential: {
    type: CredentialsMode;
    mobile?: string;
    dob?: string;
    pan?: string;
    debitCard?: string;
    ucic?: string;
    password?: string;
  };
};

export type LoginProps = {
  onContinue?: (data: LoginFormData) => void;
  className?: string;
  style?: React.CSSProperties;
  credentials?: CredentialsMode;
  serverErrors?: ValidationError[];
  isSubmitting?: boolean;
  terms?: ConsentItem[];
  isLoadingTerms?: boolean;
};

const getServerError = (
  errors: ValidationError[] | undefined,
  field: string
): string | undefined => {
  return errors?.find((e) => e.field === field)?.message;
};

const RequiredIndicator = () => <span style={{ color: '#f40505' }}>*</span>;

// Format date to YYYY-MM-DD for API
const formatDateForApi = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function Login({
  onContinue,
  className,
  style,
  credentials = 'mobile_dob_pan',
  serverErrors,
  isSubmitting: externalSubmitting,
  terms = defaultTerms,
  isLoadingTerms = false,
}: LoginProps) {
  const { t } = useTranslation();
  const [activeConsent, setActiveConsent] = useState<ConsentItem | null>(null);
  const [acceptedTermIds, setAcceptedTermIds] = useState<Set<string>>(
    new Set()
  );
  const generalError = getServerError(serverErrors, 'general');
  const termsError = getServerError(serverErrors, 'acceptedTerms');

  const form = useForm({
    defaultValues: {
      mobileNumber: '9876543210',
      validationMethod: 'dob' as 'dob' | 'pan',
      dob: null as Date | null,
      pan: '',
      debitCardNumber: '',
      ucic: '',
      password: '',
    },
    validators: {
      onChange: ({ value }) => {
        const schema = z
          .object({
            mobileNumber: z.string(),
            validationMethod: z.enum(['dob', 'pan']),
            dob: z.date().nullable(),
            pan: z.string(),
            debitCardNumber: z.string(),
            ucic: z.string(),
            password: z.string(),
          })
          .superRefine((data, ctx) => {
            const mode = credentials ?? 'mobile_dob';
            if (mode.startsWith('mobile_')) {
              if (!data.mobileNumber || data.mobileNumber.length !== 10) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('step1.errors.validMobileRequired'),
                  path: ['mobileNumber'],
                });
              }
            }
            if (
              mode === 'mobile_dob' ||
              (mode === 'mobile_dob_pan' && data.validationMethod === 'dob')
            ) {
              if (!data.dob) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('step1.errors.dobRequired'),
                  path: ['dob'],
                });
              }
            }
            if (
              mode === 'mobile_pan' ||
              (mode === 'mobile_dob_pan' && data.validationMethod === 'pan')
            ) {
              if (!data.pan || data.pan.length !== 10) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('step1.errors.panRequired'),
                  path: ['pan'],
                });
              }
            }
            if (mode === 'debit_card') {
              if (!data.debitCardNumber || data.debitCardNumber.length !== 16) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('step1.errors.debitCardRequired'),
                  path: ['debitCardNumber'],
                });
              }
            }
            if (mode === 'ucic_password') {
              if (!data.ucic)
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('step1.errors.ucicRequired'),
                  path: ['ucic'],
                });
              if (!data.password)
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t('step1.errors.passwordRequired'),
                  path: ['password'],
                });
            }
          });

        const result = schema.safeParse(value);
        if (result.success) return undefined;

        // Map Zod errors to form errors
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            errors[path.toString()] = issue.message;
          }
        });
        return errors;
      },
    },
    onSubmit: async ({ value }) => {
      // Check if all terms are accepted
      if (acceptedTermIds.size !== terms.length) {
        return; // Don't submit if terms not accepted
      }

      // Determine the actual credential type for the API
      // When credentials is 'mobile_dob_pan', use the selected validation method
      let credentialType = credentials;
      if (credentials === 'mobile_dob_pan') {
        credentialType = value.validationMethod === 'pan' ? 'mobile_pan' : 'mobile_dob';
      }

      // Format data for new API structure
      const formData: LoginFormData = {
        acceptedTerms: Array.from(acceptedTermIds).map((id) => ({ id })),
        credential: {
          type: credentialType,
          ...(credentialType.startsWith('mobile_') && {
            mobile: value.mobileNumber,
          }),
          ...(credentialType === 'mobile_dob' && {
            dob: formatDateForApi(value.dob),
          }),
          ...(credentialType === 'mobile_pan' && { pan: value.pan }),
          ...(credentials === 'debit_card' && {
            debitCard: value.debitCardNumber,
          }),
          ...(credentials === 'ucic_password' && {
            ucic: value.ucic,
            password: value.password,
          }),
        },
      };

      onContinue?.(formData);
    },
  });

  const handleOpenConsent = (consentItem: ConsentItem) => {
    setActiveConsent(consentItem);
  };

  const handleAgree = () => {
    if (activeConsent) {
      setAcceptedTermIds((prev) => new Set([...prev, activeConsent.id]));
    }
    setActiveConsent(null);
  };

  const handleDisagree = () => {
    setActiveConsent(null);
  };

  const allTermsAccepted = acceptedTermIds.size === terms.length;

  const renderDobField = () => (
    <form.Field
      key="dob"
      name="dob"
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
        const serverError = getServerError(serverErrors, 'dob');
        const fieldError = field.state.meta.errors?.[0] as string | undefined;
        const errorText =
          serverError || (field.state.meta.isTouched ? fieldError : undefined);
        return (
          <InputGroup
            label={
              <>
                {t('step1.dateOfBirth')} <RequiredIndicator />
              </>
            }
            inputId="dob-picker"
            helpText={!errorText ? t('step1.dobHelpText') : undefined}
            errorText={errorText}
          >
            <DatePicker
              value={field.state.value}
              onChange={(date) => field.handleChange(date)}
              placeholder={t('step1.dobPlaceholder')}
              disableFutureDates
            />
          </InputGroup>
        );
      }}
    />
  );

  const renderPanField = () => (
    <form.Field
      key="pan"
      name="pan"
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
        const serverError = getServerError(serverErrors, 'pan');
        const fieldError = field.state.meta.errors?.[0] as string | undefined;
        const errorText =
          serverError || (field.state.meta.isTouched ? fieldError : undefined);
        return (
          <InputGroup
            label={
              <>
                {t('step1.pan')} <RequiredIndicator />
              </>
            }
            inputId="pan-input"
            helpText={!errorText ? t('step1.panHelpText') : undefined}
            errorText={errorText}
          >
            <TextInput
              id="pan-input"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
              placeholder={t('step1.panPlaceholder')}
              maxLength={10}
              error={!!errorText}
            />
          </InputGroup>
        );
      }}
    />
  );

  const renderValidationInputs = () => {
    const inputs: React.ReactNode[] = [];

    const needsDebitCard = credentials === 'debit_card';
    const needsUcicPassword = credentials === 'ucic_password';

    if (credentials === 'mobile_dob') {
      inputs.push(renderDobField());
    }

    if (credentials === 'mobile_pan') {
      inputs.push(renderPanField());
    }

    if (credentials === 'mobile_dob_pan') {
      inputs.push(
        <form.Field
          key="validationMethod"
          name="validationMethod"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => (
            <InputGroup
              label={
                <>
                  {t('step1.verifyUsing')} <RequiredIndicator />
                </>
              }
              inputId="validation-method"
            >
              <div className={styles.validationRadioGroup}>
                <RadioButton
                  id="validation-dob"
                  name="validationMethod"
                  value="dob"
                  label={t('step1.dateOfBirth')}
                  checked={field.state.value === 'dob'}
                  onChange={() => field.handleChange('dob')}
                />
                <RadioButton
                  id="validation-pan"
                  name="validationMethod"
                  value="pan"
                  label={t('step1.pan')}
                  checked={field.state.value === 'pan'}
                  onChange={() => field.handleChange('pan')}
                />
              </div>
            </InputGroup>
          )}
        />
      );

      inputs.push(
        <form.Subscribe
          key="validation-field"
          selector={(state) => state.values.validationMethod}
          // eslint-disable-next-line react/no-children-prop
          children={(validationMethod) =>
            validationMethod === 'dob' ? renderDobField() : renderPanField()
          }
        />
      );
    }

    if (needsDebitCard) {
      inputs.push(
        <form.Field
          key="debit"
          name="debitCardNumber"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const serverError = getServerError(serverErrors, 'debitCard');
            const fieldError = field.state.meta.errors?.[0] as
              | string
              | undefined;
            const errorText =
              serverError ||
              (field.state.meta.isTouched ? fieldError : undefined);
            return (
              <InputGroup
                label={
                  <>
                    {t('step1.debitCardNumber')} <RequiredIndicator />
                  </>
                }
                inputId="debit-card-number"
                helpText={!errorText ? t('step1.debitCardHelpText') : undefined}
                errorText={errorText}
              >
                <TextInput
                  id="debit-card-number"
                  type="tel"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.replace(/\D/g, ''))
                  }
                  placeholder={t('step1.debitCardPlaceholder')}
                  maxLength={16}
                  error={!!errorText}
                />
              </InputGroup>
            );
          }}
        />
      );
    }

    if (needsUcicPassword) {
      inputs.push(
        <form.Field
          key="ucic"
          name="ucic"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const serverError = getServerError(serverErrors, 'ucic');
            const fieldError = field.state.meta.errors?.[0] as
              | string
              | undefined;
            const errorText =
              serverError ||
              (field.state.meta.isTouched ? fieldError : undefined);
            return (
              <InputGroup
                label={
                  <>
                    {t('step1.ucic')} <RequiredIndicator />
                  </>
                }
                inputId="ucic"
                helpText={!errorText ? t('step1.ucicHelpText') : undefined}
                errorText={errorText}
              >
                <TextInput
                  id="ucic"
                  type="tel"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.replace(/\D/g, ''))
                  }
                  placeholder={t('step1.ucicPlaceholder')}
                  maxLength={12}
                  error={!!errorText}
                />
              </InputGroup>
            );
          }}
        />
      );
      inputs.push(
        <form.Field
          key="password"
          name="password"
          // eslint-disable-next-line react/no-children-prop
          children={(field) => {
            const serverError = getServerError(serverErrors, 'password');
            const fieldError = field.state.meta.errors?.[0] as
              | string
              | undefined;
            const errorText =
              serverError ||
              (field.state.meta.isTouched ? fieldError : undefined);
            return (
              <InputGroup
                label={
                  <>
                    {t('step1.password')} <RequiredIndicator />
                  </>
                }
                inputId="password"
                helpText={!errorText ? t('step1.passwordHelpText') : undefined}
                errorText={errorText}
              >
                <TextInput
                  id="password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t('step1.passwordPlaceholder')}
                  maxLength={64}
                  error={!!errorText}
                />
              </InputGroup>
            );
          }}
        />
      );
    }

    return <>{inputs}</>;
  };

  if (isLoadingTerms) {
    return (
      <div className={classNames(styles.login, className)} style={style}>
        <Card className={styles.loginCard}>
          <div className={styles.formContainer}>
            <div className={styles.headingsContainer}>
              <div className={styles.skeletonHeadingLarge} />
              <div className={styles.skeletonHeadingSmall} />
            </div>

            <div className={styles.fieldsContainer}>
              {/* Mobile Number field */}
              <div>
                <div className={styles.skeletonLabel} />
                <div className={styles.skeletonInput} style={{ marginTop: 8 }} />
                <div className={styles.skeletonHelpText} style={{ marginTop: 6 }} />
              </div>

              {/* Verify using radio group */}
              <div>
                <div className={styles.skeletonLabel} />
                <div className={styles.skeletonRadioGroup}>
                  <div className={styles.skeletonRadio} />
                  <div className={styles.skeletonRadio} />
                </div>
              </div>

              {/* Date field */}
              <div>
                <div className={styles.skeletonLabel} />
                <div className={styles.skeletonInput} style={{ marginTop: 8 }} />
                <div className={styles.skeletonHelpText} style={{ marginTop: 6 }} />
              </div>
            </div>

            {/* Terms consent group */}
            <div className={styles.skeletonConsentGroup}>
              <div className={styles.skeletonConsentItem}>
                <div className={styles.skeletonCheckbox} />
                <div className={styles.skeletonConsentText} />
              </div>
              <div className={styles.skeletonConsentItem}>
                <div className={styles.skeletonCheckbox} />
                <div className={styles.skeletonConsentTextShort} />
              </div>
            </div>

            <div className={styles.skeletonFooter} />
            <div className={styles.skeletonButton} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={classNames(styles.login, className)} style={style}>
      <Card className={styles.loginCard}>
        <div className={styles.formContainer}>
          <div className={styles.headingsContainer}>
            <Heading level={2}>{t('step1.title')}</Heading>
            <Heading level={3}>{t('step1.customerDetails')}</Heading>
          </div>

          {generalError && (
            <Paragraph
              style={{
                color: '#dc2626',
                marginBottom: '1rem',
                padding: '0.5rem',
                backgroundColor: '#fef2f2',
                borderRadius: '4px',
              }}
            >
              {generalError}
            </Paragraph>
          )}

          <div className={styles.fieldsContainer}>
            {credentials.startsWith('mobile_') && (
              <form.Field
                name="mobileNumber"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => {
                  const serverError = getServerError(serverErrors, 'mobile');
                  const fieldError = field.state.meta.errors?.[0] as
                    | string
                    | undefined;
                  const errorText =
                    serverError ||
                    (field.state.meta.isTouched ? fieldError : undefined);
                  return (
                    <InputGroup
                      label={
                        <>
                          {t('step1.mobileNumber')} <RequiredIndicator />
                        </>
                      }
                      inputId="mobile-number"
                      helpText={
                        !errorText ? t('step1.mobileHelpText') : undefined
                      }
                      errorText={errorText}
                    >
                      <TextInput
                        id="mobile-number"
                        type="tel"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value.replace(/\D/g, ''))
                        }
                        leftAdornment={
                          <span className={styles.mobilePrefix}>+91</span>
                        }
                        maxLength={10}
                        error={!!errorText}
                      />
                    </InputGroup>
                  );
                }}
              />
            )}

            {renderValidationInputs()}
          </div>

          <div className={styles.consentGroup}>
            {termsError && (
              <Paragraph style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                {termsError}
              </Paragraph>
            )}
            {terms.map((term) => (
              <LoginTerms
                key={term.id}
                id={`term-${term.id}`}
                checked={acceptedTermIds.has(term.id)}
                onViewDetails={() => handleOpenConsent(term)}
                label={term.summary}
              />
            ))}
          </div>

          <Paragraph className={styles.footerText}>
            {t('step1.termsText')}{' '}
            <Link href="/terms">{t('step1.termsLink')}</Link> {t('common.and')}{' '}
            <Link href="/privacy">{t('step1.privacyLink')}</Link>.
          </Paragraph>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            // eslint-disable-next-line react/no-children-prop
            children={([canSubmit, isSubmitting]) => (
              <CtaButton
                appearance="primary"
                onClick={form.handleSubmit}
                disabled={!canSubmit || !allTermsAccepted || externalSubmitting}
                className={styles.continueButton}
              >
                {isSubmitting || externalSubmitting
                  ? t('step1.processing')
                  : t('step1.continue')}
              </CtaButton>
            )}
          />
        </div>
      </Card>

      {activeConsent && (
        <ConsentModal
          isOpen
          onClose={() => handleDisagree()}
          onAgree={() => handleAgree()}
          onDisagree={() => handleDisagree()}
          title={t('common.consentDetails')}
          summary={activeConsent.summary}
          content={activeConsent.content}
          documentLink={activeConsent.documentUrl}
        />
      )}
    </div>
  );
}
