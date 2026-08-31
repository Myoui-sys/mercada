import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const featuresDir = new URL('../tests/features/', import.meta.url);
const outputDir = new URL('../tests/zephyr/', import.meta.url);
const outputFile = new URL('mercatta-test-cases.csv', outputDir);

const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
const toZephyrGherkin = (line) => {
  if (line.startsWith('|')) return `  ${line}`;

  return line
    .replace(/^Dado\b/, 'Given')
    .replace(/^Quando\b/, 'When')
    .replace(/^Então\b/, 'Then')
    .replace(/^E\b/, 'And')
    .replace(/^Mas\b/, 'But');
};
const rows = [['Name', 'Objective', 'Precondition', 'Test Script (BDD)', 'Labels', 'Priority']];

for (const file of readdirSync(featuresDir).filter((name) => name.endsWith('.feature')).sort()) {
  const text = readFileSync(new URL(file, featuresDir), 'utf8');
  const feature = text.match(/^Funcionalidade:\s*(.+)$/m)?.[1]?.trim() ?? file.replace('.feature', '');
  const scenarioPattern = /^\s*Cenário:\s*(.+)\r?\n([\s\S]*?)(?=^\s*Cenário:|(?![\s\S]))/gm;
  let match;

  while ((match = scenarioPattern.exec(text)) !== null) {
    const name = match[1].trim();
    const body = match[2]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^(Dado|Quando|Então|E|Mas)\b/.test(line) || /^\|.*\|$/.test(line));
    const firstAction = body.findIndex((line) => /^(Quando|Então)\b/.test(line));
    const preconditions = body.slice(0, firstAction < 0 ? 0 : firstAction).join('\n');
    // O importador BDD do Zephyr valida os passos com as palavras-chave
    // canônicas em inglês, mesmo quando a descrição do cenário está em português.
    const testScript = body.map(toZephyrGherkin).join('\n');
    const isPerformance = file === 'performance.feature';

    rows.push([
      name,
      `Validar o cenário "${name}" da funcionalidade "${feature}".`,
      preconditions,
      testScript,
      `mercatta,${isPerformance ? 'performance,manual' : 'bdd,automatizado'}`,
      isPerformance ? 'High' : 'Normal',
    ]);
  }
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, `${rows.map((row) => row.map(quote).join(',')).join('\n')}\n`, 'utf8');
console.log(`Gerados ${rows.length - 1} casos em ${outputFile.pathname}`);
