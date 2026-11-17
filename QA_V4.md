# Kiểm tra v0.4:

## Đã kiểm tra bằng mã:

- Bộ kiểm tra gồm API, luồng trò chuyện viết sẵn, vườn việc nhỏ, các kịch bản cũ, trình nghe và HTTP Range.
- Trình nghe: chọn bài không tự phát; tạm dừng và tiếp tục giữ vị trí; dừng rồi phát lại; đổi bài khi đang tải; bỏ qua sự kiện bài cũ; tạm dừng khi ẩn tab; tua, tốc độ, âm lượng; đổi nguồn đọc không tự phát; hiển thị lỗi mà không giả vờ phát thành công.
- HTTP Range: đoạn giữa, đuôi, khoảng mở, vượt cuối, khoảng không hợp lệ, HEAD không có body. Worker và server cục bộ dùng cùng hàm trả asset.
- Kiểm tra cú pháp JavaScript, build Worker, truy xuất HTML/CSS/JS và bốn MP3 từ bundle. Khóa không nằm trong bundle hoặc bản xuất GitHub.

## Giới hạn xác minh:

Phiên này không có công cụ điều khiển trình duyệt để kiểm tra trực quan và thao tác thực tế. Việc kiểm tra HTTP, trạng thái bằng test và cú pháp không xác nhận bố cục cuối cùng trên từng thiết bị, chất lượng phát âm hoặc cảm nhận biểu cảm của giọng kể. Chưa nghe duyệt toàn bộ bốn tệp bằng tai; cần người dùng nghe và góp ý.

## Khi chơi thử:

1. Mở Sân khấu, thử ba điệu và chạm Mây. Bật/tắt nhạc; thử nút giảm chuyển động.
2. Khi Mây đang nhảy, chuyển cảnh hoặc mở Tâm sự: tiết mục phải dừng.
3. Mở Nghe chuyện: chỉ phát sau khi chạm nút. Thử tua, dừng/phát lại, đổi bài và đổi giọng.
4. Chuyển sang tab khác rồi quay lại: không tự phát tiếp.
5. Kiểm tra màn hình 320, 390, 768 và 1440 px, chế độ sáng/tối, loa và tai nghe. Bố cục sân khấu dành thêm chiều cao trên điện thoại để tách nhân vật và bảng điều khiển.
