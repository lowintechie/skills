# ABA PayWay Integration Reference

This reference captures the canonical ABA PayWay payload and signing logic used in this repository.
Use it as framework-agnostic source of truth. The current implementation baseline is Next.js.

## Environment Variables

Required:
- `ABA_PAYWAY_API_KEY`
- `ABA_PAYWAY_MERCHANT_ID`
- `ABA_PAYWAY_API_URL`

Optional:
- `ABA_PAYWAY_RETURN_URL`
- `ABA_PAYWAY_CONTINUE_SUCCESS_URL`
- `ABA_PAYWAY_LIFETIME`
- `PAYWAY_DEBUG_LOG`

Default sandbox API URL:
- `https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase`

## Server Checkout Contract

Endpoint:
- `POST /api/payway/checkout` (example path; adapt to your framework conventions)

Request body shape:
```json
{
  "amount": "0.01",
  "firstName": "Lowin",
  "lastName": "Techie",
  "phone": "+855978719172",
  "email": "lowin.techie@ababank.com",
  "paymentOption": "abapay_khqr"
}
```

Response shape:
```json
{
  "apiUrl": "...",
  "formFields": {
    "req_time": "...",
    "merchant_id": "...",
    "tran_id": "...",
    "amount": "...",
    "firstname": "...",
    "lastname": "...",
    "email": "...",
    "phone": "...",
    "payment_option": "...",
    "return_url": "...",
    "continue_success_url": "...",
    "lifetime": "...",
    "hash": "..."
  }
}
```

## Canonical Hash Order

Concatenate values in this exact order with no separators:
1. `req_time`
2. `merchant_id`
3. `tran_id`
4. `amount`
5. `firstname`
6. `lastname`
7. `email`
8. `phone`
9. `payment_option`
10. `return_url`
11. `continue_success_url`
12. `lifetime`

Algorithm:
- `HMAC-SHA512`
- secret: `ABA_PAYWAY_API_KEY`
- output encoding: `base64`

## Normalization Rules

- Amount: positive decimal with up to 2 decimals.
- Phone: strip non-digit characters.
- `req_time`: UTC `YYYYMMDDHHmmss`.
- `tran_id`: default `OG${req_time}` when absent.
- URLs: avoid localhost callback or success URLs in final payloads.

## Callback Route Behavior

Endpoint:
- `GET /api/payway/callback` (example path)
- `POST /api/payway/callback` (example path)

Content parsing:
- JSON body for `application/json`
- form entries for `application/x-www-form-urlencoded`

Debug logging:
- Enable only when `PAYWAY_DEBUG_LOG` is `1`, `true`, or `yes`.

## Client Integration Notes

- Load jQuery before `checkout2-0.js`.
- Keep exactly one PayWay form instance per page due fixed ids.
- Populate hidden form fields from server response before calling checkout.

## Framework Notes (Next.js First)

- Next.js: use App Router route handlers for checkout and callback.
- React SPA: call a separate backend endpoint (Express, NestJS, Fastify, etc.) for checkout signing.
- Vue SPA: call a separate backend endpoint for checkout signing and callback handling.
- Nuxt: use server routes for checkout signing and callback handling.
- All frameworks: do not sign in browser code and do not expose `ABA_PAYWAY_API_KEY` to the client.
