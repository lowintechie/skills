# Bakong KHQR Skill

Reusable Codex skill for implementing and debugging Bakong KHQR payment flows with Bakong Open API transaction checks.

## Current Scope

- Dynamic and static KHQR integration guidance
- KHQR generation, verification, and parsing workflows
- Token lifecycle flow (`request_token`, `verify`, `renew_token`)
- Transaction status checks (`md5`, full hash, short hash)
- Deeplink and account-check endpoint usage

## Quick Use

Invoke the skill in Codex prompts with:

```text
Use $bakong to implement or debug Bakong KHQR generation and Open API transaction-status checks.
```

## Skill Files

- `SKILL.md`: Core workflow, rules, and debugging checklist
- `agents/openai.yaml`: UI metadata and default prompt
- `references/open-api.md`: Clean endpoint reference and payload samples
- `references/qr-payment-integration.md`: End-to-end payment flow and polling logic
- `references/khqr-sdk.md`: KHQR SDK reference (JS-focused)
- `references/ts-khqr-examples.md`: Practical `ts-khqr` snippets

## Environment Endpoints

- SIT: `https://sit-api-bakong.nbc.org.kh`
- Production: `https://api-bakong.nbc.org.kh`

## Integration Non-Negotiables

- Keep transaction IDs unique for each generated dynamic QR.
- Keep dynamic QR expiry bounded (typically <= 10 minutes).
- Use MD5 status checks only for dynamic KHQR.
- Stop polling on final status or QR expiry.
- Keep tokens and secrets server-side only.
