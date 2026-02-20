# ts-khqr Examples

## Links

- Bakong site: https://bakong.nbc.gov.kh/
- Android app: https://play.google.com/store/apps/details?id=jp.co.soramitsu.bakong
- iOS app: https://apps.apple.com/in/app/bakong/id1440829141
- ts-khqr GitHub: https://github.com/ishinvin/ts-khqr
- ts-khqr package: https://www.npmjs.com/package/ts-khqr

## Install

```bash
npm install ts-khqr
```

## Generate KHQR

```ts
import { KHQR, CURRENCY, COUNTRY, TAG } from "ts-khqr";

const result = KHQR.generate({
  tag: TAG.INDIVIDUAL, // or TAG.MERCHANT
  accountID: "ishinvin@devb",
  merchantName: "Ishin Vin",
  merchantID: "012345678",
  acquiringBank: "Dev Bank",
  merchantCity: "Phnom Penh",
  currency: CURRENCY.KHR,
  amount: 10000,
  countryCode: COUNTRY.KH,
  merchantCategoryCode: "5999",
  expirationTimestamp: Date.now() + 60 * 1000,
  additionalData: {
    mobileNumber: "85512345678",
    billNumber: "INV-2022-12-25",
    storeLabel: "Ishin Shop",
    terminalLabel: "012345",
    purposeOfTransaction: "Payment",
  },
  languageData: {
    languagePreference: "ZH",
    merchantNameAlternateLanguage: "文山",
    merchantCityAlternateLanguage: "金边",
  },
});

console.log(result.status.code, result.data?.qr, result.data?.md5);
```

## Verify KHQR

```ts
import { KHQR } from "ts-khqr";

const isKHQR = KHQR.verify("<khqr-string>").isValid;
console.log(isKHQR);
```

## Parse KHQR

```ts
import { KHQR } from "ts-khqr";

const parsed = KHQR.parse("<khqr-string>");
console.log(parsed.data);
```

## Notes

- `md5` from generated dynamic KHQR is used by Bakong transaction-status APIs.
- Keep QR expiration bounded and align polling window to expiration.
