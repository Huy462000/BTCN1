# Cải tiến giao diện giỏ hàng GEARVN

Bài tập môn Thương mại điện tử (UEH), Nhiệm vụ 3: xây dựng một cải tiến giao diện bằng HTML5 và CSS3.

- **Website khảo sát:** GEARVN (gearvn.com), khảo sát ngày 14/11/2026
- **Khu vực cải tiến:** phần tóm tắt giỏ hàng (trang /gio-hang)
- **Người dùng mục tiêu:** khách mua sắm trực tuyến tại Việt Nam, phần lớn dùng điện thoại

## Vấn đề và cách cải tiến

| Vấn đề quan sát trên trang gốc | Cách xử lý trong bản cải tiến |
|---|---|
| Giỏ có 1 sản phẩm và 3 quà tặng nhưng hiển thị "Tất cả sản phẩm (4)" | Đếm tách riêng: "1 sản phẩm + 3 quà tặng". Quà tặng nằm trong nhóm riêng, ghi "Miễn phí" và thu gọn được. |
| Dòng "Giảm ngay 28.490.000đ" không rõ là khoản giảm gì | Liệt kê từng khoản giảm có tên và số âm: giảm giá sản phẩm, ưu đãi HSSV, mã giảm giá. |
| Không thấy phí vận chuyển và ô nhập mã giảm giá | Thêm dòng phí vận chuyển và ô mã giảm giá có thông báo đúng / sai / để trống. |
| Tổng tiền khó thấy trên điện thoại | Tổng thanh toán, dòng "Bạn tiết kiệm được …" và nút "Xác nhận đơn" dính ở đáy màn hình. |

## Cấu trúc thư mục

```
ecommerce-ui-improvement/
├── index.html          Trang sản phẩm: danh mục, tiêu đề, lưới 6 sản phẩm
├── gio-hang.html       Trang giỏ hàng: danh sách sản phẩm + tóm tắt đơn hàng (phần cải tiến)
├── css/style.css       Toàn bộ CSS dùng chung cho 2 trang
├── js/script.js        JS thuần: lọc danh mục, thêm/xóa, tính tiền, kiểm tra mã giảm giá
├── images/             product-demo.jpg và các ảnh minh họa .svg
├── README.md
└── AI_USAGE.md
```

Không dùng framework, thư viện, backend hay cơ sở dữ liệu. Giỏ hàng lưu tạm trong `localStorage` của trình duyệt để giữ lại khi chuyển trang.

## Cách chạy

1. Nhấp đúp vào `index.html` để mở trong Chrome hoặc Edge. Không cần cài đặt gì thêm.
2. Bấm "Thêm vào giỏ", sau đó bấm biểu tượng giỏ hàng ở góc phải để sang trang giỏ hàng.
3. Để xem giao diện điện thoại: nhấn F12, rồi Ctrl+Shift+M, và chọn chiều rộng 375px.

Muốn đưa giỏ hàng về trạng thái ban đầu (1 laptop): nhấn F12, vào tab Application → Local Storage và xóa mục `gearvn-demo-cart`.

## Bố cục theo màn hình

| Chiều rộng | Trang sản phẩm | Trang giỏ hàng |
|---|---|---|
| < 768px | Lưới 2 cột | Một cột; thanh tổng tiền dính đáy màn hình |
| 768–1023px | Lưới 3 cột | Một cột; thanh tổng tiền dính đáy màn hình |
| ≥ 1024px | Lưới 4 cột | Hai cột: danh sách bên trái, tóm tắt bên phải và đứng yên khi cuộn |

## Kiểm tra

| Nội dung | Cách kiểm tra | Kết quả mong đợi |
|---|---|---|
| Tổng tiền khớp từng đồng | Giỏ chỉ có 1 laptop | 36.990.000 − 9.700.000 − 272.900 = **27.017.100đ** |
| Mã giảm giá đúng | Nhập `GIAM200K` | Thông báo xanh; tổng còn **26.817.100đ** |
| Mã giảm giá sai hoặc để trống | Nhập `ABC`, hoặc để trống rồi bấm "Áp dụng" | Thông báo đỏ, ô nhập có viền đỏ |
| Màn hình hẹp | Chiều rộng 375px | Không bị tràn ngang |
| Bàn phím | Nhấn Tab qua ô mã, nút "Áp dụng", nút "Xác nhận đơn" | Có viền focus rõ |
| Độ tương phản | Kiểm bằng contrast checker | Đỏ #E30019 ≈ 4,9:1; xanh #0A7A3B ≈ 5,4:1 trên nền trắng (đạt AA) |

## Ghi chú về dữ liệu

Chỉ dữ liệu laptop Acer Nitro ProPanel ANV16 (giá niêm yết, giá bán, quà tặng) và ưu đãi HSSV lấy từ trang GEARVN lúc khảo sát. Các sản phẩm khác, phí vận chuyển, mã `GIAM200K` và toàn bộ hình ảnh đều là **minh họa**, không phải dữ liệu thật của GEARVN.
