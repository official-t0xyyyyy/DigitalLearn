# Connect Digital Saathi to one Google Sheet

This adds student registration, latest quiz score, and training completion records to one spreadsheet. The site remains a static frontend; Google Apps Script receives updates and writes one row per student.

## Spreadsheet columns

Student ID, student name, college/institution, course/class, optional roll number, optional email, registration date, completion status for DigiLocker/Aadhaar/PAN, modules completed, overall completion, latest quiz score/total/percentage, quiz attempt date, and last updated.

## Setup (about 10–15 minutes)

1. Create a Google Sheet in your Google account. Name it `Digital Saathi Student Records`.
2. Copy the spreadsheet ID from its URL. For a URL like `https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`, copy only `THIS_IS_THE_ID`.
3. In the sheet, open **Extensions → Apps Script**.
4. Replace the editor contents with the code in `Code.gs`.
5. In `Code.gs`, replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with the spreadsheet ID. Save the project.
6. Choose **Deploy → New deployment → Web app**.
7. Set **Execute as** to your account. Set access to **Anyone** if your college's policy allows it, so students can submit from the public website. Deploy and complete Google's authorization prompts.
8. Copy the Web app URL ending in `/exec`.
9. Open `script.js` and replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL. Save the file.
10. Re-upload/redeploy the updated website, then test registration, module completion, and the quiz. The first successful submission creates the `Student Records` tab and its header row automatically.

## How it behaves

- Each browser gets a generated Digital Saathi student ID, saved locally in that browser.
- Registration sends the student's basic details to the sheet.
- Marking or unmarking a module sends the updated three-module completion status.
- Finishing the quiz sends the latest score, total marks, percentage, and attempt timestamp.
- Updates overwrite that student's row rather than adding a new row for every event. The sheet keeps the latest quiz attempt, not quiz history.
- If a student uses another browser/device, their browser-generated ID will differ. For a small college project, ask students to use the same device/browser for their learning session.

## Privacy and limitations

- Do not collect Aadhaar numbers, PAN numbers, OTPs, passwords, document images, or other sensitive identity data.
- Only collect registration fields needed for your project. Roll number and email are optional in the form.
- A public Apps Script endpoint can receive spam submissions. Use it only for a small educational project, check the sheet periodically, and follow your college's data-handling rules. Do not put confidential data in this spreadsheet.
- The frontend uses a simple cross-origin request. Because browsers do not expose the response in `no-cors` mode, the website cannot independently verify that Google Sheets accepted each write. Verify the test rows in the spreadsheet after setup.
- If you edit the Apps Script after deployment, open **Deploy → Manage deployments → Edit** and deploy a new version.
- Module completion is based on the learner pressing “Mark module as complete”; it indicates self-reported completion, not proof that every page was read.
