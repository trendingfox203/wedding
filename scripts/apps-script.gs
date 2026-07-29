/**
 * Google Apps Script — nhận RSVP từ website, ghi vào Google Sheet.
 *
 * Cách deploy:
 * 1. Tạo một Google Sheet mới, đặt tên sheet đầu tiên là "RSVP".
 *    Dòng tiêu đề (hàng 1): Timestamp | Full Name | Phone | Email | Attending |
 *    Guest Count | Guest Names | Dietary | Arrival Date | Departure Date
 * 2. Trong Sheet: Extensions > Apps Script, xoá code mẫu, dán toàn bộ nội dung file này.
 * 3. Deploy > New deployment > chọn loại "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL Web App vừa deploy, dán vào `weddingConfig.rsvp.endpoint` trong
 *    lib/wedding-config.ts (file trong repo Next.js).
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVP");
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.fullName || "",
    data.phone || "",
    data.email || "",
    data.attending || "",
    data.guestCount || "",
    data.guestNames || "",
    data.dietary || "",
    data.arrivalDate || "",
    data.departureDate || "",
    new Date().toLocaleString('vi-VN'), // Thời gian gửi
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
