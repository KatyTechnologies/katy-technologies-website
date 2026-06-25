const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'css', 'landing.css'), 'utf8');
const landingJs = fs.readFileSync(path.join(root, 'js', 'landing.js'), 'utf8');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(message);
  }
}

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  return match ? match[1] : '';
}

function hasDeclaration(selector, declarationPattern) {
  return declarationPattern.test(rule(selector));
}

assert(hasDeclaration('.brand', /min-height\s*:\s*44px/), 'css/landing.css: .brand should meet the 44px hit-area height');
assert(hasDeclaration('.hero-display', /text-wrap\s*:\s*balance/), 'css/landing.css: .hero-display should balance heading wraps');
assert(hasDeclaration('.manifesto blockquote', /text-wrap\s*:\s*balance/), 'css/landing.css: .manifesto blockquote should balance heading wraps');
assert(hasDeclaration('.svc h3', /text-wrap\s*:\s*balance/), 'css/landing.css: .svc h3 should balance heading wraps');
assert(hasDeclaration('.cta h2', /text-wrap\s*:\s*balance/), 'css/landing.css: .cta h2 should balance heading wraps');
assert(hasDeclaration('.prose', /text-wrap\s*:\s*pretty/), 'css/landing.css: .prose should pretty-wrap body copy');
assert(hasDeclaration('.svc p', /text-wrap\s*:\s*pretty/), 'css/landing.css: .svc p should pretty-wrap service copy');
assert(hasDeclaration('.notes td.nt', /text-wrap\s*:\s*pretty/), 'css/landing.css: .notes td.nt should pretty-wrap notes copy');
assert(hasDeclaration('.notes td.yr', /font-variant-numeric\s*:\s*tabular-nums/), 'css/landing.css: .notes td.yr should use tabular numbers');
assert(hasDeclaration('.foot-mark', /font-variant-numeric\s*:\s*tabular-nums/), 'css/landing.css: .foot-mark should use tabular numbers');
assert(/:where\(\.btn,\.btn-shock,\.nav-email,\.foot-icon-link\):active\s*\{[^}]*transform\s*:\s*scale\(0\.96\)/.test(css), 'css/landing.css: interactive controls should scale to 0.96 on press');
assert(/transition-property\s*:\s*transform,\s*background-color,\s*color,\s*border-color/.test(css), 'css/landing.css: interactive controls should use explicit transition properties');
assert(/\.cta::after\s*\{[^}]*radial-gradient\(circle at 18% 24%,rgba\(248,247,242,\.12\) 0 1px,transparent 1\.35px\)/.test(css), 'css/landing.css: .cta::after should include subtle grain speckles');
assert(!/\.foot\s*\{[^}]*rgba\(/.test(css), 'css/landing.css: .foot should keep its opaque navy cut');
assert(landingJs.includes('clearWillChange'), 'js/landing.js: should clear transient will-change after one-shot animations');

if (failed) process.exit(1);
console.log('Interface polish audit passed');
