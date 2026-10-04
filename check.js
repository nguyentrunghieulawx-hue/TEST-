/* =====================================================
   Kiểm tra nhanh các trang prototype:
   1. Mỗi file .html có đủ file .css và .js đi kèm chưa
   2. Các đường dẫn href/src nội bộ có trỏ tới file có thật không
   3. Các id mà JS gọi (getElementById) có tồn tại trong HTML không
   Chạy:  node O:\CSE122\check.js
   ===================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

let loi = 0;
let canhBao = 0;

function baoLoi(msg) { loi++; console.log("  [LỖI] " + msg); }
function baoCanhBao(msg) { canhBao++; console.log("  [Cảnh báo] " + msg); }

/* Trang = thư mục con chứa file <tên-thư-mục>.html bên trong */
const slugCoThat = new Set();
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (e.isDirectory() && fs.existsSync(path.join(ROOT, e.name, e.name + ".html"))) slugCoThat.add(e.name);
}

console.log("\n=== DANH SÁCH TRANG (" + slugCoThat.size + ") ===");
const cacTrang = [...slugCoThat].sort();
{
  for (const trang of cacTrang) {
    const thuMuc = path.join(ROOT, trang);
    const fileHtml = path.join(thuMuc, trang + ".html");
    const fileCss = path.join(thuMuc, trang + ".css");
    const fileJs = path.join(thuMuc, trang + ".js");

    if (!fs.existsSync(fileHtml)) { baoLoi(trang + ": thiếu file .html"); continue; }
    const html = fs.readFileSync(fileHtml, "utf8");
    console.log("- " + trang);

    if (!fs.existsSync(fileCss)) baoLoi("thiếu " + trang + ".css");
    if (!fs.existsSync(fileJs)) baoLoi("thiếu " + trang + ".js");

    /* HTML phải nhúng đúng file css/js của trang */
    if (!html.includes('href="' + trang + '.css"')) baoLoi("HTML không liên kết " + trang + ".css");
    if (!html.includes('src="' + trang + '.js"')) baoLoi("HTML không nhúng " + trang + ".js");

    /* Kiểm tra mọi đường dẫn nội bộ trong href/src */
    const duongDan = html.match(/(?:href|src)="([^"]+)"/g) || [];
    for (const d of duongDan) {
      const giaTri = d.slice(d.indexOf('"') + 1, -1);
      if (/^(https?:|mailto:|#|javascript:)/.test(giaTri)) continue;
      if (!giaTri.endsWith(".html") && !giaTri.endsWith(".css") && !giaTri.endsWith(".js")) continue;

      const dichDen = path.resolve(thuMuc, giaTri);
      if (!fs.existsSync(dichDen)) {
        /* Có thể trỏ sang trang của nhóm khác (khi gộp 3 nhóm lại mới đủ) */
        const slug = giaTri.split("/").filter(Boolean); slug.pop();
        if (slug.length && slugCoThat.has(slug[slug.length - 1])) {
          baoCanhBao("liên kết " + giaTri + " trỏ đúng thư mục trang nhưng thiếu file đích");
        } else {
          baoLoi("liên kết hỏng: " + giaTri);
        }
      }
    }

    /* Các id mà JS cần phải có trong HTML */
    if (fs.existsSync(fileJs)) {
      const js = fs.readFileSync(fileJs, "utf8");
      const idCan = new Set();
      const reId = /getElementById\(\s*"([^"]+)"\s*\)/g;
      let khop;
      while ((khop = reId.exec(js)) !== null) idCan.add(khop[1]);
      for (const id of idCan) {
        if (!html.includes('id="' + id + '"')) baoLoi("JS cần id=\"" + id + "\" nhưng HTML không có");
      }

      /* Các mốc (hook) mà JS bám vào */
      if (/"#mainNav"|getElementById\("mainNav"\)/.test(js) && !html.includes("mainNav")) {
        baoLoi("JS cần phần tử id=\"mainNav\" nhưng HTML không có");
      }
      if (/getElementById\("toast"\)/.test(js) && !html.includes('id="toast"')) {
        baoLoi("JS cần phần tử id=\"toast\" nhưng HTML không có");
      }
      /* Có nút mở hộp thoại thì phải có hộp thoại tương ứng */
      const nutMo = html.match(/data-modal="([^"]+)"/g) || [];
      for (const n of nutMo) {
        const ten = n.slice(n.indexOf('"') + 1, -1);
        if (!html.includes('id="' + ten + '"')) baoLoi("nút mở hộp thoại \"" + ten + "\" nhưng không có hộp thoại đó");
      }
      if (nutMo.length && !html.includes("modal-backdrop")) baoLoi("có nút data-modal nhưng thiếu khung .modal-backdrop");
      if (!nutMo.length && html.includes("modal-backdrop")) baoCanhBao("có .modal-backdrop nhưng không có nút nào mở nó");

      /* Trang phải khai báo data-page để JS dựng đúng menu theo vai trò */
      if (/dataset\.page/.test(js) && !html.includes("data-page=")) {
        baoLoi("HTML thiếu thuộc tính data-page (JS dùng để dựng menu)");
      }

      /* Mốc thao tác: data-viec (HIEU) / data-action (DAI, DUC) */
      if (/data-viec/.test(js) && !html.includes("data-viec")) baoLoi("JS xử lý data-viec nhưng HTML không có nút nào");
      if (/data-action/.test(js) && !html.includes("data-action")) baoLoi("JS xử lý data-action nhưng HTML không có nút nào");
      if (/data-modal/.test(js) && !html.includes("data-modal")) baoLoi("JS xử lý data-modal nhưng HTML không có nút nào");
    }
  }
}

console.log("\n================ KẾT QUẢ ================");
console.log("Lỗi: " + loi + "   Cảnh báo: " + canhBao);
