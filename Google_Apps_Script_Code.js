// =========================================================================
// GOOGLE APPS SCRIPT FOR CONTACT FORM
// =========================================================================
// 1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1qKVa7rP13tpBGUjl358GuFlOzF7rYO6hVt3ZjIzUruM/edit#gid=0
// 2. Click "Extensions" -> "Apps Script"
// 3. Delete any existing code and paste ALL of this code there.
// 4. Click the "Save" icon.
// 5. Click "Deploy" -> "New deployment"
// 6. Choose type: "Web app"
// 7. Execute as: "Me"
// 8. Who has access: "Anyone"
// 9. Click "Deploy", authorize the permissions, and copy the Web App URL.
// 10. Paste that URL into your js/contact.js file!
// =========================================================================

function doPost(e) {
  // Lock to handle concurrent submissions cleanly and prevent race conditions
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // wait for up to 10 seconds for other processes

  try {
    // Connect to the active spreadsheet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    // Defaulting to the first sheet if a specific name isn't found
    var sheet = doc.getSheets()[0];

    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Message"]);
      // Make headers bold for a cleaner look
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }

    // Get the timestamp
    var timestamp = new Date();

    // Extract parameters (fallback to empty string if undefined)
    var name = (e && e.parameter && e.parameter.name) ? e.parameter.name.trim() : "No Name";
    var email = (e && e.parameter && e.parameter.email) ? e.parameter.email.trim() : "No Email";
    var message = (e && e.parameter && e.parameter.message) ? e.parameter.message.trim() : "No Message";

    // Append the row efficiently
    sheet.appendRow([timestamp, name, email, message]);

    // Output success format
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Handle errors gracefully
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}
