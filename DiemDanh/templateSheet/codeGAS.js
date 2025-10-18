// Hàm xử lý GET requests
function doGet(e) {
  const action = e.parameter.action;

  if (action === "getShow") {
    return ContentService.createTextOutput(JSON.stringify(getShow()))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === "getData") {
    return ContentService.createTextOutput(JSON.stringify(getData()))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm xử lý POST requests
function doPost(e) {
  try {
    const mssv = e.parameter.mssv;
    const eventName = e.parameter.eventName;
    const timestamp = e.parameter.timestamp;

    if (!mssv || !eventName || !timestamp) {
      throw new Error("Thiếu dữ liệu đầu vào");
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ATTEND");
    sheet.appendRow([mssv, eventName, timestamp]);

    const response = { success: true, message: "Đã ghi nhận điểm danh" };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const response = { success: false, message: error.message };

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm lấy dữ liệu từ sheet SHOW để cấu hình HTML
function getShow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SHOW");
  const data = sheet.getDataRange().getValues();
  const result = {};

  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    result[key] = value;
  }

  return result;
}

// Hàm lấy toàn bộ dữ liệu sinh viên từ sheet DATA
function getData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DATA");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    result.push(row);
  }

  return result;
}

// Hàm ghi dữ liệu điểm danh vào sheet ATTEND
function postAttend(mssv, eventName, timestamp) {
  if (!mssv || !eventName || !timestamp) {
    return { success: false, message: "Thiếu dữ liệu đầu vào" };
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ATTEND");
  sheet.appendRow([mssv, eventName, timestamp]);

  return { success: true, message: "Đã ghi nhận điểm danh" };
}
