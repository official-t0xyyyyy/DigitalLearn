/**
 * Digital Saathi: Google Sheets receiver for student registration,
 * latest quiz result, and module completion records.
 * Create a Google Sheet, open Extensions > Apps Script, paste this file,
 * set SPREADSHEET_ID below, then deploy as a Web app.
 */
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Student Records";
const HEADERS = [
  "Student ID", "Student Name", "College / Institution", "Course / Class",
  "Roll Number", "Email", "Registered At", "DigiLocker Completed",
  "Aadhaar Completed", "PAN Completed", "Modules Completed", "Total Modules",
  "Overall Completion", "Latest Quiz Score", "Quiz Total", "Quiz Percentage",
  "Latest Quiz Attempt At", "Last Updated"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) return jsonResponse({ ok: false, error: "Missing request body" });
    const data = JSON.parse(raw);
    if (!data.studentId || !data.name || !data.college || !data.course) {
      return jsonResponse({ ok: false, error: "Required student fields are missing" });
    }
    // Reject excessively large or unexpected input; never accept ID numbers, OTPs, or passwords.
    [data.studentId, data.name, data.college, data.course, data.rollNumber, data.email].forEach(function (value) {
      if (value !== undefined && String(value).length > 160) throw new Error("A field is too long");
    });
    lock.waitLock(10000);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }
    const lastRow = sheet.getLastRow();
    let targetRow = 0;
    if (lastRow >= 2) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
      for (let i = 0; i < ids.length; i++) {
        if (ids[i][0] === String(data.studentId)) { targetRow = i + 2; break; }
      }
    }
    const now = new Date();
    let registeredAt = now;
    if (targetRow) registeredAt = sheet.getRange(targetRow, 7).getValue() || now;
    const row = [
      String(data.studentId), String(data.name).trim(), String(data.college).trim(),
      String(data.course).trim(), String(data.rollNumber || "").trim(), String(data.email || "").trim(),
      registeredAt, data.digilockerCompleted === true, data.aadhaarCompleted === true,
      data.panCompleted === true, Number(data.completedModules || 0), Number(data.totalModules || 3),
      String(data.overallCompletion || "In progress"), data.quizScore === "" || data.quizScore === undefined ? "" : Number(data.quizScore),
      data.quizTotal === "" || data.quizTotal === undefined ? "" : Number(data.quizTotal),
      data.quizPercentage === "" || data.quizPercentage === undefined ? "" : Number(data.quizPercentage),
      data.quizAttemptAt || "", now
    ];
    if (targetRow) sheet.getRange(targetRow, 1, 1, HEADERS.length).setValues([row]);
    else sheet.appendRow(row);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 7, sheet.getLastRow() - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm");
      sheet.getRange(2, 18, sheet.getLastRow() - 1, 1).setNumberFormat("yyyy-mm-dd hh:mm");
      sheet.getRange(2, 16, sheet.getLastRow() - 1, 1).setNumberFormat("0\"%\"");
    }
    return jsonResponse({ ok: true, action: String(data.action || "update") });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet() {
  return ContentService.createTextOutput("Digital Saathi spreadsheet receiver is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
