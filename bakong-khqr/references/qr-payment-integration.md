# Bakong QR Payment Integration Guide

Cleaned reference from the "Bakong QR Pay Integration" source.

## Scope

This guide covers dynamic KHQR payment flow for merchant web/app/POS integrations:
- QR generation
- QR display and expiration
- transaction status checks
- token onboarding and renewal

## Key Terms

- `KHQR`: Cambodia EMVCo-compatible QR format used by Bakong participants.
- `Dynamic KHQR`: QR generated per transaction, usually with amount and expiry.
- `MD5`: Hash derived from KHQR payload, used for transaction-status checks.

## End-to-End Product Flow

1. Customer starts checkout in merchant app/website/POS.
2. Merchant generates KHQR (SDK or backend implementation).
3. Merchant displays QR and expiration time.
4. Customer scans QR with Bakong/bank app and confirms payment.
5. Merchant checks transaction status via Bakong Open API.
6. Merchant finalizes order and notifies customer.

## Integration Models

### Model A: Generate QR on Merchant Backend (recommended)

1. Client requests payment from merchant backend.
2. Backend generates EMVCo KHQR with unique transaction ID and timestamp.
3. Backend returns QR payload (or image URL), transaction ID, channel, and expiry.
4. Client displays QR.
5. Backend polls Bakong transaction API using MD5/hash until final state.
6. Backend updates order status and pushes result to client.

Important:
- Keep transaction ID unique for every generated dynamic QR.
- Keep QR expiration <= 10 minutes.

### Model B: Generate QR on Client using KHQR SDK

1. Client uses KHQR SDK to generate and display QR.
2. Customer pays via Bakong/bank app.
3. Merchant system checks transaction status through Bakong Open API.
4. Merchant updates and shows final status.

Important:
- Still enforce expiration and timeout handling.
- Keep status-check logic server-side where possible.

## Polling and Status Logic

Use this decision process for transaction checks:

1. Start polling immediately after QR is shown.
2. If status is `success` or `failed`, stop polling and finalize.
3. If status is `not found` and QR is not expired, continue polling.
4. If status is `not found` and QR is expired, mark payment as `timeout`.

Recommended implementation details:
- Poll every few seconds with backoff.
- Stop polling at QR expiration deadline.
- Keep order-finalization idempotent.

## Important Notices

- MD5 check API applies to dynamic KHQR only.
- For static KHQR status, source notes bank-side database checks may be required.
- Funds route to Bakong account IDs first (user account or FI settlement account).
- Crediting CASA accounts depends on bank-side implementation (realtime or delayed).
- User notification UX is the integrator's responsibility.

## Prerequisites

- Merchant or integrator has a Bakong account under a commercial bank.
- Team understands KHQR generation and Bakong Open API flows.
- Team can securely store and rotate API tokens.

## Token Onboarding and Renewal

### New token registration

Open:
- SIT: `https://sit-api-bakong.nbc.org.kh/`
- Production: `https://api-bakong.nbc.org.kh/`

Process:
1. Register project (`project`, `organization`, `email`).
2. Receive verification code by email.
3. Verify code.
4. Receive access token.

### Token lifecycle

- Token validity: 90 days.
- Reminder: around 3 days before expiry.

### Renewal

1. Open registration page.
2. Choose renew.
3. Enter registered email.
4. Receive new token by email.
5. Replace old token in integration.

You can also renew by API (`/v1/renew_token`).

## Transaction Check APIs (quick list)

- `POST /v1/check_transaction_by_md5`
- `POST /v1/check_transaction_by_hash`

Both require:
- `Authorization: Bearer <access_token>`
- `Content-Type: application/json`

## Operational Checklist

- Enforce QR expiration and display remaining time.
- Store `md5` and/or transaction hash with order record.
- Retry `not found` only before expiry.
- Stop checks and mark timeout after expiry.
- Audit-log API `responseCode`, `errorCode`, and message.
