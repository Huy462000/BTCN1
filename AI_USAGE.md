# Báo cáo sử dụng AI

## Công cụ

- **Công cụ:** Claude Code (mô hình Claude Opus 5.5 của Anthropic), dùng trong tiện ích mở rộng của VS Code
- **Thời gian:** 14/11/2026

## Phần do sinh viên thực hiện (không dùng AI)

- Khảo sát trang giỏ hàng GEARVN, chụp ảnh "Trước" và xác định các vấn đề.
- Chọn khu vực cải tiến và thống nhất phương án thiết kế. Phương án được ghi trong file hướng dẫn `CLAUDE.md` để AI làm theo.

## Các yêu cầu đã gửi cho AI

| Lần | Yêu cầu (tóm tắt) | AI đã làm |
|---|---|---|
| 1 | Tạo trang thương mại điện tử bằng HTML5/CSS3 có tiêu đề, khu vực sản phẩm, tối thiểu 4 sản phẩm (ảnh, tên, giá, nút); dùng được trên máy tính và điện thoại; CSS tách file riêng; không backend, không thư viện thừa | Tạo `index.html`, `style.css`, `script.js` và ảnh minh họa SVG |
| 2 | Bản đầu mới giống trang thanh toán, chưa thấy trang bán hàng | Làm lại: lưới sản phẩm là phần chính, nút "Thêm vào giỏ" hoạt động, tóm tắt đơn hàng tự cập nhật |
| 3 | Giao diện chưa có tiêu đề và danh mục | Thêm thanh danh mục có lọc sản phẩm và khối tiêu đề trang có đường dẫn |
| 4 | Bấm giỏ hàng phải mở một trang riêng | Tách thành `gio-hang.html`; giỏ hàng lưu bằng `localStorage`; thêm nút − / + chỉnh số lượng |
| 5 | Lưu file theo cấu trúc thư mục yêu cầu | Sắp xếp lại thư mục, tạo `product-demo.jpg`, viết `README.md` và file này |

## Kiểm tra và chỉnh sửa kết quả của AI

- Sinh viên đã phát hiện và yêu cầu AI sửa: bản đầu thiếu trang bán hàng (lần 2), thiếu tiêu đề và danh mục (lần 3), giỏ hàng chưa là trang riêng (lần 4).
- AI tự kiểm tra cú pháp JavaScript và tính tay các số tiền mẫu (ví dụ 27.017.100đ).
- Sinh viên tự kiểm tra trên trình duyệt: *[bổ sung: thiết bị/chiều rộng đã thử, lỗi phát hiện, kết quả]*

## Giới hạn và lưu ý

- Ảnh sản phẩm là hình minh họa do AI tạo, không phải ảnh thật của GEARVN.
- Phí vận chuyển, mã giảm giá và các sản phẩm ngoài laptop Acer Nitro là số liệu minh họa.
- AI có dùng thêm JavaScript cho các chức năng không làm được bằng HTML/CSS: lọc danh mục, thêm/xóa sản phẩm, tính lại tiền và thông báo mã giảm giá.
