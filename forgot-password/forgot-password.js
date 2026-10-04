/* =====================================================
   CommuteMatch — Trang "Quên mật khẩu" (phần JS của HIEU)
   Chức năng:
   1. Bấm "Gửi mã đặt lại": báo đã gửi rồi sang trang đặt lại mật khẩu
   2. Giữ giao diện Tối nếu người dùng đã chọn từ trước
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Đường dẫn tới các trang khác ---------- */
  var denTrang = function (slug) {
    return "../" + slug + "/" + slug + ".html";
  };

  /* ---------- Hiện dòng thông báo nhỏ góc phải ---------- */
  var hopThongBao = document.getElementById("cmToast");
  function hienThongBao(noiDung) {
    if (!hopThongBao) return;
    hopThongBao.textContent = noiDung;
    hopThongBao.classList.add("cm-toast-hien");
    setTimeout(function () {
      hopThongBao.classList.remove("cm-toast-hien");
    }, 1600);
  }

  /* ---------- Bấm nút "Gửi mã đặt lại" ---------- */
  document.querySelector('[data-viec="lay-ma"]').addEventListener("click", function () {
    hienThongBao("Đã gửi mã xác nhận về email của bạn");
    setTimeout(function () {
      location.href = denTrang("reset-password");
    }, 900);
  });

  /* ---------- Giao diện Tối ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("cm-dark");
  }
});
