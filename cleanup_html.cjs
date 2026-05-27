const fs = require('fs');

const filePath = 'c:/Users/iamud/OneDrive/Desktop/Portfolio/index.html';
let html = fs.readFileSync(filePath, 'utf8');

// Find the first injection point - everything before it is original Framer HTML
const firstInjectHead = html.indexOf('<!-- PORTFOLIO_INJECT_START_HEAD -->');
const firstInjectBody = html.indexOf('<!-- PORTFOLIO_INJECT_START_BODY -->');
const oldTagHead = html.indexOf('<!-- Injected Tailwind CSS CDN');

// Determine where original HTML ends (before any injection)
let cleanEnd = html.indexOf('</head>');

// Get the original Framer HTML only (up to the first </head>)
if (oldTagHead !== -1 && oldTagHead < cleanEnd) {
  // Old style injection exists - find the original </head> which comes after injections
  // The original content ends at the position of the FIRST injection
  const origHtml = html.substring(0, oldTagHead).trimEnd();
  // Now find the corresponding </head> and </body> in remaining parts
  // Just restore to clean by stripping everything between first injection and </head>
  // and between portfolio-root div and </body>
  html = html.replace(/\s*<!-- Injected Tailwind[\s\S]*?<\/style>\s*/g, '');
  html = html.replace(/\s*<!-- PORTFOLIO_INJECT_START_HEAD -->[\s\S]*?<!-- PORTFOLIO_INJECT_END_HEAD -->\s*/g, '');
  html = html.replace(/\s*<!-- PORTFOLIO_INJECT_START_BODY -->[\s\S]*?<!-- PORTFOLIO_INJECT_END_BODY -->\s*/g, '');
  // Remove old script tags that were injected
  html = html.replace(/\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, '');
  html = html.replace(/\s*<script>\s*tailwind\.config[\s\S]*?<\/script>\s*/g, '');
  // Remove old injected style blocks
  html = html.replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^"]*outfit[^"]*" rel="stylesheet">\s*/gi, '');
  html = html.replace(/\s*<style>\s*:root \{[\s\S]*?<\/style>\s*/g, '');
  // Remove old injected body divs (portfolio-root, etc)
  html = html.replace(/\s*<div id="portfolio-root">[\s\S]*?<\/div>\s*<!-- PORTFOLIO_INJECT_END_BODY -->/g, '');
  html = html.replace(/\s*<div id="portfolio-root">[\s\S]*?<\/div>\s*<\/body>/g, '\n</body>');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Cleaned. HTML size:', html.length);
console.log('Remaining injections:', (html.match(/Injected Tailwind/g) || []).length);
