/* =====================================================
   CommuteMatch — Trang "Đặt lại mật khẩu" (phần JS của HIEU)
   Chức năng:
   1. Bấm "Đặt lại mật khẩu": báo thành công rồi về trang đăng nhập
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

  /* ---------- Bấm nút "Đặt lại mật khẩu" ---------- */
  document.querySelector('[data-viec="dat-lai"]').addEventListener("click", function () {
    hienThongBao("Đổi mật khẩu thành công, đang về trang đăng nhập...");
    setTimeout(function () {
      location.href = denTrang("login");
    }, 900);
  });

  /* ---------- Giao diện Tối ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("cm-dark");
  }
});
