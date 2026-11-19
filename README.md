<div align="center">

![image](https://github.com/harindujayakody/nic-information-finder/assets/9878813/be2cc7a3-f5cb-4f92-a98d-ec131bf368c0)

# NIC Information Finder 🇱🇰 With DOB

[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](script.js)

*Sri Lankan National Identity Card (NIC) details extractor and validator.*

</div>

---

### About
Enter any 9-digit (old format) or 12-digit (new format) Sri Lankan National Identity Card number to instantly find:
- **Date of Birth** & Year
- **Gender** (Male / Female)
- **Voting Eligibility** status

---

### How the date is decoded
NIC numbers store the birthday as a day of the year (plus 500 for women) using a table where **February always has 29 days**, so day 61 is 1 March in every year. Day 60 in a non-leap year is rejected.

Run the tests with `node test.js`.

A newer version (with old/new number conversion) is at [harindujayakody.com/free-tools/sri-lanka-nic-decoder](https://harindujayakody.com/free-tools/sri-lanka-nic-decoder/).

---

### Tech Stack
- HTML5 / CSS3
- Pure JavaScript (Vanilla JS)
