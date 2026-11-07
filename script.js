$(document).ready(function () {
    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var daysInMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function clearResults() {
        $("#error").text("");
        $("#gender").text("");
        $("#dob").text("");
        $("#age").text("");
    }

    $("#find").click(function () {
        clearResults();

        var nic = $("#nic").val().trim();
        var year = "";
        var dayText = 0;
        var gender = "";

        // Validate NIC format:
        // Old format: 9 digits followed by 'V' or 'X' (e.g., 931234567V)
        // New format: 12 digits (e.g., 199312345678)
        var oldNicPattern = /^[0-9]{9}[vVxX]$/;
        var newNicPattern = /^[0-9]{12}$/;

        if (oldNicPattern.test(nic)) {
            year = "19" + nic.substr(0, 2);
            dayText = parseInt(nic.substr(2, 3), 10);
        } else if (newNicPattern.test(nic)) {
            year = nic.substr(0, 4);
            dayText = parseInt(nic.substr(4, 3), 10);
        } else {
            $("#error").text("Invalid NIC NO");
            return;
        }

        // Gender determination: female NICs have 500 added to day-of-year
        if (dayText > 500) {
            gender = "Female";
            dayText -= 500;
        } else {
            gender = "Male";
        }

        // Day-of-year validation (Sri Lanka NIC standard uses 1 to 366 days)
        if (dayText < 1 || dayText > 366) {
            $("#error").text("Invalid NIC NO");
            return;
        }

        // Determine month and day using the 366-day calendar
        var monthIndex = 0;
        var dayNum = dayText;
        for (var i = 0; i < daysInMonths.length; i++) {
            if (dayNum <= daysInMonths[i]) {
                monthIndex = i;
                break;
            }
            dayNum -= daysInMonths[i];
        }

        var month = monthNames[monthIndex];
        var day = dayNum;
        var dobString = year + "-" + month + "-" + day;

        // Accurate calendar age calculation
        var birthYear = parseInt(year, 10);
        var today = new Date();
        var ageYears = today.getFullYear() - birthYear;
        var monthDiff = today.getMonth() - monthIndex;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
            ageYears--;
        }
        if (ageYears < 0) {
            ageYears = 0;
        }

        // Display results
        $("#gender").text(gender);
        $("#dob").text(dobString);
        $("#age").text("You are " + ageYears + " years old.");
    });

    $("button[type='reset']").click(function () {
        clearResults();
    });

    $("#nic").on("keypress", function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $("#find").click();
        }
    });
});
