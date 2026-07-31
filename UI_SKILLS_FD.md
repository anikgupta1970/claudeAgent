# UI Skill — Banking Journey Builder

You are helping build a banking onboarding app. This document defines the journeys you can build and how to handle each one.

Backend capabilities (APIs, schemas, validation rules) are in `Stitch-Skill.md`.

---

## How to Use This Skill

When asked to build a banking onboarding app or any journey in this document:

1. **Identify the product.** Determine which product the user wants (e.g., Open FD). If it is not clear, ask.
2. **Identify the flow.** Present the available flows for that product and ask the user to select one. Do not assume a flow — always ask first.
3. **Build the selected flow.** Implement it according to the specification below.

---

## Global Shell

Applies to every journey unless overridden by the journey spec.

### Brand
- **Logo:** "API BANKING" — top left
- **Language switcher** — top right
- **Background:** light gray
- **Card container:** white card, dark navy border, centered on page

### Progress Stepper
- Horizontal stepper sits at the top of the card
- Each step shows a label; active step is highlighted in navy (`#1a3a5c`)
- Steps are declared per journey (see each journey section)
- Completed steps show a checkmark; future steps are muted

---

## Design Tokens

| Token | Hex / Description | Used For |
|-------|-------------------|---------|
| Navy | `#1a3a5c` | Stepper active, card border, section headings |
| Coral Red | `#e85555` | All primary CTAs, links, error highlights, modal confirm/accept buttons |
| Purple | Brand purple | Selected card-radio border |
| Green | Brand green | Success screen, maturity amounts, account balance positive states |
| Dark overlay | Semi-transparent black | Modal backdrop |

---

## Reusable Component Patterns

### Card Radio
- Selectable option displayed as a card (not a standard radio button)
- Selected state: colored border (purple for product type, navy for other)
- Used for: FD type, interest payout option, funding source

### Modal / Popup
- White card, rounded corners, dark overlay behind
- `×` close button top-right
- Footer: Cancel (outline) + Confirm/Accept (coral red, filled)
- Triggered by: consent links, branch search, add nominee, OTP entry

### OTP Input
- 6 individual single-digit text boxes in a row
- Focus auto-advances to next box on input
- Submit button below
- Shown inside a modal, not a full page

### Consent Popup
- Two independent consent items, each with its own checkbox
- Clicking the consent label opens a modal with summary text + full legal text
- Accept button inside modal marks that consent item as checked
- Both must be accepted before the primary CTA is enabled

### Info Banner
- Inline contextual message below a field or section
- Light background with an info icon — not dismissible

### Read-Only Summary Card
- Displays confirmed data from earlier steps
- Fields shown as label + value pairs — no inputs
- Used on Preview step and Success screen

---

## Product: Open Fixed Deposit (Existing Customer)

When building for this product, say:

> There is currently 1 flow available for an Open Fixed Deposit journey:
>
> **1. Existing Customer** — Customer is an existing bank account holder who wants to open a Fixed Deposit online. Authentication is mobile + OTP based. No KYC is required.
>
> Which flow would you like to build?

Then build based on the selection.

---

### Journey — Flow 1

All steps are defined below. The customer moves through steps in order. They can go back at any time. No data is sent to the bank until Step 4.

```
Login → Deposit Details → Bank Details → Preview → Submit FD
```

---

#### Step 1 — Login

Authenticate the customer via mobile + OTP; resolve their bank identity.

Fields:
- Mobile number (pre-fill `+91`, customer enters 10 digits)
- Verify using — radio toggle: `Date of Birth` (default) ↔ `Pan Number`; swaps the secondary input below
- Date of Birth — date picker; shown when DOB mode is active
- PAN Number — text input; shown when PAN mode is active
- Consent 1 checkbox — must be accepted to enable Continue
- Consent 2 checkbox — must be accepted to enable Continue

**Consent Text:**

| Consent | Checkbox label | Modal body text |
|---------|---------------|-----------------|
| Consent 1 | I agree to the Terms & Conditions | "I authorize API Banking to access my account details and open a Fixed Deposit on my behalf." |
| Consent 2 | I agree to receive communications | "I consent to receive updates, alerts, and notifications related to my Fixed Deposit via SMS and email." |

Clicking a consent label opens a Consent Modal with summary text and full legal text. The Accept button inside the modal marks that consent as checked.

On Continue: open OTP modal. OTP is sent to the customer's registered mobile number.

**OTP Modal:**
- 6 individual single-digit boxes; focus auto-advances on each input
- Submit button enabled once all 6 boxes are filled
- Static hint text below inputs: *"OTP has been sent to your registered mobile number"*
- No countdown timer, no resend, no attempt counter

On OTP Submit: verify customer identity → navigate to Step 2.

**Error States:**
- Customer not found → *"We could not find an account linked to this mobile number. Please check and try again."*
- Invalid DOB or PAN → *"The details entered do not match our records. Please try again."*
- No linked savings account found → *"No linked savings account found. Please contact your branch."*
- Server error → *"Something went wrong. Please try again in a moment."*

---

#### Step 2 — Deposit Details

Customer configures FD parameters; system calculates and displays projected returns.

Product options and input bounds load from bank configuration on step mount. Show a skeleton or spinner over the Interest Payout and Maturity Instruction fields while loading.

Fields:
- Customer summary card (read-only) — shows name, DOB, PAN from Step 1
- FD Type — card radio: `Withdrawable` | `Non-Withdrawable`
- FD Amount — number input; min/max bounds from bank configuration
- Interest Payout — card radio: `At Maturity` | `Monthly` | `Quarterly`; options from bank configuration
- Maturity Instructions — dropdown; options from bank configuration; shows an info banner below the field
- Tenure — 3 numeric inputs: Year / Month / Day; min/max bounds from bank configuration
- **Calculate FD Details** button — triggers maturity calculation; reveals the Maturity Details card below
- Maturity Details card (revealed after calculation) — shows Rate of Interest, Interest Earned, Maturity Amount, Maturity Date

On Continue: validate all fields; navigate to Step 3.

**Error States:**
- Product options fail to load → *"Unable to load product options. Please refresh."* — disable Continue
- Deposit amount out of range → inline error: *"Amount must be between ₹5,000 and ₹1,00,00,000"*
- Tenure out of range → inline error: *"Tenure must be between 7 days and 10 years"*
- Calculation fails → *"Unable to calculate. Please check your inputs and try again."*
- Monthly/quarterly interest with invalid maturity option → *"Renewal options are not available with monthly or quarterly interest payout"*

---

#### Step 3 — Bank Details

Customer selects the funding account/method, picks a branch, and optionally adds a nominee.

Fields:
- FD Funding Amount — read-only, value from Step 2
- Fund via — card radio: `Other Bank` | `HDFC Bank` | `Combined Funds`
  - **HDFC Bank** option shows the linked savings account number (masked) and current balance with a green checkmark
  - **Combined Funds** is not supported in this demo — show an info banner when selected
- Branch search — opens Search Branch modal on click
- Add Nominee — checkbox; opens Add Nominee modal when checked

**Search Branch Modal:**
- Toggle between location-based search and PIN code search
- Location search: State dropdown → City dropdown (filtered by state) → Branch dropdown (filtered by state + city)
- Branch result shows branch name, full address, and IFSC code

**Add Nominee Modal:**
- Relationship — dropdown, options from bank configuration
- Name — text input
- Date of Birth — date picker
- Guardian Details section — revealed automatically if nominee is a minor (age < 18); collects guardian name, relationship, and DOB

**Funding flow:**
- **HDFC Bank** — direct form submission on Confirm; no payment gateway redirect
- **Other Bank** — redirects to payment gateway; form is submitted only after payment is confirmed on return

On Continue: branch must be selected; navigate to Step 4.

**Error States:**
- Branch list fails to load → *"Unable to load branch list. Please try again."*
- No branch selected → *"Please select a branch before continuing."*
- Nominee relationship options fail to load → *"Unable to load relationship options. Please try again."*

---

#### Step 4 — Preview

Full read-only review before submitting. Customer can go back to correct anything.

Sections displayed:

| Section | Fields |
|---------|--------|
| Customer Details | Name, DOB, PAN |
| FD Details | FD Type, Amount, Tenure, Interest Payout, Maturity Instruction, Rate of Interest, Interest Earned, Maturity Amount, Maturity Date |
| Bank Account Details | Linked account (masked), Branch, IFSC |
| Nominee Details | Relationship, Name, DOB (shown only if nominee was added) |

On Confirm:
- Disable the Confirm button immediately
- Show full-card overlay with spinner: *"Submitting your application…"*
- **HDFC Bank:** submit directly to bank → navigate to Step 5
- **Other Bank:** redirect to payment gateway; on return show *"Waiting for payment confirmation…"* overlay → submit to bank → navigate to Step 5
- Back navigation returns to Step 3 with all state preserved

**Error States:**
- Submission fails (validation) → *"Unable to submit. Please check your details."*
- Submission fails (server) → *"Submission failed due to a server error. Please try again."*
- Payment gateway returns failure → *"Payment was not completed. Please try again."* — stay on Step 4, allow retry
- Payment confirmation fails → *"Payment could not be confirmed. Please try again."*

---

#### Step 5 — Submit FD (Success)

Show spinner: *"Processing your application…"*

Poll for application status until `COMPLETED`, `REJECTED`, or `FAILED` (stop after ~20 seconds).

**COMPLETED:**
Show green checkmark and application summary card:
- Reference number
- New FD account number (masked)
- All FD details
- Nominee details (if added)

**Still PROGRESSING after 20 seconds:**
> *"Your application has been submitted and is being processed. Reference ID: [XXXXXX]. You will receive a confirmation shortly."*

**REJECTED or FAILED:**
> *"Your application could not be processed. Please contact support."*

Always show the reference ID. Show a **Back to Home** button that resets the journey.

---

### Flow 1: Existing Customer

**When to use:** Customer is an existing bank account holder opening an FD through the bank's own app or website.

All steps are as defined above. No step overrides apply to this flow.

---

## Adding New Flows or Products

**New flow under an existing product:** Add a `### Flow N:` section, state when to use it, and define only the steps that differ from the shared journey.

**New product:** Add a `## Product:` section with its own "when to ask" prompt, shared journey steps, and flows. Users will select the product first, then the flow.

---

## Component Quick Reference

| Component | Journeys using it |
|-----------|------------------|
| Card Radio | Open FD (FD type, interest payout, fund via) |
| Consent Modal | Open FD Step 1 |
| OTP Modal | Open FD Step 1 |
| Customer Summary Card | Open FD Step 2+ |
| Calculator Result Card | Open FD Step 2 |
| Search Branch Modal | Open FD Step 3 |
| Add Nominee Modal | Open FD Step 3 |
| Read-Only Preview | Open FD Step 4 |
| Success Screen | Open FD Step 5 |
