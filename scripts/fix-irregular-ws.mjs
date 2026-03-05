import { readFileSync, writeFileSync } from 'fs';
const p = 'src/ng-examples/08-remaining-core-ng.tsx';
let s = readFileSync(p, 'utf8');
const escapeVersion = "const irregularWs = 'a\\u00a0b';";
const actualChar = "const irregularWs = 'a\u00a0b';";
if (s.includes(escapeVersion)) {
  s = s.replace(escapeVersion, actualChar);
  writeFileSync(p, s);
  console.log('Replaced with actual NBSP');
} else {
  console.log('Already has actual char or different content');
}
