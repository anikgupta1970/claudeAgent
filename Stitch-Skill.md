# Stitch Backend Capabilities Reference

Comprehensive reference for all Stitch API and Config Management API capabilities. Generated from `stitch-config-api-oas-27th-Feb.yml`. This file is the single authoritative input for backend capabilities.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Patterns](#common-patterns)
4. [Error Format](#error-format)
5. [Stitch API Endpoints](#stitch-api-endpoints)
6. [Runtime Config Lookup Endpoints](#runtime-config-lookup-endpoints-use-these-in-app-code)
7. [Instruction Types Reference](#instruction-types-reference)
8. [Section Types Reference](#section-types-reference)
9. [Shared Schemas & Validations](#shared-schemas--validations)
10. [Enum Reference](#enum-reference)

---

## Overview

**Stitch** is a banking middleware platform (Quarkus/OpenShift) that orchestrates customer origination, account opening, KYC, and payments via a form-based instruction model.

**Core mental model:** A **Form** contains **Instructions** (what to do: open account, create customer, etc.) and **Sections** (how to pay, who manages it, nominations, etc.). Both are polymorphic objects identified by discriminator fields (`instruction` and `section`).

**Two APIs:**
- **Stitch API** — runtime operations (forms, payments, customer management)
- **Config Lookup API** — runtime configuration lookups (products, branches, enums, originators, apps, terms). Use the `/fi/` prefix endpoints from app code. The admin CRUD endpoints (`/config/mgmt/fi/`) exist but are internal — do not call them from app code.

---

## Authentication

All endpoints use Bearer JWT unless noted.

```
Authorization: Bearer <token>
```

**Token scopes:**
- Standard bearer — most endpoints
- Admin bearer — `POST /auth/token/claims`, `POST /individual-customers/find`

**Get token:** `POST /auth/token/claims`

---

## Common Patterns

### Idempotency

`POST /forms` and `POST /payments` require an idempotency key:

```
Idempotency-Key: <uuid-v4>
```

Repeating the same key with the same body returns the same response without re-processing. Different body with same key returns `422`.

### Async Processing + Polling

`POST /forms` and `POST /payments` return **202 Accepted** immediately. The application is processed asynchronously.

**Poll for status:**
- Simple status: `POST /forms/status` — returns overall application status
- Detailed status: `POST /forms/detailed-status` — returns per-instruction results

**Poll until:** `status` is `COMPLETED`, `REJECTED`, or `FAILED` (not `PROGRESSING`).

### Pagination (Config Lookup API)

The runtime `/fi/` config lookup endpoints return arrays without pagination parameters. Results are filtered via query params (e.g., `code`, `product`, `country`). The internal admin endpoints support `page` and `size` params but those are not available via the runtime endpoints.

### Draft-Aware Lifecycle

All config entities follow: `DRAFT → PUBLISHED` via promote (internal admin flow — not called from app code).

1. Admin creates entity in DRAFT via internal `/config/mgmt/fi/{resource}` endpoints
2. Admin promotes to PUBLISHED via internal promote endpoint

Only PUBLISHED entities are visible and active when queried via the runtime `/fi/` endpoints.

### W3C Distributed Tracing

All endpoints accept optional header:
```
traceparent: 00-{traceId}-{spanId}-{flags}
```
Pattern: `^[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$`

---

## Error Format

All errors use **RFC 7807 Problem Details** (`application/problem+json`):

```json
{
  "status": 400,
  "title": "Bad Request",
  "instance": "/api/endpoint",
  "detail": "Human-readable explanation",
  "violations": [
    {
      "field": "fieldName",
      "in": "body",
      "message": "Constraint violation message"
    }
  ]
}
```

**Common HTTP error codes:** 400, 401, 403, 404, 422, 424, 500

---

## Stitch API Endpoints

### POST /auth/token/claims

Generate a JWT token with customer identity claims.

**Auth:** Bearer (admin scope)  
**Response:** 200 OK

**Request body:**
```json
{
  "clientId": "string",
  "customerId": "string (optional)"
}
```

**Response body:**
```json
{
  "clientId": "string",
  "customerId": "string",
  "isEtbCustomer": true
}
```

---

### POST /ccavenue/callback

CCAvenue payment gateway callback endpoint.

**Auth:** Bearer (global security applies)  
**Content-Type:** `text/plain`  
**Response:** `text/html` — redirect page rendered by Stitch

---

### POST /forms

Submit a banking application form (async).

**Auth:** Bearer  
**Headers required:** `Idempotency-Key: <uuid>`  
**Response:** 202 Accepted

**Request body:**
```json
{
  "instructions": [ /* array of instruction objects */ ],
  "sections": [ /* array of section objects */ ]
}
```

Each instruction object is discriminated by the `instruction` field. Each section object is discriminated by the `section` field.

See [Instruction Types Reference](#instruction-types-reference) and [Section Types Reference](#section-types-reference) for full details.

**Response body:**
```json
{
  "applicationId": "string",
  "status": "PROGRESSING"
}
```

---

### POST /forms/status

Poll the overall status of a submitted form.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "applicationId": "string"
}
```

**Response body:**
```json
{
  "applicationId": "string",
  "status": "PROGRESSING | COMPLETED | REJECTED | FAILED"
}
```

**ApplicationProcessingStatusType** (UPPERCASE):
- `PROGRESSING` — still being processed
- `COMPLETED` — all instructions succeeded
- `REJECTED` — rejected by bank rules
- `FAILED` — system failure

---

### POST /forms/detailed-status

Poll per-instruction results of a submitted form.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "applicationId": "string"
}
```

**Response body:**
```json
{
  "applicationId": "string",
  "status": "progressing | completed | rejected | failed",
  "instructions": [
    {
      "instructionId": "i-1",
      "instructionType": "open_sa",
      "status": "pending | progressing | completed | failed | skipped",
      "problem": { /* RFC 7807 if failed */ },
      "accountNo": "string (for account-opening instructions)"
    }
  ]
}
```

**ApplicationDetailedStatusType** (lowercase): `progressing`, `completed`, `rejected`, `failed`  
**InstructionStatus** (lowercase): `pending`, `progressing`, `completed`, `failed`, `skipped`

---

### POST /individual-customers/fd/calculator

Calculate FD maturity amount for given principal and tenure.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "productVariant": "string",
  "depositAmount": { "amount": "1000.00", "currency": "INR" },
  "tenure": "P1Y6M",
  "openMode": "solo | joint | minor",
  "interestPaymentOption": "at_maturity | monthly | quarterly"
}
```

**Response body:**
```json
{
  "rateOfInterest": 9.5,
  "maturityAmount": { "amount": "1095.00", "currency": "INR" }
}
```

---

### POST /individual-customers/find

Find existing customers by identity attributes.

**Auth:** Bearer (admin scope)  
**Response:** 200 OK

**Request body:**
```json
{
  "mobile": "9087654321",
  "pan": "ABCDE1234F",
  "dob": "1990-01-01"
}
```

**Response body:**
```json
{
  "customers": [
    {
      "customerId": "string",
      "name": "string",
      "mobile": "string",
      "dob": "string",
      "isEtbCustomer": true
    }
  ]
}
```

---

### POST /individual-customers/info/accounts

Get account list for an existing customer.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "customerId": "string (UCIC)"
}
```

**Response body:**
```json
{
  "accounts": [
    {
      "accountNo": "string",
      "productCategory": "fd | sa",
      "status": "string"
    }
  ]
}
```

---

### POST /individual-customers/info/profile

Get profile details for an existing customer.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "customerId": "string (UCIC)"
}
```

**Response body:**
```json
{
  "name": "string",
  "mobile": "string",
  "dob": "1990-01-01",
  "pan": "ABCDE1234F",
  "email": "user@example.com"
}
```

---

### POST /individual-customers/verifications/bank-account

Verify a bank account (IFSC + account number).

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "accountNo": "string",
  "ifsc": "HDFC0000543"
}
```

**Response body:**
```json
{
  "verified": true,
  "name": "Account holder name"
}
```

---

### POST /individual-customers/verifications/upi-vpa

Verify a UPI Virtual Payment Address.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "vpa": "john.doe@paytm"
}
```

**Response body:**
```json
{
  "verified": true,
  "name": "Account holder name"
}
```

---

### POST /payments

Initiate a payment (async).

**Auth:** Bearer  
**Headers required:** `Idempotency-Key: <uuid>`  
**Response:** 202 Accepted

**Request body (`PaymentInitiationArgs`):**
```json
{
  "customer": { /* NewCustomer or ExistingCustomer */ },
  "productCategory": ["sa", "fd"],
  "clientReferenceNumber": "string (12-50 chars, ^[A-Za-z0-9-_]+)",
  "clientSuccessUrl": "https://channel/payment/success",
  "clientFailureUrl": "https://channel/payment/failure",
  "method": "net_banking | upi_collect | upi_intent | upi_qr",
  "instrument": { /* ExternalBankAccount or UPI */ },
  "amount": { "amount": "1000.00", "currency": "INR" }
}
```

**Notes:**
- `clientSuccessUrl` and `clientFailureUrl` required when method is `net_banking`, `upi`, or `upi_collect`
- `instrument` (ExternalBankAccount) required when method is `net_banking`
- `instrument` (UPI) required when method is `upi` or `upi_collect`
- `productCategory` values are **lowercase**: `fd`, `sa`
- `customerId` field is **deprecated** — use `customer` instead

**Response body (`PaymentInitiationResult`):**
```json
{
  "paymentTxnId": "string",
  "upiString": "string (for UPI intent/QR)",
  "paymentLink": {
    "url": "string",
    "method": "POST",
    "parameters": { "key": "value" }
  }
}
```

---

### POST /payments/status

Get the status of an initiated payment.

**Auth:** Bearer  
**Response:** 200 OK

**Request body:**
```json
{
  "clientReferenceNumber": "string (takes priority if both provided)",
  "paymentTxnId": "string"
}
```

**Response body:**
```json
{
  "paymentTxnId": "string",
  "clientReferenceNumber": "string",
  "status": "success | pending | failed"
}
```

---

## Runtime Config Lookup Endpoints (use these in app code)

These are the correct runtime-facing endpoints that app code should call. All endpoints are GET-only and use the `/fi/` prefix. Response codes: 200 (success), 400, 401, 403, 404, 424, 500.

> **Note:** The admin CRUD endpoints (`/config/mgmt/fi/`) exist but are internal — do not call them from app code.

---

### GET /fi/apps

List registered client applications.

**Auth:** Bearer  
**Response:** 200 OK — array of `App` objects

**Query params:**
- `code` — filter by app code (`^[a-z0-9_]+$`)
- `originator` — filter by originator code (`^[a-z0-9_]{3,10}$`)

**Response schema (`App`):**
```json
{
  "code": "swiggy-mobile (^[a-z0-9_]+$)",
  "originator": "swiggy (^[a-z0-9_]{3,10}$)"
}
```

---

### GET /fi/branches

List bank branches for given search criteria.

**Auth:** Bearer  
**Response:** 200 OK — array of `Branch` objects

**Query params:**
- `country` — ISO 3166-1 alpha-2 country code (REQUIRED)
- `city` — city name (`^[A-Za-z0-9]+$`, 1-40 chars)
- `state` — ISO 3166-2 state code
- `postalCode` — 6-digit postal code (`^\d{6}$`)

**Response schema (`Branch`):** Note — no `id` or `status` fields in runtime response.
```json
{
  "code": "string",
  "ifsc": "SBIN0001234 (^[A-Z]{4}0[0-9A-Z]{6}$)",
  "name": "K G Marg (^[A-Za-z ]+, 1-40 chars)",
  "address": "209-214 Kailash Building (^[A-Za-z0-9,\\-.:@()_\\'# ]+, 5-40 chars)",
  "postalCode": "400102 (^\\d{6}$)",
  "city": "Mumbai (^[A-Za-z0-9]+$, 1-40 chars)",
  "state": "IN-MH (ISO 3166-2)",
  "country": "IN (ISO 3166-1 alpha-2)"
}
```

---

### GET /fi/enums

List available enumeration definitions.

**Auth:** Bearer  
**Response:** 200 OK — **Map object** (NOT an array): `{ "enum-name": { name, mode, choices[] } }`

**Query params:**
- `name` — filter by enum name (1-50 chars)
- `mode` — filter by enum mode (`strict` | `lenient`)

**Response schema (`Enumeration` map):**
```json
{
  "gender": {
    "name": "gender",
    "mode": "strict",
    "choices": ["male", "female", "other"]
  },
  "nominee.relationship": {
    "name": "nominee.relationship",
    "mode": "lenient",
    "choices": []
  }
}
```

**Important:** `ClosedEnum.mode` is `"STRICT"` (uppercase) while `OpenEnum` uses `EnumMode` (lowercase `strict`/`lenient`).

---

### GET /fi/enums/{name}/choices

List choices for a specific enumeration.

**Auth:** Bearer  
**Response:** 200 OK — array of choice strings

**Path params:**
- `name` — enum name (REQUIRED, 1-50 chars, `\S`)

**Query params:**
- `choice` — optional filter to match a specific choice

**404 response:** `{ "status": 404, "title": "Not Found", "detail": "Enum choices not found for enum: {enumName}" }`

---

### GET /fi/locations/cities

List cities where a given facility exists.

**Auth:** Bearer  
**Response:** 200 OK — `Cities` object

**Query params:**
- `facility` — facility type (REQUIRED) — currently only `branch`
- `country` — ISO 3166-1 alpha-2 country code
- `state` — ISO 3166-2 state code
- `district` — district name

**Response schema (`Cities`):**
```json
{
  "facility": "branch",
  "country": "IN",
  "state": "IN-MH",
  "district": "Thane",
  "cities": ["Mumbai", "Pune", "Nashik"]
}
```

---

### GET /fi/locations/states

List states where a given facility exists.

**Auth:** Bearer  
**Response:** 200 OK — `States` object

**Query params:**
- `facility` — facility type (REQUIRED) — currently only `branch`
- `country` — ISO 3166-1 alpha-2 country code (REQUIRED)

**Response schema (`States`):**
```json
{
  "facility": "branch",
  "country": "IN",
  "states": ["IN-MH", "IN-KA", "IN-DL"]
}
```

---

### GET /fi/originators

List registered originator (channel partner) codes.

**Auth:** Bearer  
**Response:** 200 OK — array of `Originator` objects

**Query params:**
- `code` — filter by originator code (`^[a-z0-9_]{3,10}$`)

**Response schema (`Originator`):**
```json
{
  "code": "amazon (^[a-z0-9_]{3,10}$)"
}
```

---

### GET /fi/products

List all product variants (FD and SA combined).

**Auth:** Bearer  
**Response:** 200 OK — array of `Product` objects

**Query params:**
- `product` — filter by product name (`^[a-z0-9_]+$`)

**Response schema (`Product`):**
```json
{
  "product": "fd_basic_original",
  "terms": { /* FDProductTerms or SAProductTerms — see /fi/products/fd and /fi/products/sa */ },
  "eligibility": { /* IndividualEligibility or EntityEligibility */ }
}
```

**IndividualEligibility schema:**
```json
{
  "customerType": "individual",
  "age": { "min": { "value": 18, "inclusive": true }, "max": { "value": 70, "inclusive": true } },
  "gender": { "allow": ["male", "female", "other"], "empty": false },
  "staff": { "allow": [false], "empty": false },
  "taxResidency": { "allow": ["IN"], "empty": false },
  "citizenship": { "allow": ["IN"], "empty": false }
}
```

**EntityEligibility schema:**
```json
{
  "customerType": "entity"
}
```

---

### GET /fi/products/fd

List FD product variants with filtering.

**Auth:** Bearer  
**Response:** 200 OK — array of `Product` objects (each with `FDProductTerms`)

**Query params:**
- `product` — product name (`^[a-z0-9_]+$`)
- `currency` — ISO 4217 currency code (e.g., `INR`)
- `customerType` — `individual` | `entity`
- `openMode` — `solo` | `joint` | `minor`
- `nominationMethod` — `successive` | `simultaneous`
- `tenure` — ISO 8601 duration (e.g., `P1Y6M`)
- `initialDeposit` — numeric amount
- `interestPaymentOption` — `at_maturity` | `monthly` | `quarterly`
- `maturityOption` — `close` | `renew` | `transfer`

**FDProductTerms schema:**
```json
{
  "product": "fd_basic_original",
  "terms": {
    "productCategory": "FD",
    "interestPaymentOption": { "allow": ["at_maturity", "monthly", "quarterly"], "empty": false },
    "maturityOption": { "allow": ["close", "renew", "transfer"], "empty": false },
    "tenure": {
      "min": { "value": "P7D", "inclusive": true, "unbounded": false },
      "max": { "value": "P10Y", "inclusive": true, "unbounded": false }
    },
    "initialDeposit": {
      "min": { "value": { "amount": "5000.00", "currency": "INR" }, "inclusive": true },
      "max": { "value": { "amount": "10000000.00", "currency": "INR" }, "inclusive": true }
    }
  }
}
```

---

### GET /fi/products/sa

List SA product variants with filtering.

**Auth:** Bearer  
**Response:** 200 OK — array of `Product` objects (each with `SAProductTerms`)

**Query params:**
- `product` — product name (`^[a-z0-9_]+$`)
- `currency` — ISO 4217 currency code
- `openMode` — `solo` | `joint` | `minor`
- `nominationMethod` — `successive` | `simultaneous`
- `initialDeposit` — numeric amount

**SAProductTerms schema:**
```json
{
  "product": "sa_basic_original",
  "terms": {
    "productCategory": "SA",
    "openMode": { "allow": ["solo", "joint", "minor"], "empty": false },
    "nominationMethod": { "allow": ["successive", "simultaneous"], "empty": false },
    "initialDeposit": {
      "min": { "value": { "amount": "0.00", "currency": "INR" }, "inclusive": true },
      "max": { "value": { "amount": "100000.00", "currency": "INR" }, "inclusive": true }
    }
  }
}
```

---

### GET /fi/terms

List terms and conditions documents.

**Auth:** Bearer  
**Response:** 200 OK — array of `Term` objects

**Query params:**
- `code` — filter by term code (`^[a-z0-9_]+$`)

**Response schema (`Term`):**
```json
{
  "code": "terms_v1 (^[a-z0-9_]+$)",
  "summary": "string (10-500 chars)",
  "url": "https://bank.com/terms (optional, 10-2048 chars)",
  "content": "string (10-2048 chars)"
}
```

---

## Instruction Types Reference

All instructions are submitted in the `instructions` array of `POST /forms`. Each instruction is an object with at minimum `instruction` (discriminator) and `id` (sequential identifier).

**Instruction ID format:** `^i-\d+$`, length 3–4 characters (e.g., `i-1`, `i-10`)

### 1. open_sa — Open Savings Account

```json
{
  "instruction": "open_sa",
  "id": "i-1",
  "openMode": "solo | joint | minor",
  "productVariant": "string (non-whitespace)",
  "branchCode": "string (^[0-9]+$, 1-5 chars)",
  "allocation": { /* AccountNoAllocation */ },
  "holder": { /* SavingsSoloCustomerRef — required when openMode=solo */ },
  "holders": [ /* SavingsJointHolder[], minItems:2 — required when openMode=joint */ ],
  "minor": { /* MinorCustomerRef — required when openMode=minor */ },
  "guardian": { /* GuardianRef — required when openMode=minor */ },
  "operatedBy": "former | anyone | jointly (required when openMode=joint)",
  "accountTitle": "string (^[a-zA-Z0-9 ,.'()\\-]+$, optional)",
  "nomination": { /* Nomination, optional */ },
  "initialDepositAmount": { /* Money, optional */ },
  "linkAccountToAadhar": false
}
```

**AccountNoAllocation** — one of:
- `{ "mode": "generated" }` — bank assigns account number
- `{ "mode": "preferred", "accountId": "string" }` — customer chooses preferred number
- `{ "mode": "predefined", "accountId": "string", "kitId": "string" }` — pre-printed on form

**Result fields:** `accountNo`, `holders[]`

---

### 2. open_fd — Open Fixed Deposit

```json
{
  "instruction": "open_fd",
  "id": "i-1",
  "productVariant": "string (non-whitespace)",
  "depositAmount": { "amount": "10000.00", "currency": "INR" },
  "tenure": "P1Y6M (ISO 8601 duration)",
  "interestPaymentInstruction": { /* InterestPaymentInstruction */ },
  "maturityInstruction": { /* MaturityInstruction */ },
  "branchCode": "string (^[0-9]+$, 1-5 chars)",
  "openMode": "solo | joint | minor",
  "holder": { /* SoloCustomerRef — required when openMode=solo */ },
  "holders": [ /* JointHolder[], exactly 2 — required when openMode=joint */ ],
  "minor": { /* MinorCustomerRef — required when openMode=minor */ },
  "guardian": { /* GuardianRef — required when openMode=minor */ },
  "operatedBy": "former | anyone | jointly (required when openMode=joint)",
  "debitAccount": { /* AccountRef — REQUIRED when ETB customer */ },
  "nomination": { /* Nomination, optional */ }
}
```

**InterestPaymentInstruction:**
```json
{
  "option": "at_maturity | monthly | quarterly",
  "payoutAccount": { /* PayoutAccountRef, required when option != at_maturity */ }
}
```

**MaturityInstruction:**
```json
{
  "option": "close | renew | transfer",
  "payoutAccount": { /* PayoutAccountRef — required when option=close or renew */ },
  "managersCheque": true,
  "renewalOption": "full | principal (required when option=renew)"
}
```

Note: `managersCheque` (boolean) is required when option=`transfer`.

**PayoutAccountRef:**
```json
{
  "type": "account_id | external_account | ref",
  "accountId": "string (required if type=account_id, 10-48 chars)",
  "ref": "string i-X (required if type=ref, must point to open_sa or open_fd instruction)",
  "externalAccount": { /* ExternalAccount (required if type=external_account) */ }
}
```

**Result fields:** `accountNo`, `rateOfInterest`, `maturityAmount`, `holders[]`

---

### 3. record_fd — Record Existing Fixed Deposit

Records an FD that was opened offline/outside Stitch.

```json
{
  "instruction": "record_fd",
  "id": "i-1",
  "accountNo": "string",
  "productVariant": "string",
  "depositAmount": { "amount": "5000.00", "currency": "INR" },
  "tenure": "P1Y",
  "interestPaymentInstruction": { /* InterestPaymentInstruction */ },
  "maturityInstruction": { /* MaturityInstruction */ },
  "branchCode": "string"
}
```

---

### 4. create_ind_customer — Create Individual Customer (NTB)

Creates a new domestic (resident Indian) customer record.

```json
{
  "instruction": "create_ind_customer",
  "id": "i-1",
  "demographics": { /* Demographics — REQUIRED */ },
  "name": { /* PersonName — REQUIRED */ },
  "taxIdentifications": [ /* TaxIdentification[] — REQUIRED */ ],
  "addresses": [ /* PersonAddress[] — REQUIRED */ ],
  "contacts": [ /* Contact[] — REQUIRED */ ],
  "income": { /* Income — REQUIRED */ },
  "fatca": { /* Fatca — REQUIRED */ },
  "isPoliticallyExposed": false,
  "kyc": { /* KYCVerification — REQUIRED */ },
  "signature": { /* PersonSignature, optional */ }
}
```

**Demographics (all required):**
```json
{
  "dob": "1990-01-01",
  "gender": "string",
  "maritalStatus": "string",
  "family": {
    "mother": { /* PersonName */ },
    "father": { /* PersonName */ },
    "spouse": { /* PersonName — required if maritalStatus=married */ }
  },
  "residenceType": "string",
  "nationality": "IN (ISO 3166-1 alpha-2)",
  "occupation": "string"
}
```

**PersonName:**
```json
{
  "firstName": "string (required, max 120 chars total combined)",
  "middleName": "string (optional)",
  "lastName": "string (optional)"
}
```

Note: `firstName` can contain full name. Combined length of firstName+middleName+lastName ≤ 120 chars.

**PersonAddress:**
```json
{
  "type": "mailing | permanent | office",
  "address": {
    "lines": ["string (3-35 chars, min 1 item, no @#$%^*_=+{}[]|<>?!~)"],
    "city": "string (3-35 chars, ^[A-Za-z0-9 ]+$)",
    "state": "IN-MH (ISO 3166-2)",
    "pin": "400076 (^[0-9]{6}$)",
    "country": "IN (ISO 3166-1 alpha-2)"
  }
}
```

**Contacts** — array of one of:
- `MobileContact`: `{ "type": "mobile", "mobile": "9087654321 (E.164)", "category": "personal | work" }`
- `EmailContact`: `{ "type": "email", "email": "user@example.com", "category": "personal | work" }`
- `PhoneContact`: `{ "type": "phone", "phone": "+912212345678 (E.164)", "category": "personal | work", "extension": "123 (optional)" }`

**TaxIdentification** — one of:
- `PanIdentification`: `{ "type": "pan", "pan": "ABCDE1234F", "name": { /* PersonName */ } }`
- `PanApplicationIdentification`: `{ "type": "pan_application", "panApplication": { "date": "2023-10-01", "acknowledgmentNumber": "ACK123 (5-20 chars)" } }`
- Form60 (when PAN not available)

**FATCA:**
```json
{
  "residentialStatus": "string",
  "countryOfBirth": "IN",
  "countryOfNationality": "IN"
}
```

**KYC (KYCVerification)** — one of the modes:
- `aadhaar-otp`: `{ "mode": "aadhaar-otp", "aadhaar": { /* AadhaarOTPVerification */ } }`
- `biometric`: `{ "mode": "biometric", "biometric": { /* BiometricVerification */ } }`
- `in-person`: `{ "mode": "in-person", "ovd": { /* OVDVerification */ } }`

**AadhaarOTPVerification:**
```json
{
  "aadhaarNumber": "string (12 digits)",
  "otp": "123456 (6 digits)",
  "transactionId": "string"
}
```

**BiometricVerification:**
```json
{
  "type": "finger-print | facial-recognition | iris",
  "transactionId": "string"
}
```

**OVDVerification (in-person)** — one of:
- `PassportVerification`: `{ "ovdType": "passport", "verificationCategory": "...", "passportNumber": "M1234567 (8-9 chars)", "expiryDate": "2030-12-31", ... }`
- `DrivingLicenseVerification`: `{ "ovdType": "driving-license", ... }`
- `VoterIdVerification`: `{ "ovdType": "voter-id", ... }`

**OVDType (domestic):** `passport`, `driving-license`, `voter-id`  
**OVDVerificationCategory:** `proof_of_identity`, `proof_of_address`, `proof_of_identity_and_address`, `proof_of_nri_status`

---

### 5. update_ind_customer — Update Individual Customer (ETB)

Updates an existing domestic customer record.

```json
{
  "instruction": "update_ind_customer",
  "id": "i-1",
  "customerId": "string (UCIC)",
  "demographics": { /* Demographics, optional */ },
  "name": { /* PersonName, optional */ },
  "taxIdentifications": [ /* optional */ ],
  "addresses": [ /* optional */ ],
  "contacts": [ /* optional */ ],
  "income": { /* optional */ },
  "fatca": { /* optional */ },
  "isPoliticallyExposed": false,
  "kyc": { /* optional */ }
}
```

---

### 6. create_nri_customer — Create NRI Customer

Creates a new Non-Resident Indian customer record.

```json
{
  "instruction": "create_nri_customer",
  "id": "i-1",
  "demographics": { /* Demographics */ },
  "name": { /* PersonName */ },
  "taxIdentifications": [ /* NRITaxIdentification[] */ ],
  "addresses": [ /* PersonAddress[] */ ],
  "contacts": [ /* Contact[] */ ],
  "income": { /* Income */ },
  "fatca": { /* Fatca */ },
  "isPoliticallyExposed": false,
  "kyc": { /* NRIKYCVerification */ },
  "nriDetails": {
    "countryOfResidence": "US",
    "visaType": "string",
    "passportNumber": "M1234567"
  }
}
```

**NRIOVDType:** `passport`, `driving-license`, `voter-id`, `nrega-job-card`, `visa`, `citizenship-card`

---

### 7. update_nri_customer — Update NRI Customer

Updates an existing NRI customer record. Same structure as `create_nri_customer` with optional fields plus `customerId`.

---

### 8. open_nre_sa — Open NRE Savings Account

Opens a Non-Resident External savings account.

```json
{
  "instruction": "open_nre_sa",
  "id": "i-1",
  "productVariant": "string",
  "openMode": "solo | joint | minor",
  "branchCode": "string (^[0-9]+$, 1-5 chars)",
  "allocation": { /* AccountNoAllocation */ },
  "holder": { /* NRISoloCustomerRef — required when openMode=solo */ },
  "holders": [ /* NRIJointCustomerRef[], minItems:2 — required when openMode=joint */ ],
  "minor": { /* MinorCustomerRef — required when openMode=minor */ },
  "guardian": { /* GuardianRef — required when openMode=minor */ },
  "operatedBy": "former | anyone | jointly (required when openMode=joint)",
  "hasMandateOrPoa": false,
  "accountTitle": "string (^[a-zA-Z0-9 ,.'()\\-]+$)",
  "nomination": { /* NRINomination, optional */ },
  "initialDepositAmount": { /* Money, optional */ }
}
```

---

### 9. open_nro_sa — Open NRO Savings Account

Opens a Non-Resident Ordinary savings account.

```json
{
  "instruction": "open_nro_sa",
  "id": "i-1",
  "productVariant": "string",
  "openMode": "solo | joint | minor",
  "branchCode": "string (^[0-9]+$, 1-5 chars)",
  "allocation": { /* AccountNoAllocation */ },
  "holder": { /* SavingsSoloCustomerRef — required when openMode=solo */ },
  "holders": [ /* SavingsJointHolder[], minItems:2 — required when openMode=joint */ ],
  "minor": { /* MinorCustomerRef — required when openMode=minor */ },
  "guardian": { /* GuardianRef — required when openMode=minor */ },
  "operatedBy": "former | anyone | jointly (required when openMode=joint)",
  "hasMandateOrPoa": false,
  "accountTitle": "string (^[a-zA-Z0-9 ,.'()\\-]+$)",
  "nomination": { /* NRINomination, optional */ },
  "initialDepositAmount": { /* Money, optional */ },
  "linkAccountToAadhar": false
}
```

---

### 10. setup_sweepout — Setup Sweep-Out

Configures automatic sweep-out from a savings account to FD.

```json
{
  "instruction": "setup_sweepout",
  "id": "i-1",
  "accountRef": { /* AccountRef */ },
  "sweepoutConfig": { /* SweepoutConfig */ }
}
```

---

### 11. enable_internet_banking — Enable Internet Banking

```json
{
  "instruction": "enable_internet_banking",
  "id": "i-1",
  "customerId": "string (UCIC, optional for ETB)"
}
```

---

### 12. enable_phone_banking — Enable Phone Banking

```json
{
  "instruction": "enable_phone_banking",
  "id": "i-1",
  "customerId": "string (UCIC, optional for ETB)"
}
```

---

### 13. setup_insta_alerts — Setup Instant Alerts

```json
{
  "instruction": "setup_insta_alerts",
  "id": "i-1",
  "mobile": "9087654321",
  "email": "user@example.com"
}
```

---

### 14. issue_debit_card — Issue Debit Card

```json
{
  "instruction": "issue_debit_card",
  "id": "i-1",
  "accountRef": { /* AccountRef */ },
  "cardVariant": "string",
  "deliveryAddress": { /* PostalAddress */ }
}
```

---

### 15. archive_documents — Archive Documents

Archives documents (images, signatures) associated with the application.

```json
{
  "instruction": "archive_documents",
  "id": "i-1",
  "documents": [
    {
      "type": "string",
      "filePath": "string (^[a-zA-Z0-9_/.-]+$, 1-200 chars)"
    }
  ]
}
```

`filePath` must match what is referenced in `PersonSignature.filePath` fields.

---

## Section Types Reference

All sections are submitted in the `sections` array of `POST /forms`. Each section is discriminated by the `section` field.

**Section ID format:** `^s-\d+$`, length 3–4 characters (e.g., `s-1`, `s-10`)

### payment — PayinSection

Describes how the account funding will be paid. Polymorphic — discriminated by the `method` field.

**PaymentMethod** enum: `cash`, `cheque`, `transfer`, `net_banking`, `upi_collect`, `upi_intent`, `upi_qr`, `upi` (**deprecated**)

**PaymentStatus** enum: `deposited`, `unpaid`, `paid`, `initiated`, `initiated_internally`

All payment section variants share these required fields:
- `section: "payment"`
- `id: "s-1"`
- `method: "<PaymentMethod>"`
- `amount: { "amount": "1000.00", "currency": "INR" }`
- `status: "<PaymentStatus>"`

Fields required **when status is NOT `initiated_internally`**: `paymentDate`, `paymentTxnId`.

**cash:**
```json
{
  "section": "payment", "id": "s-1", "method": "cash",
  "amount": { "amount": "1000.00", "currency": "INR" },
  "status": "deposited",
  "paymentDate": "2025-04-23",
  "paymentTxnId": "999999100000 (12-50 chars)"
}
```

**cheque:**
```json
{
  "section": "payment", "id": "s-1", "method": "cheque",
  "amount": { "amount": "1000.00", "currency": "INR" },
  "status": "deposited",
  "accountId": "string (bank account number)",
  "ifsc": "HDFC0000543",
  "chequeNo": "123456 (exactly 6 digits)",
  "chequeDate": "2025-04-23",
  "depositDate": "2025-04-23",
  "paymentDate": "2025-04-23",
  "paymentTxnId": "999999100000"
}
```

**net_banking:**
```json
{
  "section": "payment", "id": "s-1", "method": "net_banking",
  "amount": { "amount": "1000.00", "currency": "INR" },
  "status": "paid",
  "accountId": "string (external bank account)",
  "ifsc": "HDFC0000543",
  "paymentDate": "2025-04-23",
  "paymentTxnId": "999999100000",
  "pg": { "name": "ccAvenue" }
}
```

**transfer:**
```json
{
  "section": "payment", "id": "s-1", "method": "transfer",
  "amount": { "amount": "1000.00", "currency": "INR" },
  "status": "paid",
  "accountId": "string (internal or external bank account)",
  "ifsc": "HDFC0000543",
  "network": "ift",
  "paymentDate": "2025-04-23",
  "paymentTxnId": "999999100000"
}
```

**PaymentNetwork** enum: `ift` (internal funds transfer)

**upi_collect / upi_intent / upi_qr:**
```json
{
  "section": "payment", "id": "s-1", "method": "upi_collect",
  "amount": { "amount": "1000.00", "currency": "INR" },
  "status": "paid",
  "vpa": "john.doe@paytm (required for upi_collect, ^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$)",
  "pg": { "name": "ccAvenue" },
  "paymentDate": "2025-04-23",
  "paymentTxnId": "999999100000"
}
```

**PaymentGateway name:** pattern `^[a-zA-Z0-9,\\-.:@()_\\ ]{1,40}$`

---

### office-use — OfficeUseSection

Contains internal banking data captured by the RM/originator. Only `id`, `section`, and `originator` are required.

```json
{
  "section": "office-use",
  "id": "s-2",
  "originator": {
    "code": "partner123 (^[a-z0-9_]{3,10}$, must match /fi/originators)",
    "appVersion": "partner1.0 (optional)",
    "referenceNumber": "REF123456789 (12-50 chars, optional)"
  },
  "promotion": {
    "code": "PROM1020 (1-360 chars)"
  },
  "rm": { /* RelationshipManager */ },
  "lead": { /* Lead */ },
  "mis": { /* Mis */ },
  "customer": { /* Customer identifier */ },
  "bda": { /* Bda */ },
  "eligibility": {
    "status": "Normal | Suspicious | Block"
  },
  "location": { /* Geographic location */ }
}
```

---

### nomination — NominationSection

Beneficiary nomination for accounts.

**NominationMethod:** `successive`, `simultaneous`  
**NominationRefType:** `inline`, `ref`, `replicate`

```json
{
  "section": "nomination",
  "id": "s-3",
  "method": "successive | simultaneous",
  "nominees": [
    {
      "ref": "inline | ref | replicate",
      "nominee": {
        "name": { /* PersonName */ },
        "dob": "1990-01-01",
        "relationship": "string",
        "address": { /* PostalAddress */ },
        "sharePct": 100.0
      }
    }
  ]
}
```

**sharePct:** type `number` (not integer), min 1, max 100. All nominees' sharePct must sum to 100.

**Nomination inline object (`Nomination`):**
```json
{
  "nominees": [
    {
      "ref": "inline",
      "nominee": {
        "name": { /* PersonName */ },
        "dob": "1990-01-01",
        "relationship": "string",
        "address": { /* PostalAddress */ },
        "sharePct": 50.0
      }
    }
  ]
}
```

---

### edd — EDDSection

Enhanced Due Diligence section for high-risk customers.

```json
{
  "section": "edd",
  "id": "s-4",
  "riskCategory": "string",
  "sourceOfFunds": "string",
  "purposeOfAccount": "string"
}
```

---

## Shared Schemas & Validations

### Money
```json
{
  "amount": "1000.00 (decimal string)",
  "currency": "INR (ISO 4217)"
}
```

### AccountNo
- Numeric: 10–16 characters
- Alphanumeric: 10–48 characters

### IFSC
Pattern: `^[A-Z]{4}0[A-Z0-9]{6}$` — 11 characters (4 uppercase letters, `0`, 6 alphanumeric)  
Example: `HDFC0000543`, `SBI00012345`

### Mobile
Pattern: 10-digit Indian mobile number (E.164 compatible)  
Example: `9087654321`

### Phone (landline)
Format: E.164  
Example: `+912212345678`

### Email
Standard email format

### PAN
Pattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}` — 10 characters  
Example: `ABCDE1234F`

### Aadhaar
12-digit numeric string

### OTP
Pattern: `^[0-9]{6}$`

### Date fields
Format: ISO 8601 `YYYY-MM-DD`

### Tenure (FD)
Format: ISO 8601 duration  
Example: `P1Y` (1 year), `P6M` (6 months), `P1Y6M` (1 year 6 months)

### State
ISO 3166-2 state code  
Example: `IN-MH` (Maharashtra), `IN-KA` (Karnataka)

### Country
ISO 3166-1 alpha-2 code  
Example: `IN` (India), `US` (United States)

### PostalCode
Pattern: `^[0-9]{6}$` — exactly 6 digits  
Example: `400076`

### Originator.referenceNumber
Pattern: `^[A-Za-z0-9-_]+`, length 12–50  
Originator-assigned tracking reference, not validated by Stitch

### PersonSignature
Provide either:
- `base64Image: "iVBORw0KGgo..."` — base64-encoded image
- `filePath: "/applications/APP123/signature.png"` — path on storage server (`^[a-zA-Z0-9_/.-]+$`, 1-200 chars)

When using filePath, the same path must appear in the `archive_documents` instruction.

### UCIC (Customer ID)
Unique Customer Identification Code:
- Numeric: 6–12 characters
- Alphanumeric (ppid_ format): 6–48 characters

### BranchCode
Pattern: `^[0-9]+$`, length 1–5  
Must match a branch returned by `GET /fi/branches`

### ProductVariant
Pattern: `\S` (non-whitespace) — must match a product name returned by `GET /fi/products`, `GET /fi/products/fd`, or `GET /fi/products/sa`

---

## Enum Reference

### InstructionType
```
open_fd           — Open Fixed Deposit
open_sa           — Open Savings Account
record_fd         — Record existing Fixed Deposit
create_ind_customer     — Create domestic individual customer
update_ind_customer     — Update domestic individual customer
create_nri_customer     — Create NRI customer
update_nri_customer     — Update NRI customer
open_nre_sa       — Open NRE Savings Account
open_nro_sa       — Open NRO Savings Account
setup_sweepout    — Setup sweep-out from SA to FD
enable_internet_banking — Enable internet banking
enable_phone_banking    — Enable phone banking
setup_insta_alerts      — Setup instant alert notifications
issue_debit_card  — Issue debit card
archive_documents — Archive application documents
```

### ProductCategory (lowercase — critical!)
```
fd   — Fixed Deposit
sa   — Savings Account
```

### ApplicationProcessingStatusType (UPPERCASE)
```
PROGRESSING   — Still processing
COMPLETED     — All instructions succeeded
REJECTED      — Rejected by bank rules
FAILED        — System failure
```

### ApplicationDetailedStatusType (lowercase)
```
progressing
completed
rejected
failed
```

### InstructionStatus (lowercase)
```
pending
progressing
completed
failed
skipped
```

### FDAccountOpenMode
```
solo       — Single holder
joint      — Two joint holders
minor      — Minor holder with guardian
```

### AccountOpenMode (SA, NRE SA, NRO SA)
```
solo       — Single holder
joint      — Two joint holders
minor      — Minor holder with guardian
```

### AccountOperatedBy
```
former    — Former or survivor
anyone    — Either or survivor
jointly   — Jointly
```

### AccountNoAllocationMode
```
generated    — Bank assigns automatically
preferred    — Customer's preferred number
predefined   — Pre-printed on physical form (requires kitId)
```

### KYCVerificationMode
```
aadhaar-otp   — Aadhaar-based OTP verification
biometric     — Biometric (fingerprint/facial/iris)
in-person     — In-person with OVD document
```

### BiometricVerificationType
```
finger-print
facial-recognition
iris
```

### OVDType (domestic)
```
passport
driving-license
voter-id
```

### NRIOVDType
```
passport
driving-license
voter-id
nrega-job-card
visa
citizenship-card
```

### OVDVerificationCategory
```
proof_of_identity
proof_of_address
proof_of_identity_and_address
proof_of_nri_status
```

### KYCStatus
```
successful
failed
pending
```

### FDInterestPaymentOption
```
at_maturity   — Interest paid at maturity
monthly       — Monthly interest payout
quarterly     — Quarterly interest payout
```

### FDMaturityOption
```
close    — Close FD and pay out
renew    — Renew FD (full or principal only)
transfer — Transfer via manager's cheque
```

### FDRenewalOption
```
full        — Renew with full maturity amount
principal   — Renew principal only
```

### PaymentMethod
```
cash           — Cash deposit
cheque         — Cheque deposit
transfer       — Bank transfer (internal, network=ift)
net_banking    — Net banking via payment gateway
upi_collect    — UPI collect (payment request to payer)
upi_intent     — UPI intent (redirect to UPI app)
upi_qr         — UPI QR code
upi            — [DEPRECATED] Legacy UPI
```

### PaymentStatus
```
deposited            — Instrument deposited (cheque/cash)
unpaid               — Not yet paid
paid                 — Paid (transfer/net_banking/upi)
initiated            — Started, awaiting confirmation
initiated_internally — Managed outside Stitch
```

### PaymentTransactionStatus
```
success
pending
failed
```

### PaymentNetwork
```
ift   — Internal funds transfer
```

### PayoutAccountRefType
```
account_id       — Direct account ID
external_account — External bank account details
ref              — Reference to another instruction's account
```

### SectionType
```
payment     — PayinSection variants
office-use  — OfficeUseSection
nomination  — NominationSection
edd         — EDDSection
```

### AddressType
```
mailing
permanent
office
```

### ContactType
```
mobile
email
phone
```

### ContactCategory
```
personal
work
```

### EmploymentType
```
salaried
self-employed
self-employed-professional
```

### NominationMethod
```
successive     — Nominees receive payout in sequence
simultaneous   — Nominees receive payout concurrently
```

### NominationRefType
```
inline     — Nominee details provided inline
ref        — Reference to existing nominee
replicate  — Replicate from another account
```

### ProcessingBatchType
```
beginning_of_day   — BOD (morning batch)
end_of_day         — EOD (evening batch)
```

### EligibilityStatus
```
Normal
Suspicious
Block
```

### PassportAddressLocationType
```
domestic   — Indian address
foreign    — Foreign/overseas address
```

### DraftAwareEntityStatus (Config API)
```
DRAFT
PUBLISHED
```

### DraftFor (Config API)
```
ADD
UPDATE
DELETE
```

### EnumType (UPPERCASE)
```
OPEN     — Allows free-text in addition to defined choices
CLOSED   — Only pre-defined choices allowed
```

### EnumMode and ClosedEnum mode casing

**Important casing distinction:**
- `OpenEnum.mode` uses `EnumMode` (lowercase): `strict` | `lenient`
- `ClosedEnum.mode` is always `"STRICT"` (uppercase string literal, not the EnumMode type)

```
EnumMode (lowercase — used by OpenEnum):
  strict    — Strict validation against enum choices
  lenient   — Lenient validation (free-text allowed)

ClosedEnum.mode (uppercase string literal):
  STRICT    — Only pre-defined choices allowed (always STRICT for CLOSED enums)
```

### ResidentialStatus
```
resident_individual      — Resident Individual
non_resident_individual  — Non Resident Individual
foreign_national         — Foreign National
person_of_indian_origin  — Person of Indian Origin
```

### LoginCredentialType
```
mobile_pan   — Login using mobile number and PAN
mobile_dob   — Login using mobile number and date of birth
```

### AccountPermission
```
debit   — Allows debit transactions
```

### Facility
```
branch   — Bank branch facility (physical branch)
```

---

## Cross-Cutting Rules

### NTB vs ETB Flow
- **NTB (New-to-Bank):** Include `create_ind_customer` instruction before account-opening instructions
- **ETB (Existing-to-Bank):** Use existing `customerId`; `debitAccount` required in `open_fd` for ETB

### Instruction Ordering
Stitch processes instructions in the order submitted. Put customer creation before account opening. Put account opening before services (internet banking, debit card, etc.).

### Field Referencing Between Instructions
Use `PayoutAccountRef` with `type: "ref"` and `ref: "i-X"` to reference an account created by another instruction in the same form. The target instruction must be `open_sa` or `open_fd`.

### Originator Code
Must be registered and active (PUBLISHED) in the config system. Look up valid codes via `GET /fi/originators`. The `originator.code` value in `OfficeUseSection` must match a code returned by that endpoint.

### Product Variant
Must match a product registered and active in the config system. Look up valid products via `GET /fi/products`, `GET /fi/products/fd`, or `GET /fi/products/sa`. The `productVariant` must match `product` field in the response, with matching `productCategory` (fd or sa).

### Branch Code
Must match a branch registered and active in the config system. Look up valid branches via `GET /fi/branches`. The `branchCode` must match the `code` field in a branch response object.

### Config Lookup vs Admin Paths
Always use the `/fi/` prefix endpoints for runtime lookups from app code:
- `GET /fi/apps`, `GET /fi/branches`, `GET /fi/enums`, `GET /fi/enums/{name}/choices`
- `GET /fi/locations/cities`, `GET /fi/locations/states`
- `GET /fi/originators`, `GET /fi/products`, `GET /fi/products/fd`, `GET /fi/products/sa`, `GET /fi/terms`

Do NOT use `/config/mgmt/fi/` paths in app code — those are internal admin endpoints.
