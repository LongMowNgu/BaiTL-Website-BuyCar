# AutoTrade - Website mua bán ô tô

## Cấu trúc dự án
```
main/
├── index.html          # Main homepage with scrolling layout
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   └── main.js         # JavaScript functionality
├── images/             # Image assets (to be added)
│   ├── hero-car.svg
│   ├── car1.jpg
│   ├── car2.jpg
│   └── car3.jpg
└── pages/              # Additional pages (to be created)
    ├── login.html
    ├── register.html
    ├── browse.html
    ├── sell.html
    ├── car-details.html
    ├── about.html
    ├── testimonials.html
    ├── faq.html
    ├── blog.html
    ├── financing.html
    ├── insurance.html
    ├── guides.html
    ├── privacy.html
    └── terms.html
```

## Các tính năng đã triển khai

1. Thanh điều hướng
- Thanh điều hướng trên cùng cố định với tính năng cuộn mượt mà
- Menu di động đáp ứng
- Nút Đăng nhập/Đăng ký ở phía bên phải
- Làm nổi bật liên kết đang hoạt động dựa trên vị trí cuộn
- Thay đổi nền khi cuộn để hiển thị rõ hơn

2. Bố cục trang đích cuộn
Trang chủ bao gồm các phần sau:
- Phần Anh hùng - Giao diện bắt mắt với các nút kêu gọi hành động
- Xe nổi bật - Trưng bày xe cao cấp có thẻ
- Cách thức hoạt động - Giải thích quy trình 4 bước
- Dịch vụ - 6 dịch vụ chính được cung cấp
- Lời chứng thực - Đánh giá của khách hàng
- Liên hệ - Mẫu liên hệ và thông tin
- Sơ đồ trang web - Liên kết nhanh đến tất cả các trang
- Chân trang - Bản quyền và liên kết pháp lý

3. Điều hướng giữa các phần
- Mỗi phần bao gồm một biểu tượng hình chữ V hướng xuống để điều hướng đến phần tiếp theo
- Hoạt ảnh cuộn mượt mà
- Thay thế cho thanh điều hướng trên cùng

4. Tính năng tương tác
- Nút quay lại đầu trang (xuất hiện khi cuộn)
- Hiệu ứng di chuột trên thẻ
- Xác thực biểu mẫu để liên hệ và nhận bản tin (ghi log vào console để demo)
- Hoạt ảnh cuộn hiển thị
- Phím tắt (H để vào trang chủ, T để vào đầu trang)

## Công nghệ được sử dụng
- HTML5 - Đánh dấu ngữ nghĩa
- CSS3 - Kiểu dáng hiện đại với hình ảnh động
- JavaScript (ES6) - Chức năng tương tác
- Bootstrap 5 - Lưới và thành phần đáp ứng
- Bootstrap Icons - Thư viện biểu tượng

## Cách sử dụng
1. Mở `index.html` trong trình duyệt web
2. Điều hướng bằng thanh điều hướng trên cùng hoặc cuộn xuống
3. Nhấp vào các phần hình chữ V để điều hướng giữa các phần
4. Tất cả các biểu mẫu đều có chức năng demo (ghi nhật ký vào console)

## Thêm hình ảnh
Để hoàn thiện thiết kế, hãy thêm những hình ảnh sau vào thư mục `images/`:
- `hero-car.svg` — Minh họa phần xe anh hùng
- `car1.jpg` — Mercedes-Benz E-Class
- `car2.jpg` — Toyota RAV4 Hybrid
- `car3.jpg` — BMW M3 Competition

Kích thước hình ảnh được đề xuất:
- Xe anh hùng: 800x600px (khuyến khích dùng SVG)
- Thẻ xe: 800x600px (ngang)

## Các bước tiếp theo
Bạn có thể mở rộng dự án này bằng cách:
- Tạo các trang bổ sung được tham chiếu trong điều hướng
- Thêm hình ảnh thực tế cho xe cộ
- Triển khai phần phụ trợ cho việc gửi biểu mẫu
- Thêm nhiều tính năng tương tác hơn
- Tạo cơ sở dữ liệu cho danh sách xe hơi

## Ghi chú
- Tất cả mã đều tuân theo các phương pháp hay nhất với các chú thích rõ ràng
- Thiết kế đáp ứng hoạt động trên mọi kích thước màn hình
- Tuân theo hướng dẫn của dự án (đặt tên tiếng Anh, mã định danh có ý nghĩa)
- Chỉ triển khai ở giao diện người dùng (không có mã phía máy chủ)

---

Được tạo cho: Bài tập nhóm - Khóa học thiết kế web  
Chủ đề: Quản lý giao dịch xe cộ (Chủ đề 12)