const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const source = fs.readFileSync(
  path.join(__dirname, "../components/games/bible-game-data.ts"),
  "utf8"
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { quizQuestions, peopleQuestions, memoryPairs, sequences, shuffle } = context.exports;

test("every quiz can form a five-question round with exactly one valid answer per question", () => {
  for (const bank of [quizQuestions, peopleQuestions]) {
    assert.ok(bank.length >= 5);
    assert.equal(new Set(bank.map((q) => q.question)).size, bank.length);
    for (const q of bank) {
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4);
      assert.equal(q.options.filter((answer) => answer === q.answer).length, 1);
      assert.ok(q.reference && q.explanation);
    }
  }
  assert.ok(peopleQuestions.every((q) => q.hint));
});

test("memory deck has six unambiguous pairs and all cards survive shuffling", () => {
  assert.equal(memoryPairs.length, 6);
  const cards = memoryPairs.flatMap(([person, object]) => [person, object]);
  assert.equal(new Set(cards).size, 12);
  assert.deepEqual(Array.from(shuffle(cards)).sort(), Array.from(cards).sort());
  assert.ok(memoryPairs.every((pair) => pair.length === 3 && pair[2]));
});

test("order games contain unique movable items and a reference", () => {
  for (const puzzle of sequences) {
    assert.equal(new Set(puzzle.items).size, puzzle.items.length);
    assert.ok(puzzle.items.length >= 3 && puzzle.reference);
  }
});

test("shuffle preserves every item and never changes its input", () => {
  const original = Object.freeze(["a", "b", "c", "d", "e"]);
  for (let i = 0; i < 30; i++) {
    const result = shuffle(original);
    assert.notEqual(result, original);
    assert.deepEqual(Array.from(result).sort(), Array.from(original));
  }
  assert.equal(shuffle([]).length, 0);
  assert.deepEqual(Array.from(shuffle(["a"])), ["a"]);
});
