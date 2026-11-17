# Kiểm tra nguyên mẫu Mây v0.3:

Ngày 17/11/2026. Đây là kiểm tra phần mềm, chưa phải đánh giá lâm sàng hoặc nghiên cứu hiệu quả sức khỏe.

## Kết quả tự động:

20 kiểm tra đều đạt: trạng thái hạt, xác nhận không cộng hai lần, khôi phục dữ liệu giới hạn, nội dung mẫu, giới hạn y khoa, kiểm tra danh tính/origin/đồng thuận, giới hạn nội dung và tần suất, phản hồi Gemini có lịch sử, lỗi API không lộ khóa, không giả AI khi thiếu cấu hình và adapter OpenAI.

Worker đã build được và đã kiểm tra thực thi: phục vụ HTML, ảnh phòng trà, API cấu hình phản ánh đúng khi không có secret. Đã kiểm tra khóa thật không xuất hiện trong bundle hoặc các script. `.env.local` và `API.docx` bị bỏ qua trong Git và không đưa vào gói tải về.

## Kiểm tra Gemini thật trên máy:

Khóa đọc trực tiếp từ Word sang cấu hình cục bộ, không in nội dung khóa. Google xác thực và trả danh sách model thành công. Model đầu trả 503 vì quá tải; chuyển sang `gemini-3.1-flash-lite` đã sinh câu trả lời thành công. Hội thoại hai lượt về bài thi rồi kỳ vọng gia đình được phản hồi theo mạch; lựa chọn chỉ nghe không lập tức đưa danh sách giải pháp. Sticker gửi được và nhận câu trả lời AI thật. Những câu đã dùng đều là dữ liệu kiểm thử do người phát triển nhập, không phải tiết lộ sức khỏe của người dùng.

## Trình duyệt:

- Desktop 1280 px, khung trung 640 px, điện thoại 390 px và màn hình 320 px. Đã sửa chiều rộng khu vườn để tỷ lệ ảnh không làm tràn khung trung. Ở 320/390/640 px, trang không tràn ngang; cửa sổ chat/đồng thuận vừa chiều cao, vùng chat cuộn riêng, nút gửi vẫn dùng được.
- Chọn việc chưa sinh hoa; xác nhận đã làm chuyển từ 0 sang 1 bông, bỏ trạng thái mầm. Có thể để sau hoặc chọn lại.
- Năm đom đóm chạm được và chuyển sang trạng thái hoàn thành; trò chơi không có đồng hồ đếm ngược.
- Chuyển cảnh hiển thị ảnh phòng trà, có mưa chuyển động; thao tác rót trà chạy animation `may-serve`. Nút dừng đưa Mây và mưa về trạng thái paused.
- Đã sửa tương phản chữ ở giao diện đêm và bong bóng lời nói của phòng trà.
- Bốn chuyện và bốn liên kết nguồn hiện đúng. Chỉnh tốc độ đọc thành 0.8×, phát và dừng được bằng giọng thiết bị.
- Dữ liệu kiểm thử nguy cấp chuyển sang nội dung hướng dẫn nhờ người thật, ẩn sticker và ô gửi. Không khẳng định có nhân viên hỗ trợ đang trực.
- Lỗi AI hiện rõ, có nút thử lại. Bản viết sẵn được ghi nhãn riêng.

## Giới hạn còn lại:

AI có thể trả lời sai; nội dung hướng dẫn và từ khóa chưa đủ để chứng minh an toàn lâm sàng. Giới hạn lượt theo isolate chưa phải hạn mức chi phí toàn cục. Chưa kiểm tra mọi trình duyệt hoặc thiết bị. OpenAI mới kiểm thử adapter bằng mô phỏng, chưa gọi bằng khóa thật.

Secret Gemini cho bản Sites chưa được cấu hình do cách chuyển khóa qua đầu ra công cụ bị kiểm duyệt từ chối. Bản cục bộ đọc khóa trực tiếp và chạy được. Bản trực tuyến phải báo chưa có AI khi thiếu secret, không giả vờ đã kết nối.
