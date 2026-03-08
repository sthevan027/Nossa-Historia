#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const iconSrc = path.join(root, 'assets', 'nossa-historia-icon.png');
const publicDir = path.join(root, 'public');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(publicDir, 'icon192.png'));
  fs.copyFileSync(iconSrc, path.join(publicDir, 'icon512.png'));
}
