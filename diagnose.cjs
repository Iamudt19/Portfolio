const fs = require('fs');
const filePath = 'c:/Users/iamud/OneDrive/Desktop/Portfolio/index.html';
let html = fs.readFileSync(filePath, 'utf8');

// The original framer HTML ends right before the FIRST injected style/script block
// Strategy: find the </head> tag, then look backwards from it to find any injected content
// We know from analysis the true </head> position without injections

// Find </body> position
const bodyCloseIdx = html.lastIndexOf('</body>');
// Find </html> position  
const htmlCloseIdx = html.lastIndexOf('</html>');

// Find the first occurrence of anything we injected - old style blocks
// The first injection marker in original was at char 77075
// Let's find the first script that loads tailwind from CDN
const tailwindIdx = html.indexOf('<script src="https://cdn.tailwindcss.com">');
const firstOldStyle = html.indexOf('<style>\n    /* Google Fonts import */');
const firstOldStyle2 = html.indexOf('<style>\n    :root {');
const firstFontLink = html.indexOf('<link href="https://fonts.googleapis.com/css2?family=Inter');

// Find the earliest injection
const candidates = [tailwindIdx, firstOldStyle, firstOldStyle2, firstFontLink].filter(x => x > 0);
const firstInjectionStart = Math.min(...candidates);

console.log('First injection starts at:', firstInjectionStart);
console.log('HTML total length:', html.length);

// Everything before firstInjectionStart is the original Framer content
// We need to find the </head> before the injection to restore it
// Then find the original </body>

// Get the original portion of the file (before first injection)
const originalPortion = html.substring(0, firstInjectionStart);
console.log('Original portion ends with:', JSON.stringify(originalPortion.slice(-50)));

// The original portion may not have a proper </head> or </body> close - we need to add them
// Find what's in the original Framer <body>
const originalBodyStart = html.indexOf('<body');
const originalBodyContent = html.substring(originalBodyStart, firstInjectionStart);
console.log('Body content before injections (last 100 chars):', JSON.stringify(originalBodyContent.slice(-100)));
