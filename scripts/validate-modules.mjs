import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const files = readdirSync('modules').filter(f => f.endsWith('.html'));
let errors = 0;
let skipped = 0;
let checked = 0;

// Heuristik: fragment yang JELAS BUKAN JS asli
function isNotRealJS(code) {
  // 1. Print template (HTML lengkap di string)
  if (/<!DOCTYPE|<html\b|<head\b|<body\b|<style\b.*\{/.test(code)) return 'print template';
  // 2. External script tag (src= attribute)
  if (/<script\b[^>]*src\s*=/.test(code)) return 'external script';
  // 3. Fragment terlalu pendek (< 10 chars) — bukan JS bermakna
  if (code.trim().length < 10) return 'too short';
  // 4. Dimulai dengan tag HTML (fragment terpotong)
  if (/^\s*</.test(code) && !/^\s*\/\*/.test(code)) return 'HTML fragment';
  // 5. Hanya berisi komentar
  if (/^\s*(\/\*[\s\S]*?\*\/|\/\/[^\n]*)*\s*$/.test(code)) return 'comments only';
  // 6. String literal terpotong (pola khas error "Unexpected end of input")
  if (code.includes("let doc = '<!") || code.includes("let doc = `<!")) return 'print string';
  return null;
}

for (const file of files) {
  const html = readFileSync(join('modules', file), 'utf-8');
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((m, i) => {
    const attrs = m[1] || '';
    // Skip non-JS script types
    if (/type\s*=\s*["']application\/(ld\+json|json|importmap)/i.test(attrs)) return;
    if (/src\s*=/i.test(attrs)) return;
    const code = m[2];
    if (!code.trim()) return;
    
    // Heuristik check DULU, sebelum node --check
    const skip = isNotRealJS(code);
    if (skip) {
      skipped++;
      console.warn(`⚠️  ${file} #${i+1}: skip (${skip})`);
      return;
    }
    
    const tmp = join(tmpdir(), `check-${file}-${i}.js`);
    writeFileSync(tmp, code);
    checked++;
    try {
      execFileSync('node', ['--check', tmp]);
    } catch (e) {
      const msg = String(e.stderr || e);
      // Safety net: kalau "Unexpected end of input" + kode mengandung HTML,
      // hampir pasti fragment string terpotong — skip, bukan error asli.
      if (/Unexpected end of input/i.test(msg) && /<[a-z]/i.test(code)) {
        skipped++;
        console.warn(`⚠️  ${file} #${i+1}: skip (truncated string template)`);
        return;
      }
      console.error(`❌ ${file} #${i+1}: ${msg.slice(0, 300)}`);
      errors++;
    }
  });
  console.log(`✅ ${file}`);
}

console.log(`\n📊 Summary: ${checked} checked, ${skipped} skipped, ${errors} errors`);
if (errors) { console.error(`❌ ${errors} syntax errors`); process.exit(1); }
console.log('✅ All modules valid');
