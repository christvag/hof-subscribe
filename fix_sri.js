const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove all integrity attributes
const before = html.length;
html = html.replace(/\s*integrity="[^"]*"/g, '');

// Remove crossorigin="anonymous" from local asset tags (CSS/JS links that point to local files)
// Keep crossorigin on preconnect/external links
html = html.replace(/(<(?:link|script)[^>]*(?:href|src)="(?:css|js|imgs)\/[^"]*"[^>]*)\s*crossorigin="anonymous"/g, '$1');
html = html.replace(/(<(?:link|script)[^>]*)\s*crossorigin="anonymous"([^>]*(?:href|src)="(?:css|js|imgs)\/[^"]*")/g, '$1$2');

const after = html.length;
fs.writeFileSync(htmlPath, html);
console.log(`Removed SRI integrity/crossorigin attributes (${before - after} chars removed)`);

// Verify no integrity attrs remain
const remaining = (html.match(/integrity="/g) || []).length;
console.log(`Remaining integrity attributes: ${remaining}`);
