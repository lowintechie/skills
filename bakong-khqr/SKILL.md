---
name: bakong-khqr
description: Bakong KHQR and Open API payment integration across backend and web/mobile clients. Use when implementing or debugging KHQR generation, KHQR verification/parsing, deeplink generation, token lifecycle (request/verify/renew), transaction status polling by md5/hash, or Bakong account checks.
---

# Bakong

Implement and troubleshoot Bakong KHQR payment flows from QR generation through payment-status reconciliation.

## Quick Workflow

1. Confirm integration mode: static KHQR, dynamic KHQR, or deeplink.
2. Choose where QR is generated: merchant backend (recommended) or client SDK.
3. Generate KHQR and capture `md5`/hash metadata for status checks.
4. Display QR with clear expiration and enforce timeout handling.
5. Obtain and maintain Open API token (`request_token` -> `verify` -> `renew_token`).
6. Poll transaction status until success, fail, or QR timeout.
7. Reconcile order state and notify the client UI.

## Integration Rules

1. Keep unique transaction IDs for each generated dynamic QR.
2. Set QR expiration at or below 10 minutes for dynamic payment UX and polling control.
3. Use MD5 status checks only for dynamic KHQR.
4. Treat `not found` as retriable only while QR is still valid.
5. Stop polling when status is final (`success` or `failed`) or when QR expires.
6. Store enough metadata to retry checks (`md5`, full hash, short hash, merchant/order IDs, expiry time).

## Open API Flow

1. Register integration via `POST /v1/request_token`.
2. Verify code via `POST /v1/verify` and store issued token securely.
3. Renew token via `POST /v1/renew_token` before expiry.
4. Check payment state using one of:
   - `POST /v1/check_transaction_by_md5`
   - `POST /v1/check_transaction_by_hash`
   - `POST /v1/check_transaction_by_short_hash`
5. Optionally use:
   - `POST /v1/generate_deeplink_by_qr`
   - `POST /v1/check_bakong_account`

## Implementation Notes

1. Generate and sign business-critical fields server-side where possible.
2. Return only safe fields to clients (QR string/image, expiry, channel label, transaction reference).
3. Add idempotency around order finalization to handle repeated status callbacks/polls.
4. Log API request IDs, response code, and error code to simplify reconciliation.
5. Keep environment-specific base URLs and tokens in secrets, never in client bundles.

## Debugging Checklist

1. Validate KHQR string format before showing it to users.
2. Confirm token is active and not expired when calling status APIs.
3. Verify `md5`/hash was captured from the exact QR payload used by payer.
4. Confirm polling stops at expiry and marks timeout cleanly.
5. Compare results across MD5 and full-hash endpoints when diagnosis is unclear.

## References

- Open API endpoints and request/response examples: `references/open-api.md`
- KHQR SDK features and cross-platform usage notes: `references/khqr-sdk.md`
- End-to-end QR payment integration flow and operational notices: `references/qr-payment-integration.md`
- JavaScript `ts-khqr` quick usage examples: `references/ts-khqr-examples.md`
