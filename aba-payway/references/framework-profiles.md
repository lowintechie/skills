# ABA PayWay Framework Profiles

Use this reference to map the same PayWay flow into different frameworks.
Treat Next.js as the primary profile for this version of the skill.

## Common Core (All Frameworks)

1. Keep `ABA_PAYWAY_API_KEY` on the server only.
2. Build unsigned purchase fields in canonical order.
3. Generate hash with `HMAC-SHA512` and base64 output.
4. Return `{ apiUrl, formFields }` from server to client.
5. Populate hidden form and call `AbaPayway.checkout()` on client.
6. Parse callback payloads from both JSON and form-urlencoded.

## Next.js (Primary Profile)

1. Implement `POST /api/payway/checkout` in an App Router route handler.
2. Implement `GET/POST /api/payway/callback` route handlers.
3. Keep runtime Node-compatible for crypto and callback parsing.
4. Use existing repository examples as default implementation.

## React SPA (Without Fullstack Framework)

1. Build or use a backend service for checkout signing and callback endpoints.
2. Keep React app responsible only for checkout UI and endpoint calls.
3. Reuse the same hidden-form strategy and PayWay script boot sequence.

## Vue SPA (Without Nuxt)

1. Build or use a backend service for checkout signing and callback endpoints.
2. Keep Vue app responsible only for checkout UI and endpoint calls.
3. Reuse the same hidden-form strategy and PayWay script boot sequence.

## Nuxt

1. Implement checkout and callback in Nuxt server routes.
2. Keep signing logic in server runtime only.
3. Reuse the same client hidden-form and checkout opening flow.

## Porting Checklist

1. Preserve field names exactly as PayWay expects (`req_time`, `merchant_id`, etc.).
2. Preserve field concatenation order before hashing.
3. Preserve amount and phone normalization behavior.
4. Ensure callback URL is public and non-localhost.
5. Add debug logging guard (`PAYWAY_DEBUG_LOG`) in callback endpoint.
