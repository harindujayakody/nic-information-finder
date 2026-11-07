const assert = require('assert');

// Test the NIC parsing logic
function decodeNIC(nic) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const oldNicPattern = /^[0-9]{9}[vVxX]$/;
    const newNicPattern = /^[0-9]{12}$/;

    let year = "";
    let dayText = 0;

    if (oldNicPattern.test(nic)) {
        year = "19" + nic.substr(0, 2);
        dayText = parseInt(nic.substr(2, 3), 10);
    } else if (newNicPattern.test(nic)) {
        year = nic.substr(0, 4);
        dayText = parseInt(nic.substr(4, 3), 10);
    } else {
        return { valid: false, error: "Invalid NIC NO" };
    }

    let gender = "Male";
    if (dayText > 500) {
        gender = "Female";
        dayText -= 500;
    }

    if (dayText < 1 || dayText > 366) {
        return { valid: false, error: "Invalid NIC NO" };
    }

    let monthIndex = 0;
    let dayNum = dayText;
    for (let i = 0; i < daysInMonths.length; i++) {
        if (dayNum <= daysInMonths[i]) {
            monthIndex = i;
            break;
        }
        dayNum -= daysInMonths[i];
    }

    return {
        valid: true,
        year: year,
        month: monthNames[monthIndex],
        day: dayNum,
        gender: gender,
        dob: `${year}-${monthNames[monthIndex]}-${dayNum}`
    };
}

console.log("Running NIC decoding tests...");

// Old NIC format (9 digits + V/X)
const res1 = decodeNIC("930011234V");
assert.strictEqual(res1.valid, true);
assert.strictEqual(res1.year, "1993");
assert.strictEqual(res1.month, "January");
assert.strictEqual(res1.day, 1);
assert.strictEqual(res1.gender, "Male");

// Old NIC female (500 added)
const res2 = decodeNIC("935011234x");
assert.strictEqual(res2.valid, true);
assert.strictEqual(res2.gender, "Female");
assert.strictEqual(res2.month, "January");
assert.strictEqual(res2.day, 1);

// Leap day boundary: Day 60 -> Feb 29
const res3 = decodeNIC("960601234V");
assert.strictEqual(res3.valid, true);
assert.strictEqual(res3.month, "February");
assert.strictEqual(res3.day, 29);

// Day 61 -> March 1
const res4 = decodeNIC("960611234V");
assert.strictEqual(res4.valid, true);
assert.strictEqual(res4.month, "March");
assert.strictEqual(res4.day, 1);

// Day 214 -> August 1 (verifying no 'Auguest' typo)
const resAug = decodeNIC("932141234V");
assert.strictEqual(resAug.valid, true);
assert.strictEqual(resAug.month, "August");
assert.strictEqual(resAug.day, 1);

// New NIC format (12 digits)
const res5 = decodeNIC("200036612345");
assert.strictEqual(res5.valid, true);
assert.strictEqual(res5.year, "2000");
assert.strictEqual(res5.month, "December");
assert.strictEqual(res5.day, 31);

// Invalid cases
assert.strictEqual(decodeNIC("930001234V").valid, false);  // Day 0
assert.strictEqual(decodeNIC("933671234V").valid, false);  // Day 367
assert.strictEqual(decodeNIC("9312345678").valid, false);  // Missing V/X
assert.strictEqual(decodeNIC("931234567A").valid, false);  // Invalid letter
assert.strictEqual(decodeNIC("12345").valid, false);       // Too short

console.log("All 11 NIC decoding assertions passed!");
