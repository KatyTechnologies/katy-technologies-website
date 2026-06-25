const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(message);
  }
}

const txtPath = path.join(root, 'agents.txt');
const jsonPath = path.join(root, 'agents.json');
const htaccessPath = path.join(root, '.htaccess');

assert(fs.existsSync(txtPath), 'agents.txt: missing root discovery file');
assert(fs.existsSync(jsonPath), 'agents.json: missing structured companion file');

const txt = fs.existsSync(txtPath) ? fs.readFileSync(txtPath, 'utf8') : '';
const jsonRaw = fs.existsSync(jsonPath) ? fs.readFileSync(jsonPath, 'utf8') : '';
const htaccess = fs.readFileSync(htaccessPath, 'utf8');

assert(!txt.startsWith('\uFEFF'), 'agents.txt: should not include UTF-8 BOM');
assert(txt.includes('# agents.txt'), 'agents.txt: missing title comment');
assert(txt.includes('# Standard: https://agents-txt.com'), 'agents.txt: missing standard comment');
assert(txt.includes('# JSON: https://katytechnologies.com/agents.json'), 'agents.txt: missing JSON companion pointer');
assert(txt.includes('# LLM Content: https://katytechnologies.com/llms.txt'), 'agents.txt: missing llms.txt content pointer');
assert(txt.includes('travel operations hotel-sourcing work'), 'agents.txt: missing travel operations note');
assert(!/^Protocols:/m.test(txt), 'agents.txt: should not declare unsupported payment protocols');
assert(!/^Authorization:/m.test(txt), 'agents.txt: should not declare unsupported authorization protocols');
assert(!/^MCP:/m.test(txt), 'agents.txt: should not declare unsupported MCP endpoints');
assert(!/^Skills:/m.test(txt), 'agents.txt: should not advertise developer-facing repo skills');

let parsed;
try {
  parsed = JSON.parse(jsonRaw);
} catch (error) {
  failed = true;
  console.error(`agents.json: invalid JSON: ${error.message}`);
}

if (parsed) {
  assert(parsed.$schema === 'https://agents-txt.com/schema/agents-json/v1.0.json', 'agents.json: missing v1.0 schema URL');
  assert(parsed.version === '1.0', 'agents.json: missing version 1.0');
  assert(parsed.standard === 'https://agents-txt.com', 'agents.json: missing standard URL');
  assert(parsed.site?.name === 'Katy Technologies', 'agents.json: missing site name');
  assert(parsed.site?.url === 'https://katytechnologies.com', 'agents.json: missing canonical site URL');
  assert(typeof parsed.site?.description === 'string' && parsed.site.description.includes('workflow'), 'agents.json: missing site description');
  assert(parsed.site.description.includes('travel operations hotel-sourcing systems'), 'agents.json: missing travel operations site description');
  assert(parsed.llms?.url === 'https://katytechnologies.com/llms.txt', 'agents.json: missing llms.txt URL');
  assert(typeof parsed.llms?.description === 'string' && parsed.llms.description.includes('full public text'), 'agents.json: missing llms.txt description');
  assert(parsed.llms.description.includes('travel operations hotel-sourcing work'), 'agents.json: missing travel operations llms description');
  for (const unsupported of ['payments', 'authorization', 'mcp', 'skills', 'a2a', 'ucp', 'webmcp']) {
    assert(!(unsupported in parsed), `agents.json: should omit unsupported ${unsupported} block`);
  }
}

assert(/<Files\s+"agents\.txt">[\s\S]*Header\s+set\s+Content-Type\s+"text\/plain;\s*charset=utf-8"[\s\S]*Header\s+set\s+Access-Control-Allow-Origin\s+"\*"[\s\S]*Header\s+set\s+Cache-Control\s+"public,\s*max-age=3600"[\s\S]*<\/Files>/.test(htaccess), '.htaccess: missing agents.txt serving headers');
assert(/<Files\s+"agents\.json">[\s\S]*Header\s+set\s+Content-Type\s+"application\/json"[\s\S]*Header\s+set\s+Access-Control-Allow-Origin\s+"\*"[\s\S]*Header\s+set\s+Cache-Control\s+"public,\s*max-age=3600"[\s\S]*<\/Files>/.test(htaccess), '.htaccess: missing agents.json serving headers');

if (failed) process.exit(1);
console.log('Agents discovery audit passed');
