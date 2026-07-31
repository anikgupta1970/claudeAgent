# UI Skill — Open Savings Account (New to Bank)

> **DOCUMENTATION ONLY — App generation is NOT supported for this product yet.**
> If a user asks you to build, generate, or scaffold an Open SA journey or app, respond:
> *"I can help you understand the Open SA journey, but I can only build the Open FD journey at this time. Open SA app generation is coming soon."*
> Do not attempt to generate any code for this product.

---

## Product: Open Savings Account (New to Bank)

When asked about this product, say:

> There are 2 flows available for a New to Bank Savings Account journey:
>
> **1. Partner Channel** — Customer is onboarding via a registered partner (e.g., fintech, DSA, co-branded app). KYC is Aadhaar OTP based eKYC only.
>
> **2. Non-Partner Channel** — Customer is onboarding through the bank's own app, website, or branch kiosk. All KYC methods are available.
>
> Which flow would you like to build?

---

## Journey — Both Flows

Steps 1, 2, 3, 5, 6, and 7 are identical across both flows. Step 4 (KYC) differs — see each flow below.

No data is sent to the bank until Step 6.

```
Personal Details → Address → Contact & Employment → KYC → Account Preferences → Preview → Done
```

---

### Step 1 — Personal Details

Fields:
- First name, middle name (optional), last name
- Date of birth
- Gender (dropdown)
- Marital status (dropdown)
- PAN number

On Continue: save in state, move to Step 2.

---

### Step 2 — Address

Fields:
- Address lines, city, state (dropdown), PIN code
- Country — pre-filled as India, read-only

If permanent address is the same as current: show a checkbox. When ticked, hide the permanent address form and copy current address values.

On Continue: save both addresses, move to Step 3.

---

### Step 3 — Contact & Employment

Fields:
- Mobile number (pre-fill +91, customer enters 10 digits)
- Email address
- Occupation (dropdown)
- Source of funds (dropdown)
- Gross annual income slab (dropdown)
- Residential status (dropdown)
- Politically Exposed Person — Yes / No

If residential status is anything other than Resident Individual: show an info message — *"NRI or foreign national accounts require additional documentation. Please contact your branch."*

On Continue: save, move to Step 4.

---

### Step 5 — Account Preferences

Branch selection — "Search Branch" button opens a panel. Search by location (State → City → Branch) or by PIN code.

Nominee (optional) — "Add Nominee" checkbox reveals: relationship, full name, date of birth. If nominee is a minor, show a guardian details form.

Product variant is pre-selected from bank configuration — do not show a product selector.

On Continue: save, move to Step 6.

---

### Step 6 — Preview

Read-only summary of all data entered across steps 1–5. No inline editing.

Sections: Personal Details · Address · Contact & Employment · KYC · Account Preferences · Nominee Details (if added).

On Confirm: disable button → spinner "Submitting your application…" → `POST /forms` → move to Step 7.

---

### Step 7 — Done

Poll `POST /forms/status` until `COMPLETED`, `REJECTED`, or `FAILED` (stop after ~20 seconds).

- **COMPLETED:** Green checkmark + account summary card (reference number, SA account number, customer name, branch, nominee if added).
- **Still PROGRESSING after 20 seconds:** "Your application has been submitted and is being processed. Reference ID: [XXXXXX]."
- **REJECTED or FAILED:** "Your application could not be processed. Please contact support."

Always show the reference ID and a **Back to Home** button.

---

## Flow 1: Partner Channel

**When to use:** Customer is onboarding via a registered partner originator (non-bank channel).

All steps as above. Step 4 is:

### Step 4 — KYC (Partner Channel)

The only available method is **Aadhaar OTP based eKYC**. Do not show a method selector — go directly to the eKYC form.

Fields:
- Aadhaar number (12 digits)
- OTP (6 digits, sent to Aadhaar-linked mobile)
- Transaction ID (from UIDAI eKYC transaction)
- KYC completion date (default: today)

---

## Flow 2: Non-Partner Channel

**When to use:** Customer is onboarding through the bank's own app, website, or branch kiosk.

All steps as above. Step 4 is:

### Step 4 — KYC (Non-Partner Channel)

Show a method selector. Customer picks one of three options:

**Option A — Aadhaar OTP:** Aadhaar number · OTP · Transaction ID · KYC completion date

**Option B — Biometric:** Biometric type (Fingerprint / Facial Recognition / Iris) · Transaction ID · KYC completion date

**Option C — In-Person Verification (OVD):** One or more documents:

| Document | Fields |
|----------|--------|
| Passport | Passport number + expiry date |
| Driving Licence | Licence number + expiry date |
| Voter ID | Voter ID number |

---

## Component Quick Reference (OpenSA)

| Component | Steps using it |
|-----------|---------------|
| Card Radio | Step 4 (KYC method, biometric type) |
| Search Branch Modal | Step 5 |
| Add Nominee Modal | Step 5 |
| Read-Only Preview | Step 6 |
| Success Screen | Step 7 |
