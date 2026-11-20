// node test.js — checks the solver logic inside index.html
const assert = require('assert');
const src = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const logic = src.split('// ---------- logic')[1].split('// ---------- ui')[0];
const { solve, checkOrder, leaf, merge, OPS, is24, solutions } = new Function(logic.replace(/^.*\n/, '') + 'return {solve, checkOrder, leaf, merge, OPS, is24, solutions}')();
const L = (...ns) => ns.map(leaf);

assert(solve(L(7, 7, 5, 4)));
assert(solve(L(1, 3, 4, 6)));                 // needs fractions: 6 ÷ (1 − 3/4)
assert(solve(L(3, 3, 8, 8)));                 // 8 ÷ (3 − 8/3)
assert(!solve(L(1, 1, 1, 1)));
assert(!solve(L(1, 6, 7, 8)));
assert(solve(L(1, 6, 7, 8, 2)));              // 5 cards

assert(checkOrder(L(7, 7, 5, 4)));            // (7÷7 + 5) × 4
assert(checkOrder(L(7, 5, 7, 4)));            // 7×5 − 7 − 4
assert(!checkOrder(L(7, 7, 4, 5)));           // wrong order
assert(checkOrder(L(3, 4, 1, 6)));            // reversed − and ÷
assert(!checkOrder(L(1, 3, 4, 6)));
assert(checkOrder(L(5, 5, 3, 3)));            // two pairs: 5×5 − 3÷3
const s = solve(L(1, 3, 4, 6));
assert.deepEqual([...s.pair].sort(), [1, 2]); // hint = the 3 and the 4
// manual merges: (7 ÷ 7 + 5) × 4, first card on the left
const [a, b, c, d] = L(7, 7, 5, 4);
const m = merge(merge(merge(a, b, OPS[3]), c, OPS[0]), d, OPS[2]);
assert(is24(m) && m.steps.length == 3);
assert.deepEqual(merge(c, d, OPS[1]).v, [1, 1]);    // 5 − 4
assert(!merge(a, merge(c, c, OPS[1]), OPS[3]));      // ÷ 0
// distinct solutions: order, grouping and − ÷ rewrites of the same expression count once
assert.equal(solutions(L(7, 7, 5, 4)).length, 2);  // (7÷7 + 5) × 4, 7×5 − 7 − 4
assert.equal(solutions(L(1, 2, 3, 4)).length, 4);  // (1+2+3)×4, 1×2×3×4, 2×3×4÷1, (1+3)×(2+4)
assert.equal(solutions(L(3, 3, 8, 8)).length, 1);
assert.equal(solutions(L(1, 1, 1, 1)).length, 0);
console.log('ok');
