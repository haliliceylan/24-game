// node test.js — checks the solver logic inside index.html
const assert = require('assert');
const src = require('fs').readFileSync(__dirname + '/index.html', 'utf8');
const logic = src.split('// ---------- logic')[1].split('// ---------- ui')[0];
const { checkOrder, leaf, merge, OPS, is24, solutions } = new Function(logic.replace(/^.*\n/, '') + 'return {checkOrder, leaf, merge, OPS, is24, solutions}')();
const L = (...ns) => ns.map(leaf);

assert(solutions(L(7, 7, 5, 4)).length);
assert(solutions(L(1, 3, 4, 6)).length);                 // needs fractions: 6 ÷ (1 − 3/4)
assert(solutions(L(3, 3, 8, 8)).length);                 // 8 ÷ (3 − 8/3)
assert(!solutions(L(1, 1, 1, 1)).length);
assert(!solutions(L(1, 6, 7, 8)).length);
assert(solutions(L(1, 6, 7, 8, 2)).length);              // 5 cards

assert(checkOrder(L(7, 7, 5, 4)));            // (7÷7 + 5) × 4
assert(checkOrder(L(7, 5, 7, 4)));            // 7×5 − 7 − 4
assert(!checkOrder(L(7, 7, 4, 5)));           // wrong order
assert(checkOrder(L(3, 4, 1, 6)));            // reversed − and ÷
assert(!checkOrder(L(1, 3, 4, 6)));
assert(checkOrder(L(5, 5, 3, 3)));            // two pairs: 5×5 − 3÷3
const [s] = solutions(L(1, 3, 4, 6));
assert.deepEqual([...s.pair].sort(), [1, 2]); // hint = the 3 and the 4
// manual merges: (7 ÷ 7 + 5) × 4, first card on the left
const [a, b, c, d] = L(7, 7, 5, 4);
const m = merge(merge(merge(a, b, OPS[3]), c, OPS[0]), d, OPS[2]);
assert(is24(m) && m.steps.length == 3);
assert.deepEqual(merge(c, d, OPS[1]).v, [1, 1]);    // 5 − 4
assert(!merge(a, merge(c, c, OPS[1]), OPS[3]));      // ÷ 0
// distinct solutions: order, grouping and − ÷ rewrites of the same expression count once
assert.equal(solutions(L(7, 7, 5, 4)).length, 2);  // (7÷7 + 5) × 4, 7×5 − 7 − 4
assert.equal(solutions(L(1, 2, 3, 4)).length, 3);  // (1+2+3)×4, 1×2×3×4 (= 2×3×4÷1), (1+3)×(2+4)
const [p, q] = [[5, 1, 8, 2], [1, 5, 2, 8]].map(h => { const [a, b, c, d] = L(...h); // (5−1)×(8−2) and (1−5)×(2−8)
  return merge(merge(a, b, OPS[1]), merge(c, d, OPS[1]), OPS[2]); });
assert(p.e == q.e && !p.neg && !q.neg);
const [one, four, six] = L(1, 4, 6), x46 = merge(four, six, OPS[2]);            // 4×6×1 and 4×6÷1
assert.equal(merge(x46, one, OPS[2]).e, merge(x46, one, OPS[3]).e);
assert.equal(solutions(L(1, 2, 5, 8)).length, 6);
assert(solutions(L(1, 1, 4, 6)).every(s => !/class=f|−(?=\d)/.test(s.steps.join()))); // plainest steps are shown
assert.equal(solutions(L(3, 3, 8, 8)).length, 1);
assert.equal(solutions(L(1, 1, 1, 1)).length, 0);
console.log('ok');
