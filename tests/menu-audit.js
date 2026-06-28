const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pages = ["index.html", "404.html"];

let failed = false;

function assert(condition, message) {
  if (!condition) {
    failed = true;
    console.error(message);
  }
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const navMatch = html.match(
    /<nav[^>]*id="site-menu"[^>]*class="[^"]*\bsite-menu\b[^"]*"[^>]*aria-label="Main navigation"[^>]*>/,
  );

  assert(Boolean(navMatch), `${page}: missing shared #site-menu navigation`);
  const links =
    html.match(/<nav[^>]*id="site-menu"[\s\S]*?<\/nav>/)[0].match(/<a\b/g) ||
    [];
  assert(
    links.length === 1,
    `${page}: header menu should only contain the email CTA`,
  );
  assert(
    html.includes('href="mailto:info@katytechnologies.com" class="nav-email"'),
    `${page}: missing header email CTA`,
  );
}

const css = fs.readFileSync(path.join(root, "css", "landing.css"), "utf8");
assert(
  css.includes(".site-head"),
  "css/landing.css: missing shared header styles",
);
assert(
  css.includes(".site-head nav a.nav-email"),
  "css/landing.css: missing header email CTA styles",
);

if (failed) process.exit(1);
console.log("Menu audit passed");
