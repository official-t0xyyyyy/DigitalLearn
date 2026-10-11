# DigitalLearn — Digital Services Training Portal

A responsive college CEP project for training on DigiLocker, Aadhaar and PAN services.

## Files
- `index.html` — page structure and student registration form
- `styles.css` — responsive styling
- `script.js` — modules, quiz and Google Sheets submission

## Connect the website to your Google Sheet
1. Open `script.js` in a text editor or VS Code.
2. Find `const SHEETS_WEB_APP_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";`.
3. Replace the placeholder text with your deployed Apps Script Web App URL ending in `/exec`, keeping the quotation marks.
4. Save the file and publish/update your website using your normal hosting process.
5. In Apps Script, deploy as a **Web app** and ensure access permissions allow your intended testers to submit. Use the deployment URL ending in `/exec`, not the editor URL.
6. Register with test details, mark a module complete, and finish the quiz. Check the `Students` tab of `DigitalLearn Records` for rows.

## What gets recorded
Each row includes timestamp (added by Apps Script), student name, email, class/division, module, quiz score and completion status. Registration, completed modules and quiz results are separate rows. Progress is associated with the registration only for the current browser session.

## Important testing notes
- The browser uses a simple `text/plain` POST with `no-cors` for compatibility with Apps Script web apps. The browser cannot read the response in this mode, so the page can only say the request was sent; **confirm success by checking the spreadsheet**.
- If no row appears, verify the URL, redeploy the Apps Script after code changes, and check that the deployment access setting allows submissions.
- This is a student project/demo, not a production-grade authenticated system. Anyone who obtains the public web app URL may be able to submit rows. Avoid publishing sensitive student data. Never collect Aadhaar numbers, PAN numbers, OTPs, passwords or document images. Use test data while debugging.
- The original project was frontend-only. This update adds the Google Sheets connection but does not create a secure login system.

## Run locally
Extract the ZIP and open `index.html`, or use VS Code with Live Server.

## Official service resources
- DigiLocker: https://www.digilocker.gov.in/
- UIDAI: https://uidai.gov.in/
- Income Tax e-Filing: https://www.incometax.gov.in/iec/foportal/
- Protean PAN services: https://www.protean-tinpan.com/
