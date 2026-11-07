<div align="center">

![image](https://github.com/harindujayakody/nic-information-finder/assets/9878813/be2cc7a3-f5cb-4f92-a98d-ec131bf368c0)

# NIC Information Finder 🇱🇰 With DOB

[![License](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](script.js)

*Sri Lankan National Identity Card (NIC) details extractor and validator.*

</div>

---

### About
Enter any 9-digit (old format, e.g. `931234567V` / `931234567X`) or 12-digit (new format, e.g. `199312345678`) Sri Lankan National Identity Card number to instantly extract and calculate:
- **Date of Birth** & Birth Year
- **Gender** (Male / Female)
- **Current Age**

---

### Features
- Validates both legacy 10-character (`9 digits + V/X`) and modern 12-digit formats.
- Accurate 366-day calendar day-of-year decoding.
- Accurate calendar-based age calculation.
- Subresource Integrity (SRI) on CDN assets.

---

### Running Tests

Run the test suite with Node.js:

```bash
node test.js
```

---

### Tech Stack
- HTML5 / CSS3
- JavaScript / jQuery (with SRI verification)
