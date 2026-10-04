/* =====================================================
   CommuteMatch — Trang "Không tìm thấy"
   Script riêng của trang, chạy độc lập (không dùng engine chung).
   Chức năng:
   1. Giữ giao diện Tối nếu người dùng đã chọn từ trước
   ===================================================== */

(function () {

  /* ---------- Giữ giao diện Tối nếu đã chọn từ trước ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("dark");
  }
})();
