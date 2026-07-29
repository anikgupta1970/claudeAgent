import type { ReactNode } from 'react';
import { Button } from '@api-banking/design.actions.button';
import { Link } from '@api-banking/design.navigation.link';
import { Modal } from '@api-banking/design.overlays.modal';
import { Paragraph } from '@api-banking/design.typography.paragraph';
import { useTranslation } from 'react-i18next';
import styles from './consent-modal.module.scss';

export type ConsentModalProps = {
  /**
   * Controls whether the modal is open or closed.
   */
  isOpen: boolean;

  /**
   * A function to be called when the modal is requested to be closed, for example, by clicking the overlay or the close button.
   */
  onClose?: () => void;

  /**
   * The title displayed in the modal's header.
   * @default 'Consent Details'
   */
  title?: string;

  /**
   * The summary content for the consent item. Can be a string or any React node.
   * @default 'I/we have read, understood, and hereby accept the Privacy Policy.'
   */
  summary?: ReactNode;

  /**
   * The full inline content of the consent item.
   * Displayed below the summary when provided.
   */
  content?: ReactNode;

  /**
   * The URL for the full consent document.
   * @default 'https://pixabay.com/get/g3a7f6207282de90657451b124fc932ae604ab96df73e6f18739d0769cd097169d977ffaa5860eb3c14401873b0051ce5b096a99e1028a66294faaeb0bd55509f_1280.jpg'
   */
  documentLink?: string;

  /**
   * A function to be called when the user clicks the 'Accept' button.
   */
  onAgree?: () => void;

  /**
   * A function to be called when the user clicks the 'Cancel' button.
   */
  onDisagree?: () => void;

  /**
   * An optional CSS class name to apply to the modal's container.
   */
  className?: string;

  /**
   * An optional style object to apply to the modal's container.
   */
  style?: React.CSSProperties;
};

/**
 * A modal dialog for displaying detailed information about a specific consent item.
 * It allows users to review a summary, access a full document, and agree or disagree.
 */
export function ConsentModal({
  isOpen,
  onClose = () => {},
  title,
  summary = 'I/we have read, understood, and hereby accept the Privacy Policy.',
  content,
  documentLink = 'https://pixabay.com/get/g3a7f6207282de90657451b124fc932ae604ab96df73e6f18739d0769cd097169d977ffaa5860eb3c14401873b0051ce5b096a99e1028a66294faaeb0bd55509f_1280.jpg',
  onAgree = () => {},
  onDisagree = () => {},
  className,
  style,
}: ConsentModalProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('common.consentDetails');

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title={resolvedTitle}
      className={className}
      style={style}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.summaryContainer}>
          <p className={styles.summaryTitle}>{t('common.summary')}</p>
          <Paragraph>{summary}</Paragraph>
        </div>
        {content && (
          <div className={styles.contentContainer}>
            <Paragraph>{content}</Paragraph>
          </div>
        )}
        <Link href={documentLink} external target="_blank">
          {t('common.viewDocument')}
        </Link>
        <div className={styles.actionsContainer}>
          <Button appearance="tertiary" onClick={() => onDisagree()}>
            {t('common.cancel')}
          </Button>
          <Button appearance="primary" onClick={() => onAgree()}>
            {t('common.accept')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}