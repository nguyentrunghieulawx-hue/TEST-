/* =====================================================
   CommuteMatch — Trang "Đăng nhập" (phần JS của HIEU)
   Chức năng:
   1. Chọn vai trò đăng nhập (chỉ 1 nút được sáng)
   2. Bấm Đăng nhập: lưu vai trò rồi mở trang của vai trò đó
   3. Giữ giao diện Tối nếu người dùng đã chọn từ trước
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Đường dẫn tới các trang khác ---------- */
  var denTrang = function (slug) {
    return "../" + slug + "/" + slug + ".html";
  };

  /* ---------- Trang chính của mỗi vai trò ---------- */
  var TRANG_CHINH = {
    rider: "rider-trip-search",
    driver: "driver-schedule",
    coordinator: "coordinator-mobility-dashboard",
    admin: "admin-dashboard"
  };

  /* ---------- Chọn vai trò đăng nhập ---------- */
  document.getElementById("nhomVaiTro").addEventListener("click", function (e) {
    var nut = e.target.closest("[data-vai-tro]");
    if (!nut) return;

    this.querySelectorAll("[data-vai-tro]").forEach(function (o) {
      o.classList.remove("dang-chon");
    });
    nut.classList.add("dang-chon");
  });

  /* ---------- Bấm nút "Đăng nhập" ---------- */
  document.querySelector('[data-viec="dang-nhap"]').addEventListener("click", function () {
    var nutDangChon = document.querySelector("[data-vai-tro].dang-chon");
    var vaiTro = nutDangChon ? nutDangChon.dataset.vaiTro : "rider";

    localStorage.setItem("cmRole", vaiTro);
    location.href = denTrang(TRANG_CHINH[vaiTro]);
  });

  /* ---------- Giao diện Tối ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("cm-dark");
  }
});
