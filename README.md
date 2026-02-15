```markdown
# Skills

Curated, versioned collection of reusable Codex skills for real-world engineering work.

## Purpose

This repository centralizes skills so they can be reused across projects and teams with consistent quality.

## Included Skills

| Skill | Description | Notes |
|---|---|---|
| `aba-payway` | ABA PayWay checkout integration and troubleshooting | Framework-agnostic, Next.js-first profile |

## Repository Structure

```text
skills/
├── aba-payway/
│   ├── SKILL.md
│   ├── README.md
│   ├── agents/
│   │   └── openai.yaml
│   ├── references/
│   └── scripts/
└── ...
```

## Install a Skill

Install from this repo by skill name:

```bash
npx skills add https://github.com/<your-username>/skills --skill aba-payway
```

Alternative (path-based) install:

```bash
npx skills add <your-username>/skills/aba-payway
```

## Use a Skill in Codex

Invoke directly in prompts with `$skill-name`:

```text
Use $aba-payway to implement secure ABA PayWay checkout.
```

## Add a New Skill

1. Create a new folder using kebab-case naming (example: `stripe-webhook`).
2. Add required `SKILL.md` frontmatter:
   - `name`
   - `description`
3. Add `agents/openai.yaml` with UI metadata.
4. Add optional `references/`, `scripts/`, and `assets/` as needed.
5. Keep docs framework-agnostic when possible, with clear implementation profiles if needed.

## Quality Checklist

- Clear trigger description in `SKILL.md` (`what` + `when to use`).
- Deterministic scripts for fragile logic.
- References for domain rules and field mappings.
- No secrets in examples.
- No machine-specific absolute paths in docs.

## Versioning

Use semantic, reviewable changes per skill and keep changelog notes in pull requests.

## Contributing

Issues and pull requests are welcome for:
- New skills
- Skill improvements
- Bug fixes in scripts or references
- Better cross-framework guidance

## License

MIT (or your preferred license).
```
