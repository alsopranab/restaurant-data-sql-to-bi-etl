function importCsvFromEmail() {

  
  // CONFIG
  
  var SUBJECT_TEXT = "KPI Report |"; // partial match is safer since the date & time is not const.
  var SHEET_NAME = "restaurant_analytics";
  var SPREADSHEET_ID = "1s_F3qCDOHRKyBQpbMrJQSfjVwqh1jPus1cbMPM6e0Q8";


  // GET THE SHEET
  
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error("Sheet not found: " + SHEET_NAME);
  }

  // SEARCH EMAIL
  
  var threads = GmailApp.search('subject:"' + SUBJECT_TEXT + '"');

  if (threads.length === 0) {
    throw new Error("No email found with subject: " + SUBJECT_TEXT);
  }

  // Take the latest email thread
  var messages = threads[0].getMessages();
  var message = messages[messages.length - 1];


  // GET CSV ATTACHMENT
  var attachments = message.getAttachments();
  var csvFile = null;

  for (var i = 0; i < attachments.length; i++) {
    if (attachments[i].getName().endsWith(".csv")) {
      csvFile = attachments[i];
      break;
    }
  }

  if (!csvFile) {
    throw new Error("No CSV attachment found in the email");
  }

  
  // READ CSV DATA
  
  var csvData = Utilities.parseCsv(csvFile.getDataAsString());

  
  // LOAD DATA INTO SHEET
  
  sheet.clearContents();

  sheet.getRange(
    1,
    1,
    csvData.length,
    csvData[0].length
  ).setValues(csvData);

  Logger.log("CSV imported successfully into Google Sheet");
}


