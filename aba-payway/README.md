# ABA PayWay Skill

Reusable Codex skill for integrating and debugging ABA PayWay checkout across modern web stacks.

## Current Scope

- Framework-agnostic checkout and callback workflow
- Canonical purchase hash field order and signing rules
- Client hidden-form checkout flow with script readiness checks
- Callback payload parsing (JSON + form-urlencoded)
- Debug workflow for signature mismatches

## Framework Support

- Next.js (primary profile in this version)
- React (with separate backend signing endpoint)
- Vue (with separate backend signing endpoint)
- Nuxt (with server routes)
- Other frameworks with equivalent server/client separation

## Quick Use

Invoke the skill in Codex prompts with:

```text
Use $aba-payway to implement secure ABA PayWay checkout (Next.js first, then adapt to React, Vue, or Nuxt).
```

## Skill Files

- `SKILL.md`: Core instructions and workflow
- `agents/openai.yaml`: UI metadata and default prompt
- `references/integration.md`: Canonical payload, hash order, env vars, and callback behavior
- `references/framework-profiles.md`: Porting guide by framework
- `scripts/payway-purchase-hash-debug.js`: Local hash debugging utility

## Hash Debug Script

```bash
node .agents/skills/aba-payway/scripts/payway-purchase-hash-debug.js \
  --payload /absolute/path/to/purchase-fields.json \
  --api-key your-api-key
```

If `--api-key` is omitted, the script uses `ABA_PAYWAY_API_KEY` from the environment.

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

## Non-Negotiables

- Never expose `ABA_PAYWAY_API_KEY` to client code.
- Keep purchase field order exact before hashing.
- Keep only one PayWay checkout form instance per page.
- Keep callback URL publicly reachable (not localhost).
