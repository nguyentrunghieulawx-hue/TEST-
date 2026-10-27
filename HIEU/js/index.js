document.addEventListener("DOMContentLoaded", function() {

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

    var trangHienTai = document.body.dataset.trang || "";
    var trangCongKhai = ["index", "login", "register"];
    var h = document.getElementById("cmNav");
    var dS = MENU[localStorage.getItem("cmRole")] || MENU.rider;

    if (h && trangCongKhai.indexOf(trangHienTai) < 0) {
        h.innerHTML = dS.map(function(m) {
            return '<li class="nav-item"><a class="nav-link cm-nav-link' + (m[0] === trangHienTai ? " active" : "") + '" href="' + duongDanTrang(m[0]) + '">' + m[1] + "</a></li>";
        }).join("");
    }


    if (!window.MockApi || !document.getElementById("oHoiNhanh")) return;

    var dd = MockApi.dinhDang;
    var KHOA_TIM = "cm_tim_chuyen"; // trang rider-match-results đọc khóa này

    function datChu(id, chu) {
        var el = document.getElementById(id);
        if (el) el.textContent = chu;
    }

    function hai(n) { return (n < 10 ? "0" : "") + n; }

    /* "Hòa Lạc" -> "hoa lac" để so khớp không phân biệt dấu */
    function boDau(s) {
        return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
    }

    function ngayISO(d) {
        return d.getFullYear() + "-" + hai(d.getMonth() + 1) + "-" + hai(d.getDate());
    }

    function vietHoa(s) {
        return s.replace(/(^|\s)(\S)/g, function(m, a, b) { return a + b.toUpperCase(); });
    }

    function luuVaSangKetQua(tieuChi) {
        try { sessionStorage.setItem(KHOA_TIM, JSON.stringify(tieuChi)); } catch (e) { /* bỏ qua */ }
        location.href = duongDanTrang("rider-match-results");
    }

    /* Mỗi dòng: [tên hiển thị, các cách gọi khác (không dấu)] */
    var DIA_DIEM = [
        ["Khu CNC Hòa Lạc", "khu cnc hoa lac", "cnc hoa lac", "khu cong nghe cao"],
        ["ĐHQG Hà Nội", "dhqg ha noi", "dhqg", "dai hoc quoc gia"],
        ["Hòa Lạc"],
        ["Cầu Giấy"],
        ["Hà Đông"],
        ["Mỹ Đình"],
        ["Thanh Xuân"],
        ["Đống Đa"],
        ["Hoàn Kiếm"],
        ["Ba Đình"],
        ["Long Biên"],
        ["Tây Hồ"],
        ["Hoàng Mai"],
        ["Nam Từ Liêm"],
        ["Bắc Từ Liêm"],
        ["Mai Dịch"],
        ["Xuân Thủy"],
        ["Kim Mã"],
        ["Linh Đàm"],
        ["Times City"],
        ["Royal City"]
    ];
    var TU_KHOA_DIA_DIEM = [];
    DIA_DIEM.forEach(function(d) {
        [boDau(d[0])].concat(d.slice(1)).forEach(function(k) { TU_KHOA_DIA_DIEM.push({ ten: d[0], k: k }); });
    });
    TU_KHOA_DIA_DIEM.sort(function(a, b) { return b.k.length - a.k.length; }); // tên dài khớp trước
    var SO_THU = { hai: 1, ba: 2, tu: 3, nam: 4, sau: 5, bay: 6, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6 };

    function hieuCauHoi(cau) {
        var thuong = String(cau || "").normalize("NFC").toLowerCase(); // còn dấu: phân biệt "tới" / "tối"
        var kd = boDau(thuong); // không dấu, cùng độ dài với "thuong"
        var kq = { diemDi: "", diemDen: "", ngay: "", gio: "", soCho: 1 };

        function che(viTri, dai) { // che phần đã hiểu để không bị đọc lại
            var trang = new Array(dai + 1).join(" ");
            thuong = thuong.slice(0, viTri) + trang + thuong.slice(viTri + dai);
            kd = kd.slice(0, viTri) + trang + kd.slice(viTri + dai);
        }

        /* Địa điểm quen thuộc: chữ đứng trước quyết định là điểm đi hay điểm đến */
        var thay = [];
        TU_KHOA_DIA_DIEM.forEach(function(d) {
            var i = kd.indexOf(d.k);
            if (i < 0) return;
            var truoc = kd.slice(Math.max(0, i - 6), i);
            var loai = /\b(tu|o)\s+$/.test(truoc) ? "di" : (/\b(den|toi|len|ve|sang|vao|ra|qua)\s+$/.test(truoc) ? "den" : "");
            thay.push({ ten: d.ten, viTri: i, loai: loai });
            che(i, d.k.length);
        });
        thay.sort(function(a, b) { return a.viTri - b.viTri; });
        thay.forEach(function(d) { if (d.loai === "di" && !kq.diemDi) kq.diemDi = d.ten; });
        thay.forEach(function(d) { if (d.loai === "den" && !kq.diemDen) kq.diemDen = d.ten; });
        thay.forEach(function(d) { // chưa rõ vai trò: điền vào chỗ còn trống
            if (d.ten === kq.diemDi || d.ten === kq.diemDen) return;
            if (thay.length === 1 && !kq.diemDen) kq.diemDen = d.ten;
            else if (!kq.diemDi) kq.diemDi = d.ten;
            else if (!kq.diemDen) kq.diemDen = d.ten;
        });

        /* Địa điểm lạ: xử lý ở cuối hàm (sau khi đã che ngày/giờ/số chỗ) */

        /* Số chỗ: "2 người", "3 chỗ", "1 ghế" */
        var mCho = kd.match(/(\d+)\s*(cho|nguoi|ghe)\b/);
        if (mCho) { kq.soCho = Math.max(1, Math.min(4, Number(mCho[1])));
            che(mCho.index, mCho[0].length); }

        /* Ngày: "25/10", "hôm nay", "tối nay", "mai", "ngày kia", "thứ 2", "chủ nhật" */
        var homNay = new Date(),
            d = null;
        var mNgay = kd.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
        var mThu = kd.match(/\bthu\s*(hai|ba|tu|nam|sau|bay|[2-7])\b/);
        if (mNgay) {
            d = new Date(homNay.getFullYear(), Number(mNgay[2]) - 1, Number(mNgay[1]));
            che(mNgay.index, mNgay[0].length);
        } else if (mThu || /\bchu nhat\b/.test(kd)) {
            var soThu = mThu ? SO_THU[mThu[1]] : 0;
            d = new Date(homNay.getTime() + (((soThu - homNay.getDay() + 7) % 7) || 7) * 864e5);
            if (mThu) che(mThu.index, mThu[0].length);
        } else if (/(^|\s)(hôm|sáng|trưa|chiều|tối) nay/.test(thuong)) d = homNay;
        else if (/\bngay kia\b/.test(kd)) d = new Date(homNay.getTime() + 2 * 864e5);
        else if (/\bmai\b/.test(kd)) d = new Date(homNay.getTime() + 864e5);
        if (d) kq.ngay = ngayISO(d);

        /* Giờ: "7h", "7h30", "7:30", "7 giờ rưỡi", "5h chiều", "tối nay 9h", "lúc 8" */
        var mGio = thuong.match(/(\d{1,2})\s*(?:giờ|gio|h|g|:)(?![a-zđà-ỹ])\s*(\d{1,2}|rưỡi)?\s*(sáng|trưa|chiều|tối)?/) ||
            thuong.match(/lúc\s*(\d{1,2})()\s*(sáng|trưa|chiều|tối)?/);
        if (mGio) {
            var gio = Number(mGio[1]),
                phut = mGio[2] === "rưỡi" ? 30 : Number(mGio[2] || 0);
            var buoi = mGio[3] || (thuong.match(/(?:^|\s)(chiều|tối)(?=\s|$)/) || [])[1] || ""; // dùng chữ có dấu: "tối" khác "tới"
            if (/chiều|tối/.test(buoi) && gio < 12) gio += 12;
            if (gio < 24 && phut < 60) kq.gio = hai(gio) + ":" + hai(phut);
            che(mGio.index, mGio[0].length);
        }

        /* Địa điểm lạ (không có trong danh sách): dạng "từ A đến B" — làm sau cùng vì ngày/giờ đã được che */
        if (!kq.diemDi && !kq.diemDen) {
            var m = thuong.match(/(?:^|\s)từ\s+(.+?)\s+(?:đến|tới|lên|về|sang|vào|ra)\s+(.+)/);
            var catDuoi = /\s+(?:lúc|vào|ngày|hôm|mai|sáng|trưa|chiều|tối|thứ|chủ|,)(?=\s|$).*$/;
            if (m) {
                kq.diemDi = vietHoa(m[1].replace(catDuoi, "").replace(/[\s,]+$/, "").trim());
                kq.diemDen = vietHoa(m[2].replace(catDuoi, "").replace(/[\s,]+$/, "").trim());
            }
        }
        return kq;
    }

    function moTaDaHieu(kq) {
        var phan = [];
        if (kq.diemDi) phan.push("từ " + kq.diemDi);
        if (kq.diemDen) phan.push("đến " + kq.diemDen);
        if (kq.ngay) phan.push(dd.thu(kq.ngay) + " " + dd.ngayNgan(kq.ngay));
        if (kq.gio) phan.push("lúc " + kq.gio);
        phan.push(kq.soCho + " chỗ");
        return phan.join(" · ");
    }

    document.getElementById("oHoiNhanh").addEventListener("submit", function() {
        var kq = hieuCauHoi(document.getElementById("oCauHoi").value);
        if (!kq.diemDi && !kq.diemDen) {
            datChu("oAiHieu", "AI chưa hiểu bạn muốn đi đâu. Thử: \"Mai 7h từ Hà Đông đến ĐHQG\".");
            return;
        }
        datChu("oAiHieu", "AI hiểu: " + moTaDaHieu(kq) + " — đang tìm chuyến...");
        setTimeout(function() { luuVaSangKetQua(kq); }, 700);
    });

    /* ---------- 1.1 Thẻ chuyến gợi ý lấy từ dữ liệu thật ---------- */
    var tieuChiGoiY = { diemDi: "Cầu Giấy", diemDen: "Hòa Lạc", ngay: "", gio: "07:15", soCho: 1 };
    try {
        var daTim = JSON.parse(sessionStorage.getItem(KHOA_TIM));
        if (daTim && (daTim.diemDi || daTim.diemDen)) tieuChiGoiY = daTim; // ưu tiên lần tìm gần nhất
    } catch (e) { /* dùng mặc định */ }

    MockApi.timChuyen(tieuChiGoiY).then(function(ds) {
        if (!ds.length) return; // không có chuyến phù hợp: giữ nội dung mẫu
        var c = ds.filter(function(x) { return x.conDuCho; })[0] || ds[0];
        datChu("oGyDi", c.diemDi);
        datChu("oGyDiNote", c.gioKhoiHanh + " · Đón tại " + ((c.diemDon && c.diemDon[0]) || c.diemDi));
        datChu("oGyDen", c.diemDen);
        datChu("oGyDenNote", dd.thu(c.ngayKhoiHanh) + ", " + dd.ngayNgan(c.ngayKhoiHanh) +
            " · còn " + c.soGheConLai + " chỗ · " + c.taiXe.hoTen);
        datChu("oGyDiem", c.diemPhuHop);
        datChu("oGyGia", dd.tien(c.giaMoiGhe));
    }).catch(function() { /* lỗi dữ liệu: giữ nội dung mẫu */ });

    document.getElementById("oTheGoiY").addEventListener("click", function() {
        luuVaSangKetQua(tieuChiGoiY);
    });

    /* ---------- 1.4 Số liệu thật + nhận định AI ---------- */
    Promise.all([MockApi.layThongKe(), MockApi.layNguoiDung(), MockApi.layChuyen({ trangThai: "upcoming" })]).then(function(kq) {
        var tk = kq[0],
            users = kq[1],
            sapToi = kq[2];

        var coDiem = users.filter(function(u) { return u.danhGia > 0; });
        var diemTB = coDiem.reduce(function(t, u) { return t + u.danhGia; }, 0) / (coDiem.length || 1);
        datChu("oTkNguoiDung", tk.tongNguoiDung.toLocaleString("vi-VN"));
        datChu("oTkChuyen", tk.tongChuyen.toLocaleString("vi-VN"));
        datChu("oTkDiem", dd.diem(diemTB) + "/5");

        if (!sapToi.length) return;
        /* Gom điểm đến giống nhau ("Khu CNC Hòa Lạc" ~ "Hòa Lạc"), đếm giờ khởi hành và chỗ trống */
        var nhom = [],
            demGio = {},
            choTrong = 0;
        sapToi.forEach(function(c) {
            var k = boDau(c.diemDen);
            var g = nhom.filter(function(n) { return n.k.indexOf(k) >= 0 || k.indexOf(n.k) >= 0; })[0];
            if (g) {
                g.so++;
                if (k.length < g.k.length) { g.k = k;
                    g.ten = c.diemDen; } // giữ tên ngắn gọn hơn
            } else nhom.push({ k: k, ten: c.diemDen, so: 1 });
            var gio = c.gioKhoiHanh.slice(0, 2);
            demGio[gio] = (demGio[gio] || 0) + 1;
            choTrong += c.soGheConLai;
        });
        nhom.sort(function(a, b) { return b.so - a.so; });
        var gioDinh = Object.keys(demGio).sort(function(a, b) { return demGio[b] - demGio[a]; })[0];

        var cau = "AI nhận định: " + nhom[0].ten + " là điểm đến được quan tâm nhất (" + nhom[0].so + " chuyến sắp chạy)" +
            ", cao điểm khoảng " + gioDinh + ":00–" + hai(Number(gioDinh) + 1) + ":00" +
            (choTrong ? ", còn " + choTrong + " chỗ trống" : ", các chuyến đã kín chỗ") +
            (tk.yeuCauChoDuyet ? " và " + tk.yeuCauChoDuyet + " yêu cầu đang chờ duyệt." : ".");
        var el = document.getElementById("oNhanDinhAi");
        el.innerHTML = '<i class="bi bi-stars"></i> ';
        el.appendChild(document.createTextNode(cau));
        el.classList.remove("d-none");
    }).catch(function() { /* lỗi dữ liệu: giữ số liệu mẫu */ });
});