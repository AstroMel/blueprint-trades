import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--allow-file-access-from-files'] });
for (const [v, w, h] of [['front', 1600, 2000], ['back', 1600, 2000], ['flat', 1400, 1900], ['pair', 2400, 1800]]) {
  const p = await b.newPage(); await p.goto('file://' + process.cwd() + '/render/render.html');
  const url = await p.evaluate(([v, w, h]) => window.renderShot(v, w, h), [v, w, h]);
  fs.writeFileSync(`render/${v}.png`, Buffer.from(url.split(',')[1], 'base64')); console.log(v, 'done'); await p.close();
}
await b.close();
