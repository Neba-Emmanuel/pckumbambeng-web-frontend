const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
require.extensions['.tsx'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
const { formatSermon } = require('../components/SermonEditor.tsx');
const { SermonText, safeSermonLink } = require('../components/SermonText.tsx');

test('formatting wraps only selected text and leaves surrounding text intact', () => {
  assert.equal(formatSermon('Love your neighbour', 0, 4, 'bold').text, '**Love** your neighbour');
  assert.equal(formatSermon('Love your neighbour', 5, 9, 'italic').text, 'Love *your* neighbour');
  assert.equal(formatSermon('', 0, 0, 'bold').text, '**Your text**');
  assert.equal(formatSermon('Read this', 5, 9, 'link', 'https://example.com/').text, 'Read [this](https://example.com/)');
});
test('block controls apply to full selected lines and preserve other paragraphs', () => {
  assert.equal(formatSermon('Intro\nLove\nHope\nEnd', 6, 15, 'numbers').text, 'Intro\n1. Love\n2. Hope\nEnd');
  assert.equal(formatSermon('- Love\n- Hope', 0, 13, 'quote').text, '> Love\n> Hope');
  assert.equal(formatSermon('Message', 3, 3, 'heading').text, '# Message');
});
test('public renderer produces headings, emphasis, lists and quotes', () => {
  const html = renderToStaticMarkup(React.createElement(SermonText, { text: '# Hope\n\n**Love** and *faith*\n\n- Be kind\n- Pray\n\n1. Listen\n2. Act\n\n> Give thanks' }));
  for (const tag of ['<h3', '<strong>Love</strong>', '<em>faith</em>', '<ul', '<ol', '<blockquote']) assert.ok(html.includes(tag), tag);
  assert.ok(!html.includes('**Love**'));
});
test('HTML is escaped and dangerous links never become clickable', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,hello', '//evil.example', 'https://user:password@example.com']) assert.equal(safeSermonLink(href), null);
  const html = renderToStaticMarkup(React.createElement(SermonText, { text: '<script>alert(1)</script>\n[Bad](javascript:alert)\n[Good](https://example.com)' }));
  assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('href="javascript:')); assert.ok(html.includes('href="https://example.com/"'));
});
test('existing plain text preserves paragraphs and line breaks', () => {
  const html = renderToStaticMarkup(React.createElement(SermonText, { text: 'First line\nSecond line\n\nLast paragraph' }));
  assert.ok(html.includes('First line<br/>Second line'));
  assert.equal((html.match(/<p>/g) || []).length, 2);
});
