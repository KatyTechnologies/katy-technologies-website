const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'about.html', 'solutions.html'];

let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(message);
  }
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const navMatch = html.match(/<nav[^>]*id="site-menu"[^>]*class="[^"]*\bsite-menu\b[^"]*"[^>]*aria-label="Main navigation"[^>]*>/);
  const buttonMatch = html.match(/<button[^>]*class="[^"]*\bmenu-toggle\b[^"]*"[^>]*aria-controls="site-menu"[^>]*aria-expanded="false"[^>]*>/);

  assert(Boolean(navMatch), `${page}: missing shared #site-menu navigation`);
  assert(Boolean(buttonMatch), `${page}: missing accessible hamburger toggle`);
  assert(html.includes('<span class="menu-toggle-label">Menu</span>'), `${page}: missing toggle label`);
  assert(html.includes('<span class="menu-toggle-lines" aria-hidden="true">'), `${page}: missing decorative hamburger lines`);
  assert(/src="js\/nav\.js(?:\?[^"]*)?"/.test(html), `${page}: missing shared nav script`);
}

const css = fs.readFileSync(path.join(root, 'css', 'landing.css'), 'utf8');
assert(css.includes('.menu-toggle'), 'css/landing.css: missing menu toggle styles');
assert(css.includes('.site-head.menu-open'), 'css/landing.css: missing open menu header state');
assert(css.includes('@keyframes menu-panel-in'), 'css/landing.css: missing menu open animation');
assert(css.includes('@keyframes menu-panel-out'), 'css/landing.css: missing menu close animation');
assert(css.includes('.site-head.menu-closing'), 'css/landing.css: missing menu closing state');

const js = fs.readFileSync(path.join(root, 'js', 'nav.js'), 'utf8');
assert(js.includes('aria-expanded'), 'js/nav.js: missing aria-expanded handling');
assert(js.includes('Escape'), 'js/nav.js: missing Escape close handling');
assert(js.includes('menu-closing'), 'js/nav.js: missing animated close state handling');

if (failed) process.exit(1);
console.log('Menu audit passed');
