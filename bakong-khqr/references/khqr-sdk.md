# KHQR SDK Reference

Cleaned reference from the "KHQR SDK Documentation" source (Version 2.7, Dec 2020, with updates through Jul 2023 in changelog sections).

## Overview

KHQR SDK supports generating and validating Cambodia KHQR payloads for Bakong-compatible payment flows.

## Core Capabilities

- Generate individual KHQR
- Generate merchant KHQR
- Verify KHQR validity
- Decode KHQR payload
- Generate KHQR deeplink

## Language Support (from source)

- iOS
- Java
- C#
- JavaScript

This reference is JavaScript-focused for practical implementation.

## Install (JavaScript)

```bash
npm init -y
npm install bakong-khqr
```

## JavaScript API Surface

Import pattern from source examples:

```js
const {
  BakongKHQR,
  khqrData,
  IndividualInfo,
  MerchantInfo,
  SourceInfo
} = require("bakong-khqr");
```

### 1) Generate Individual KHQR

```js
const optionalData = {
  currency: khqrData.currency.usd,
  amount: 100.5,
  mobileNumber: "85512233455",
  storeLabel: "CoffeeShop",
  terminalLabel: "Cashier_1",
  purposeOfTransaction: "oversea",
  languagePreference: "km",
  merchantNameAlternateLanguage: "John",
  merchantCityAlternateLanguage: "Phnom Penh",
  upiMerchantAccount: "0001034400010344ABCDEFGHJIKLMNO"
};

const individualInfo = new IndividualInfo(
  "john_smith@devb",
  "JohnSmith",
  "PHNOMPENH",
  optionalData
);

const khqr = new BakongKHQR();
const result = khqr.generateIndividual(individualInfo);

if (result.status.code === 0) {
  console.log(result.data.qr);
  console.log(result.data.md5);
}
```

### 2) Generate Merchant KHQR

```js
const optionalData = {
  currency: khqrData.currency.usd,
  amount: 100.5,
  mobileNumber: "85512233455"
};

const merchantInfo = new MerchantInfo(
  "khqr@devb",
  "JohnSmith",
  "PHNOMPENH",
  "123456",
  "DevBank",
  optionalData
);

const khqr = new BakongKHQR();
const result = khqr.generateMerchant(merchantInfo);

if (result.status.code === 0) {
  console.log(result.data.qr);
  console.log(result.data.md5);
}
```

### 3) Verify KHQR

```js
const khqrString = "<khqr-string>";
const verification = BakongKHQR.verify(khqrString);
console.log(verification.isValid);
```

### 4) Decode KHQR

```js
const khqrString = "<khqr-string>";
const decoded = BakongKHQR.decode(khqrString);
console.log(decoded.status, decoded.data);
```

Typical decoded fields from source examples:
- `merchantType`
- `bakongAccountID`
- `merchantID`
- `acquiringBank`
- `billNumber`
- `mobileNumber`
- `storeLabel`
- `terminalLabel`
- `purposeOfTransaction`
- `merchantCategoryCode`
- `transactionCurrency`
- `transactionAmount`
- `countryCode`
- `merchantName`
- `merchantCity`
- `timestamp`
- `crc`

### 5) Generate Deeplink

```js
const khqr = new BakongKHQR();
const sourceInfo = new SourceInfo(
  "http://cdn.example.com/icons.logo.png",
  "ExampleApp",
  "http://app.example.com"
);

khqr
  .generateDeepLink(
    "http://api.example.com/v1/generate_deeplink_by_qr",
    "<khqr-string>",
    sourceInfo
  )
  .then((response) => {
    if (response.status.code === 0) {
      console.log(response.data.shortLink);
    } else {
      console.log(response.status.message);
    }
  });
```

Note: short links can differ for each call.

## Standard Response Model

The source uses a common shape:

```json
{
  "status": {
    "code": 0,
    "errorCode": null,
    "message": "message"
  },
  "data": {
    "qr": "<khqr-string>",
    "md5": "<md5-hash>"
  }
}
```

## Response Keys

- `status.code`: `0` success, `1` failed
- `status.errorCode`: detailed validation/runtime code
- `status.message`: human-readable result
- `data`: operation-specific payload

## Selected Error Codes (from source table)

| Code | Meaning |
| --- | --- |
| `1` | Bakong account ID cannot be null or empty |
| `2` | Merchant name cannot be null or empty |
| `3` | Bakong account ID is invalid |
| `4` | Amount is invalid |
| `8` | KHQR provided is invalid |
| `9` | Currency type cannot be null or empty |
| `13` | Cannot reach Bakong Open API service |
| `14` | SourceInfo for deeplink is invalid |
| `15` | Internal server error |
| `28` | Unsupported currency |
| `29` | Deeplink URL is not valid |
| `30` | Merchant ID cannot be null or empty |
| `31` | Acquiring bank cannot be null or empty |
| `34` | Mobile number length is invalid |
| `35` | Tag not in order |
| `42` | Purpose of transaction length is invalid |
| `43` | UPI account information length is invalid |

## Integration Notes

- Use generated `md5` for dynamic KHQR transaction-status checks.
- Keep QR expiration aligned with your polling timeout policy.
- Validate KHQR before display if your flow accepts external QR input.
- Keep deeplink generation server-controlled when business logic requires auditability.

## Related References

- Open API details: `open-api.md`
- End-to-end QR flow: `qr-payment-integration.md`
- `ts-khqr` examples: `ts-khqr-examples.md`
