// Run with: node test.js
// All numbers below are made up (serial 0000/000) to exercise the date rules.
const assert = require("assert");
const { decodeNic, ageOn } = require("./script.js");

const d = (nic) => {
  const r = decodeNic(nic);
  return r.error ? r.error : `${r.year}-${String(r.month).padStart(2, "0")}-${String(r.day).padStart(2, "0")} ${r.gender}`;
};

// Fixed 366-day table: February always has 29 days.
assert.strictEqual(d("199503100000"), "1995-01-31 Male");
assert.strictEqual(d("199503200000"), "1995-02-01 Male");
assert.strictEqual(d("199606000000"), "1996-02-29 Male"); // leap year: day 60 is 29 February
assert.match(d("199506000000"), /29 February/); // non-leap year: day 60 does not exist
assert.strictEqual(d("199506100000"), "1995-03-01 Male"); // day 61 is 1 March in every year
assert.strictEqual(d("199606100000"), "1996-03-01 Male");
assert.strictEqual(d("200914700000"), "2009-05-26 Male"); // the non-leap case that used to show 27 May
assert.strictEqual(d("199514300000"), "1995-05-22 Male");
assert.strictEqual(d("199614300000"), "1996-05-22 Male");
assert.strictEqual(d("199536600000"), "1995-12-31 Male");

// Women: day number + 500
assert.strictEqual(d("199562300000"), "1995-05-02 Female");
assert.strictEqual(d("199586600000"), "1995-12-31 Female");

// Old format: 19 + first two digits; V or X, any case
assert.strictEqual(d("951230000V"), "1995-05-02 Male");
assert.strictEqual(d("956230000x"), "1995-05-02 Female");

// Invalid input
assert.match(d("199536700000"), /out of range/);
assert.match(d("199550000000"), /out of range/);
assert.match(d("199500000000"), /out of range/);
assert.match(d("95123000V"), /9 digits/);
assert.match(d("9512300001"), /9 digits/);
assert.match(d("abc"), /9 digits/);

// Age turns over on the birthday
assert.strictEqual(ageOn({ year: 1995, month: 5, day: 2 }, new Date(2026, 4, 1)), 30);
assert.strictEqual(ageOn({ year: 1995, month: 5, day: 2 }, new Date(2026, 4, 2)), 31);

assert.strictEqual(d("95 123 0000 v"), "1995-05-02 Male"); // spaces and lower case
console.log("All NIC tests passed.");
