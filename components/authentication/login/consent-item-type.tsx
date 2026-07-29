/**
 * Defines the structure for a consent/term item from the API.
 * Terms can have either a documentUrl (external link) or content (inline text).
 */
export type ConsentItem = {
  /**
   * Unique identifier for the term, e.g., '1', '2'.
   */
  id: string;

  /**
   * A summary of the consent, displayed as the main content.
   */
  summary: string;

  /**
   * A URL pointing to the full consent document (optional).
   */
  documentUrl?: string;

  /**
   * The full content of the consent as inline text (optional).
   * Used when there's no external document URL.
   */
  content?: string;
};
