import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const files = readdirSync('modules').filter(f => f.endsWith('.html'));
let errors = 0;
for (const file of files) {
  const html = readFileSync(join('modules', file), 'utf-8');
  // Tangkap seluruh blok <script ...>...</script>
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
  scripts.forEach((m, i) => {
    const attrs = m[1] || '';
    // Skip JSON / importmap
    if (/type\s*=\s*["'](application\/(ld\+json|json)|importmap)/i.test(attrs)) return;
    // Skip skrip eksternal yang menggunakan src="..."
    if (/src\s*=/i.test(attrs)) return;
    const code = m[2];
    if (!code.trim()) return;
    const tmp = join(tmpdir(), `check-${file}-${i}.js`);
    writeFileSync(tmp, code);
    try { execFileSync('node', ['--check', tmp]); }
    catch (e) { console.error(`❌ ${file} #${i+1}: ${String(e.stderr||e).slice(0,200)}`); errors++; }
  });
  console.log(`✅ ${file}`);
}
if (errors) { console.error(`❌ ${errors} syntax errors`); process.exit(1); }
console.log('✅ All modules valid');
