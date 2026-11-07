$(document).ready(function () {
    var MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function showError(message) {
        $("#error").html(message);
        $("#gender").html("");
        $("#dob").html("");
        $("#age").html("");
    }

    $("#find").click(function () {
        // Clear existing details
        $("#error").html("");
        $("#gender").html("");
        $("#dob").html("");
        $("#age").html("");

        var NICNo = $("#nic").val().trim();
        var year = 0;
        var dayText = 0;
        var gender = "";

        if (NICNo.length !== 10 && NICNo.length !== 12) {
            showError("Invalid NIC NO");
            return;
        }

        if (NICNo.length === 10) {
            // Old format: 9 digits + trailing V or X (case-insensitive).
            // Previously only the first 9 characters were checked and the
            // trailing letter was never validated.
            if (!/^\d{9}[VXvx]$/.test(NICNo)) {
                showError("Invalid NIC NO");
                return;
            }
            year = parseInt("19" + NICNo.substr(0, 2), 10);
            dayText = parseInt(NICNo.substr(2, 3), 10);
        } else {
            // New format: 12 digits, all numeric.
            if (!/^\d{12}$/.test(NICNo)) {
                showError("Invalid NIC NO");
                return;
            }
            year = parseInt(NICNo.substr(0, 4), 10);
            dayText = parseInt(NICNo.substr(4, 3), 10);
        }

        // Gender
        if (dayText > 500) {
            gender = "Female";
            dayText = dayText - 500;
        } else {
            gender = "Male";
        }

        // Day-of-year validation. The old check
        // `dayText < 1 && dayText > 366` could never fire (a number cannot
        // be both below 1 and above 366), so out-of-range values slipped
        // through. Also validate against the actual year length so day 366
        // is rejected in non-leap years.
        var maxDay = isLeapYear(year) ? 366 : 365;
        if (dayText < 1 || dayText > maxDay) {
            showError("Invalid NIC NO");
            return;
        }

        // Compute the date from a real Date object instead of a hardcoded
        // month table. The old table treated day 60 as March in every year
        // (in leap years day 60 is 29 February) and its February branch
        // accepted impossible dates such as 30/31 February. The round-trip
        // check below rejects anything the calendar cannot represent.
        var dobDate = new Date(year, 0, dayText);
        if (
            dobDate.getFullYear() !== year ||
            dobDate.getMonth() < 0 || dobDate.getMonth() > 11 ||
            dobDate.getDate() < 1 || dobDate.getDate() > 31
        ) {
            showError("Invalid NIC NO");
            return;
        }
        // Round-trip: the constructed date must map back to the same
        // day-of-year, otherwise the input was not a real calendar date.
        var startOfYear = new Date(year, 0, 1);
        var roundTripDay = Math.round((dobDate - startOfYear) / 86400000) + 1;
        if (roundTripDay !== dayText) {
            showError("Invalid NIC NO");
            return;
        }

        var month = MONTH_NAMES[dobDate.getMonth()];
        var day = dobDate.getDate();
        var dobText = year + "-" + month + "-" + day;

        // Age in whole years, accounting for whether the birthday has
        // occurred yet this year (the old code divided by 365 days).
        var today = new Date();
        var ageYears = today.getFullYear() - year;
        var birthdayThisYear = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
        if (today < birthdayThisYear) {
            ageYears -= 1;
        }
        var ageText = "You are " + ageYears + " years old.";

        // Show details
        $("#gender").html(gender);
        $("#dob").html(dobText);
        $("#age").html(ageText);
    });
});
