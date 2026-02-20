# Bakong Open API Reference

Cleaned reference from the "Bakong Open API Documentation" source (v1.0.2, May 2021).

## Environments

- SIT: `https://sit-api-bakong.nbc.org.kh`
- Production: `https://api-bakong.nbc.org.kh`

Use `{{baseUrl}}` in this document to represent either environment.

## Authentication Model

1. Call `POST /v1/request_token` with project registration details.
2. Verify registration code via `POST /v1/verify`.
3. Store issued token and send it as `Authorization: Bearer <access_token>`.
4. Renew expired token with `POST /v1/renew_token`.

Token lifecycle note from integration guide:
- Token validity: 90 days.
- Reminder: NBC sends notification about 3 days before expiration.

## Endpoint Summary

| Purpose | Method | Endpoint |
| --- | --- | --- |
| Request token | `POST` | `{{baseUrl}}/v1/request_token` |
| Verify token | `POST` | `{{baseUrl}}/v1/verify` |
| Renew token | `POST` | `{{baseUrl}}/v1/renew_token` |
| Generate deeplink | `POST` | `{{baseUrl}}/v1/generate_deeplink_by_qr` |
| Check transaction by MD5 | `POST` | `{{baseUrl}}/v1/check_transaction_by_md5` |
| Check transaction by full hash | `POST` | `{{baseUrl}}/v1/check_transaction_by_hash` |
| Check transaction by short hash | `POST` | `{{baseUrl}}/v1/check_transaction_by_short_hash` |
| Check Bakong account | `POST` | `{{baseUrl}}/v1/check_bakong_account` |

## HTTP Status Codes

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `400` | Bad request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not found |
| `429` | Too many requests |
| `500` | Internal server error |

## Bakong Response Codes

### Top-level `responseCode`

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Failed |

### Common `errorCode` values

| Code | Meaning |
| --- | --- |
| `1` | Transaction could not be found |
| `2` | Static QR is not supported for this check flow |
| `3` | Transaction failed |
| `4` | Error requesting deeplink from provider |
| `5` | Missing required fields |
| `6` | Unauthorized |
| `7` | Email server is down |
| `8` | Email is already registered |
| `9` | Cannot connect to server |
| `10` | Not registered yet |
| `11` | Account ID not found (seen in account check response) |

## API Details

### 1) Request Token

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/request_token`
- Headers: `Content-Type: application/json`

Request body:

```json
{
  "email": "string",
  "organization": "string",
  "project": "string"
}
```

Constraints:
- `email`: max 30 chars
- `organization`: 1-100 chars
- `project`: 1-100 chars

Sample response:

```json
{
  "data": null,
  "errorCode": null,
  "responseCode": 0,
  "responseMessage": "Email has been sent"
}
```

### 2) Verify Token

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/verify`
- Headers: `Content-Type: application/json`

Request body:

```json
{
  "code": "string"
}
```

Constraints:
- `code`: exact length 20 (source specifies min/max 20)

Sample success response:

```json
{
  "data": {
    "token": "<jwt-token>"
  },
  "errorCode": null,
  "responseCode": 0,
  "responseMessage": "Token has been issued"
}
```

### 3) Renew Token

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/renew_token`
- Headers: `Content-Type: application/json`

Request body:

```json
{
  "email": "string"
}
```

Constraints:
- `email`: max 30 chars

Sample success response:

```json
{
  "data": {
    "token": "<jwt-token>"
  },
  "errorCode": null,
  "responseCode": 0,
  "responseMessage": "Token has been issued"
}
```

### 4) Generate Deeplink

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/generate_deeplink_by_qr`
- Headers: `Content-Type: application/json`

Request body:

```json
{
  "qr": "<khqr-string>",
  "sourceInfo": {
    "appIconUrl": "https://example.com/icon.svg",
    "appName": "YourApp",
    "appDeepLinkCallback": "yourapp://payment-result"
  }
}
```

Notes:
- Source marks `sourceInfo` as optional and the nested fields as required when provided.
- Returned short links can differ on each call.

Sample success response:

```json
{
  "data": {
    "shortLink": "https://bakongsit.page.link/..."
  },
  "errorCode": null,
  "responseCode": 0,
  "responseMessage": "Getting deep link successfully"
}
```

### 5) Check Transaction by MD5

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/check_transaction_by_md5`
- Headers:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

Request body:

```json
{
  "md5": "d60f3db96913029a2af979a1662c1e72"
}
```

Constraints:
- `md5`: 1-255 chars

Sample success response:

```json
{
  "responseCode": 0,
  "responseMessage": "Getting transaction successfully.",
  "data": {
    "hash": "8465d722d7d5065f2886f0a474a4d34dc6a7855355b611836f7b6111228893e9",
    "fromAccountId": "payer@bank",
    "toAccountId": "merchant@bank",
    "currency": "USD",
    "amount": 1.0,
    "description": "testing bakong generator"
  }
}
```

Sample failed response:

```json
{
  "data": null,
  "errorCode": 3,
  "responseCode": 1,
  "responseMessage": "Transaction failed."
}
```

Sample not-found response:

```json
{
  "data": null,
  "errorCode": 1,
  "responseCode": 1,
  "responseMessage": "Transaction could not be found. Please check and try again."
}
```

### 6) Check Transaction by Full Hash

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/check_transaction_by_hash`
- Headers:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

Request body:

```json
{
  "hash": "dcd53430d3b3005d9cda36f1fe8dedc3714ccf18f886cf5d090d36fee67ef956"
}
```

Constraints:
- `hash`: 1-255 chars

Response shape is the same as MD5 check.

### 7) Check Transaction by Short Hash

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/check_transaction_by_short_hash`
- Headers:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

Request body:

```json
{
  "hash": "8465d722",
  "amount": 1.0,
  "currency": "USD"
}
```

Constraints:
- `hash`: exactly 8 chars
- `amount`: integer or float
- `currency`: `USD` or `KHR`

Response shape is the same as MD5 check.

### 8) Check Bakong Account

- Method: `POST`
- Endpoint: `{{baseUrl}}/v1/check_bakong_account`
- Headers:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

Request body:

```json
{
  "accountId": "user@bank"
}
```

Success response:

```json
{
  "responseCode": 0,
  "responseMessage": "Account ID exists",
  "errorCode": null,
  "data": null
}
```

Not-found response:

```json
{
  "responseCode": 1,
  "responseMessage": "Account ID not found",
  "errorCode": 11,
  "data": null
}
```

## Integration Notes

- Use MD5 status checks only for dynamic KHQR flows.
- Persist `md5`, full hash, and short hash candidates when possible for fallback checks.
- Treat `responseCode=1` + `errorCode=1` as potentially retryable only while QR is still valid.
