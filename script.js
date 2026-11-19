// Sri Lankan NIC decoder.
//
// NIC numbers count the birthday as a day of the year in which February ALWAYS has 29 days:
// day 60 is always 29 February and day 61 is always 1 March, leap year or not. Using the real
// calendar instead puts every birthday after February one day late in non-leap years.
// Women have 500 added to the day number.

var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var NIC_MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Returns { year, month (1-12), day, gender, dayNumber, format } or { error }.
function decodeNic(input) {
    var nic = String(input).replace(/\s+/g, "").toUpperCase();
    var year, dayNumber, format;

    if (/^\d{9}[VX]$/.test(nic)) {
        format = "old";
        year = 1900 + parseInt(nic.substr(0, 2), 10);
        dayNumber = parseInt(nic.substr(2, 3), 10);
    } else if (/^\d{12}$/.test(nic)) {
        format = "new";
        year = parseInt(nic.substr(0, 4), 10);
        dayNumber = parseInt(nic.substr(4, 3), 10);
    } else {
        return { error: "Enter 9 digits followed by V or X, or 12 digits." };
    }

    var gender = dayNumber > 500 ? "Female" : "Male";
    var day = dayNumber > 500 ? dayNumber - 500 : dayNumber;
    if (day < 1 || day > 366) {
        return { error: "The day number in this NIC is out of range." };
    }
    if (day === 60 && !isLeapYear(year)) {
        return { error: "This NIC points to 29 February in a year that has no 29 February." };
    }

    var month = 0;
    while (day > NIC_MONTH_DAYS[month]) {
        day -= NIC_MONTH_DAYS[month];
        month++;
    }
    return { year: year, month: month + 1, day: day, gender: gender, dayNumber: dayNumber, format: format };
}

function ageOn(dob, today) {
    var age = today.getFullYear() - dob.year;
    if (today.getMonth() + 1 < dob.month || (today.getMonth() + 1 === dob.month && today.getDate() < dob.day)) {
        age -= 1;
    }
    return age;
}

if (typeof module !== "undefined") {
    module.exports = { decodeNic: decodeNic, ageOn: ageOn };
}

var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var POOLS = { digit: "0123456789", upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", lower: "abcdefghijklmnopqrstuvwxyz" };

function poolFor(c) {
    return /\d/.test(c) ? POOLS.digit : /[A-Z]/.test(c) ? POOLS.upper : /[a-z]/.test(c) ? POOLS.lower : "";
}

// Lottery-style reveal: letters and digits spin, then lock in from left to right.
// Spaces and punctuation stay put. alive() returns false once a newer result replaces this one.
function roll(el, finalText, delay, alive) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = finalText;
        return;
    }
    var duration = 900;
    var start = performance.now() + delay;
    var lastTick = 0;
    function spin(locked) {
        return finalText.split("").map(function (c, i) {
            var pool = poolFor(c);
            return i < locked || !pool ? c : pool[Math.floor(Math.random() * pool.length)];
        }).join("");
    }
    el.textContent = spin(0);
    function frame(now) {
        if (!alive()) return;
        var t = (now - start) / duration;
        if (t >= 1) {
            el.textContent = finalText;
            return;
        }
        // About 20 changes a second: reads as spinning without flicker. Ease-out so it slows as it settles.
        if (now - lastTick > 50) {
            lastTick = now;
            el.textContent = spin(t <= 0 ? 0 : Math.floor((1 - Math.pow(1 - t, 3)) * finalText.length));
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// Browser UI. Results appear after submit; nothing is sent or stored.
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
        var form = document.getElementById("nic-form");
        var input = document.getElementById("nic");
        var msg = document.getElementById("msg");
        var out = document.getElementById("result");
        var cards = out.querySelectorAll("div");
        var reveal = 0;

        function clear() {
            reveal++;
            out.hidden = true;
            msg.textContent = "";
            msg.className = "";
        }

        function error(text) {
            msg.textContent = text;
            msg.className = "error";
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            clear();
            var value = input.value.trim();
            if (!value) return error("Enter a NIC number first.");
            var r = decodeNic(value);
            if (r.error) return error(r.error);

            var age = ageOn(r, new Date());
            var ageText = age + (age === 1 ? " year" : " years");
            var dob = WEEKDAYS[new Date(Date.UTC(r.year, r.month - 1, r.day)).getUTCDay()] + ", " + r.day + " " + MONTH_NAMES[r.month - 1] + " " + r.year;
            var values = {
                dob: dob,
                age: ageText,
                gender: r.gender,
                format: r.format === "old" ? "Old (9 digits + letter)" : "New (12 digits)",
                day: String(r.dayNumber).padStart(3, "0") + (r.gender === "Female" ? " (day + 500)" : "")
            };
            var id = reveal;
            out.hidden = false;
            cards.forEach(function (card, i) {
                // Restart the card's fade-in; reading offsetWidth forces the browser to notice the removal.
                card.classList.remove("rise");
                void card.offsetWidth;
                card.style.setProperty("--d", i * 90 + "ms");
                card.classList.add("rise");
                var dd = card.querySelector("dd");
                roll(dd, values[dd.dataset.f], i * 90, function () { return id === reveal; });
            });
            // The rolling text isn't announced; screen readers get the result in one sentence.
            msg.textContent = "Born " + dob + ". " + r.gender + ", " + ageText + " old.";
            msg.className = "sr-only";
        });

        // Results belong to the number that was submitted, so editing it clears them.
        input.addEventListener("input", function () {
            if (!out.hidden || msg.textContent) clear();
        });
    });
}
