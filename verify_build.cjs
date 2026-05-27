const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
console.log('No theme-toggle button:', !h.includes('id="theme-toggle"'));
console.log('No theme-toggle CSS:', !h.includes('#theme-toggle'));
console.log('theme cmd in terminal:', h.includes('toggle dark/light'));
console.log('clear cmd exists:', h.includes('clear: function()'));
console.log('initTheme exists:', h.includes('function initTheme'));
