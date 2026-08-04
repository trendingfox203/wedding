/**
 * Google Apps Script — nhận RSVP từ website, ghi vào Google Sheet.
 *
 * Cách deploy / cập nhật:
 * 1. Sheet "RSVP" — dòng tiêu đề hiện tại: Full Name | Phone | Email |
 *    Attending | Guest Count | Guest Names | Dietary | Timestamp | Address
 *    (Address nằm ở CUỐI, không chèn giữa — xem lý do bên dưới.)
 * 2. Trong Sheet: Extensions > Apps Script, dán toàn bộ nội dung file này,
 *    ghi đè code cũ.
 * 3. QUAN TRỌNG khi chỉ sửa code cho một deployment đã có (không tạo mới):
 *    Deploy > Manage deployments > bấm biểu tượng bút chì (Edit) trên
 *    deployment đang dùng > ở "Version" chọn "New version" > Deploy.
 *    Lưu code trong editor KHÔNG tự cập nhật Web App đang chạy — phải làm
 *    bước "New version" này thì thay đổi mới có hiệu lực. Làm đúng bước
 *    này thì URL Web App giữ nguyên, không cần đổi `rsvp.endpoint` trong
 *    lib/wedding-config.ts.
 *    Nếu lỡ chọn "New deployment" (tạo deployment mới) thay vì sửa cái cũ,
 *    URL sẽ đổi — khi đó phải cập nhật lại `rsvp.endpoint` trong
 *    lib/wedding-config.ts cho khớp URL mới.
 *
 * Vì sao Address phải thêm ở CUỐI thay vì chèn giữa Email và Attending
 * (đúng thứ tự trên form): sheet.appendRow ghi theo VỊ TRÍ cột, không theo
 * tên field. Các dòng RSVP khách đã gửi trước khi thêm Address chỉ có 8
 * cột theo đúng thứ tự cũ. Nếu chèn address vào giữa mảng bên dưới, mọi
 * cột sau nó (Attending, Guest Count...) sẽ dịch sang phải 1 cột — nhưng
 * chỉ với các dòng MỚI, khiến dữ liệu cũ và mới lệch cột với nhau trên
 * cùng một sheet. Thêm ở cuối thì các dòng cũ không bị ảnh hưởng gì, dòng
 * mới chỉ có thêm dữ liệu ở cột cuối cùng.
 */

function doGet(e) {
  return ContentService
    .createTextOutput("RSVP API is running (GET request)")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Không nhận được dữ liệu POST.");
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVP");
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Sheet không tồn tại" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse JSON từ React
    const data = JSON.parse(e.postData.contents);

    // Format dữ liệu
    const formatAttending = (status) => {
      if (!status) return "";
      if (status === "Joyfully accepts") return "Có";
      if (status === "Regretfully declines") return "Không";
      return status;
    };

    const now = new Date();
    const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');

    // Ghi vào Sheet — address thêm ở CUỐI, xem giải thích ở đầu file.
    sheet.appendRow([
      data.fullName || "",
      data.phone || "",
      data.email || "",
      formatAttending(data.attending),
      data.guestCount || "",
      data.guestNames || "",
      data.dietary || "",
      timestamp,
      data.address || "",
    ]);

    // Trả về JSON thành công (không cần setHeader vì dùng text/plain + no-cors bên React)
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "RSVP đã được ghi nhận!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
