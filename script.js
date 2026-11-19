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
    var nic = String(input).trim().toUpperCase();
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

if (typeof $ !== "undefined") {
    $(document).ready(function () {
        function clear() {
            $("#error").text("");
            $("#gender").text("");
            $("#dob").text("");
            $("#age").text("");
        }

        $("#find").click(function () {
            clear();
            var r = decodeNic($("#nic").val());
            if (r.error) {
                $("#error").text(r.error);
                return;
            }
            $("#gender").text(r.gender);
            $("#dob").text(r.year + "-" + MONTH_NAMES[r.month - 1] + "-" + r.day);
            $("#age").text("You are " + ageOn(r, new Date()) + " years old.");
        });
    });
}
