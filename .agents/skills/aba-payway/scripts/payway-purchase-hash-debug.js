#!/usr/bin/env node

const { createHmac } = require("node:crypto");
const { readFileSync } = require("node:fs");

const FIELD_ORDER = [
  "req_time",
  "merchant_id",
  "tran_id",
  "amount",
  "firstname",
  "lastname",
  "email",
  "phone",
  "payment_option",
  "return_url",
  "continue_success_url",
  "lifetime",
];

function parseArgs(argv) {
  const out = {
    payload: "",
    apiKey: process.env.ABA_PAYWAY_API_KEY || "",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--payload") {
      out.payload = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--api-key") {
      out.apiKey = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printHelp(0);
    }
  }

  return out;
}

function printHelp(code) {
  const text = [
    "Usage:",
    "  node payway-purchase-hash-debug.js --payload /absolute/path/payload.json [--api-key your-key]",
    "",
    "Notes:",
    "  - payload must include the 12 unsigned purchase fields",
    "  - if --api-key is omitted, ABA_PAYWAY_API_KEY is used",
  ].join("\n");
  process.stdout.write(`${text}\n`);
  process.exit(code);
}

function toText(value) {
  return String(value == null ? "" : value).trim();
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.payload) {
    process.stderr.write("Missing --payload\n");
    printHelp(1);
  }

  if (!args.apiKey) {
    process.stderr.write("Missing API key. Pass --api-key or set ABA_PAYWAY_API_KEY\n");
    process.exit(1);
  }

  const raw = readFileSync(args.payload, "utf8");
  const payload = JSON.parse(raw);

  const missing = FIELD_ORDER.filter((field) => !(field in payload));
  if (missing.length > 0) {
    process.stderr.write(`Missing payload fields: ${missing.join(", ")}\n`);
    process.exit(1);
  }

  const orderedValues = FIELD_ORDER.map((field) => toText(payload[field]));
  const hashInput = orderedValues.join("");
  const hash = createHmac("sha512", args.apiKey)
    .update(hashInput)
    .digest("base64");

  const output = {
    fieldOrder: FIELD_ORDER,
    hashInput,
    hash,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main();
