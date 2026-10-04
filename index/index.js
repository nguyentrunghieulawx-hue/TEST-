/* =====================================================
   CommuteMatch — Trang "Trang chủ" (phần JS của HIEU)
   Bootstrap lo menu thu gọn trên màn hình nhỏ nên ở đây
   chỉ còn 2 việc:
   1. Vẽ menu đầu trang theo vai trò đã lưu trong máy
   2. Giữ giao diện Tối nếu người dùng đã chọn từ trước
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Đường dẫn tới các trang khác ---------- */
  var denTrang = function (slug) {
    return "../" + slug + "/" + slug + ".html";
  };

  /* ---------- Danh sách menu của từng vai trò ---------- */
  /* Vai trò đang đăng nhập được lưu ở localStorage.cmRole */
  var MENU = {
    rider: [
      ["rider-trip-search", "Tìm chuyến"],
      ["rider-match-results", "Gợi ý phù hợp"],
      ["rider-my-trips", "Chuyến của tôi"]
    ],
    driver: [
      ["driver-schedule", "Lịch chuyến"],
      ["driver-trip-create", "Tạo chuyến"],
      ["driver-join-requests", "Yêu cầu"]
    ],
    coordinator: [
      ["coordinator-mobility-dashboard", "Tổng quan"],
      ["coordinator-demand-heatmap", "Nhu cầu AI"],
      ["coordinator-report-center", "Báo cáo"],
      ["coordinator-pickup-zone-management", "Điểm đón"]
    ],
    admin: [
      ["admin-dashboard", "Tổng quan"],
      ["admin-user-management", "Người dùng"],
      ["admin-trip-management", "Chuyến đi"],
      ["admin-report-center", "Báo cáo"],
      ["admin-platform-settings", "Cấu hình"]
    ]
  };

  /* Trang đang mở, lấy từ <body data-trang="..."> để tô đậm đúng mục */
  var trangHienTai = document.body.dataset.trang || "";

  /* ---------- Vẽ menu ---------- */
  function veMenu() {
    var hop = document.getElementById("cmNav");
    if (!hop) return;

    var vaiTro = localStorage.getItem("cmRole") || "rider";
    var danhSach = MENU[vaiTro] || MENU.rider;
    var html = "";

    for (var i = 0; i < danhSach.length; i++) {
      var slug = danhSach[i][0];
      var dangChon = slug === trangHienTai ? " active" : "";
      html += '<li class="nav-item">'
            +   '<a class="nav-link cm-nav-link' + dangChon + '" href="' + denTrang(slug) + '">' + danhSach[i][1] + "</a>"
            + "</li>";
    }
    hop.innerHTML = html;
  }

  veMenu();

  /* ---------- Giao diện Tối ---------- */
  if (localStorage.getItem("cmTheme") === "dark") {
    document.body.classList.add("cm-dark");
  }
});
