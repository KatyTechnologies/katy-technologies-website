const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, '404.html');

let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(message);
  }
}

assert(fs.existsSync(pagePath), '404.html: missing root 404 page');

const html = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf8') : '';
const css = fs.readFileSync(path.join(root, 'css', 'landing.css'), 'utf8');
const htaccess = fs.readFileSync(path.join(root, '.htaccess'), 'utf8');

assert(html.includes('Page not found - Katy Technologies'), '404.html: missing page title literal');

for (const literal of [
  '404 · Page not found',
  'This',
  'path',
  'stops',
  'here.',
  'Go home',
  'href="mailto:tedkb@sas.upenn.edu" class="nav-email"'
]) {
  assert(html.includes(literal), `404.html: missing ${literal}`);
}

assert(!html.includes('This link may be old'), '404.html: should not include old-link copy');
assert(!html.includes('Start from the homepage'), '404.html: should not include route-helper copy');
assert(!html.includes('class="hero-sub prose"'), '404.html: should not include 404 helper text');
assert(!html.includes('<a class="btn btn-line" href="mailto:tedkb@sas.upenn.edu">Email us</a>'), '404.html: should not include bottom Email us button');
assert(!html.includes('What to do next'), '404.html: should not include the lower guidance section');
assert(!html.includes('class="not-found-panel'), '404.html: should not include the lower guidance panel');
assert(!html.includes('class="marquee"'), '404.html: should not include the scrolling ticker');
assert(!html.includes('mq-track'), '404.html: should not include ticker track markup');

assert(html.includes('<div class="page-atmo" aria-hidden="true"></div>'), '404.html: missing old About static atmosphere');
assert(html.includes('<canvas class="page-static-canvas" aria-hidden="true"></canvas>'), '404.html: missing old About static canvas');
assert(/src="js\/site\.js(?:\?[^"]*)?"/.test(html), '404.html: missing old About static-page script');
assert(!/src="js\/nav\.js(?:\?[^"]*)?"/.test(html), '404.html: should not load removed nav script');
assert(!/src="js\/landing\.js(?:\?[^"]*)?"/.test(html), '404.html: should not load landing WebGL choreography');

for (const href of ['href="/about"', 'href="/careers"', 'href="/solutions"', 'href="/contact"']) {
  assert(!html.includes(href), `404.html: should not contain ${href}`);
}

assert(htaccess.includes('ErrorDocument 404 /404.html'), '.htaccess: missing 404 ErrorDocument');

for (const selector of ['.not-found-page-hero', '.page-atmo', '.page-static-canvas', '.not-found-actions']) {
  assert(css.includes(selector), `css/landing.css: missing ${selector}`);
}
assert(css.includes('background:linear-gradient(160deg,#020812 0%,#0A213A 55%,#263D54 100%)'), 'css/landing.css: missing old About static atmosphere gradient');
assert(css.includes('min-height:100svh'), 'css/landing.css: missing viewport-height hero contract');
assert(css.includes('.js .not-found-title .ln{transform:none !important}'), 'css/landing.css: missing static 404 title override');
assert(css.includes('.not-found-foot .micro{grid-column:1/span 6;color:var(--micro-c);font-size:clamp(1.6rem,5vw,4rem);font-weight:700;line-height:.92;letter-spacing:-.025em;text-transform:uppercase;white-space:nowrap}'), 'css/landing.css: 404 label should keep old color and stay smaller on one line');

if (failed) process.exit(1);
console.log('404 page audit passed');
