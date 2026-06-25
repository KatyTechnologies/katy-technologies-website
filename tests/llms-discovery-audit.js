const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const llmsPath = path.join(root, 'llms.txt');
let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(message);
  }
}

assert(fs.existsSync(llmsPath), 'llms.txt: missing root file');
const text = fs.existsSync(llmsPath) ? fs.readFileSync(llmsPath, 'utf8') : '';

assert(!text.startsWith('\uFEFF'), 'llms.txt: should not include a BOM');
assert(text.startsWith('# Katy Technologies\n'), 'llms.txt: first section must be H1 site name');
assert(/^> Katy Technologies helps companies speed up manual workflows with practical AI and custom software\./m.test(text), 'llms.txt: missing required blockquote summary');
assert(text.includes('This file contains the full public text of the Katy Technologies website for LLM inference use.'), 'llms.txt: missing full-text purpose note');
assert(text.includes('The site is a static marketing site; it does not expose a public product API, login flow, checkout, MCP server, or self-service documentation portal.'), 'llms.txt: missing capability boundary');

const headings = [...text.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
assert(JSON.stringify(headings) === JSON.stringify(['Website text', 'Discovery notes']), 'llms.txt: H2 sections should be Website text and Discovery notes');
assert(!text.includes('## Primary pages'), 'llms.txt: should not include Primary pages section');
assert(!text.includes('## Optional'), 'llms.txt: should not include Optional section');

for (const required of [
  'Speed Up The Work That Slows Your Team Down.',
  'Automation should make work easier to trust, not harder to explain.',
  'Economic consulting: We built an internal assistant for a Boston-area economic consulting firm.',
  'Ticket vendors: We built custom email annotation software for a California ticket vendor.',
  "Hospitality: Currently, we're helping a luxury hotel chain based in Southern California.",
  "Travel operations: We're building a hotel-sourcing operating system for a travel operations team that manages room blocks for touring productions.",
  "Smart glasses: We're building the memory layer for a heads-up assistant on Meta Ray-Ban Display glasses.",
  'Internal systems: We connect automation to the systems you already run, like your CRM, ticketing queue, and shared spreadsheets.',
  "Practical AI support: AI drafts, summarizes, and routes the work that used to pile up in someone's inbox.",
  'Custom workflow software: We build software around your real handoffs and approvals, not a generic template.',
  'Risk-aware automation: Every automated step keeps a record: who approved it, what changed, and when.',
  'Operational visibility: A dashboard flags the exact step where work waits longest, whether that is intake, review, or approval.',
  'Workflow improvement: We improve one workflow at a time and measure the result before moving on.',
  'You think, we build.',
  'Talk through a bottleneck'
]) {
  assert(text.includes(required), `llms.txt: missing site text ${required}`);
}

for (const removed of ['/about', '/careers', '/solutions', '/contact']) {
  assert(!text.includes(`https://katytechnologies.com${removed}`), `llms.txt: should not link removed route ${removed}`);
}

if (failed) process.exit(1);
console.log('LLMS discovery audit passed');
