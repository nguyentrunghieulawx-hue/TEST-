/* =====================================================
   CommuteMatch — Trang "Đăng ký" (phần JS của HIEU)
   Chức năng:
   1. Bấm "Tạo tài khoản" xong thì quay về trang đăng nhập
   2. Giữ giao diện Tối nếu người dùng đã chọn từ trước
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Đường dẫn tới các trang khác ---------- */
  var denTrang = function (slug) {
    return "../" + slug + "/" + slug + ".html";
  };

  /* ---------- Bấm nút "Tạo tài khoản" ---------- */
  document.querySelector('[data-viec="dang-ky"]').addEventListener("click", function () {
    location.href = denTrang("login");
  });

  /* ---------- Giao diện Tối ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("cm-dark");
  }
});
