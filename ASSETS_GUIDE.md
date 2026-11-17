# Tài nguyên của concept Mây

## Bổ sung v0.4:

- Sân khấu và các điệu nhảy dựng bằng SVG/CSS gốc trong `companion-show.js`/`companion-show.css`.
- Bốn bản kể AI tạo sẵn nằm ở `dist/assets/narration/`; công cụ, nguồn và giới hạn được ghi tại `NARRATION_CREDITS.md`. Các mô tả giọng thiết bị phía dưới là lịch sử của phiên bản cũ.
- Nhạc sân khấu được tổng hợp bằng mã, chỉ phát khi bật; không lấy nhạc hoặc giọng người dẫn podcast.

## Bổ sung v0.3:

- `dist/assets/rain-room.png`: phòng trà tạo bằng ImageGen tích hợp; prompt ở `ROOM_ART_PROMPT.md`.
- Mưa, hơi trà, lá, đom đóm, chuyển cảnh và sticker được điều khiển bằng `companion-plus.js`/`companion-plus.css`.
- Bốn chuyện hiện tại thay bộ ba chuyện v0.2. Nguồn chủ đề, phạm vi đã đọc và giới hạn sử dụng podcast được ghi ở `PODCAST_REFERENCES.md`.
- Âm nền phòng trà là tiếng mưa tổng hợp bằng Web Audio, không lấy bản thu của podcast. Giọng kể vẫn là giọng của thiết bị.

## Hiện đã có:

- `dist/assets/cloud-garden.png`: tranh nền tạo bằng công cụ ImageGen tích hợp; prompt đầy đủ trong `ART_PROMPTS.md`.
- Mây: thành phần SVG gốc trong `dist/companion.js`; các lớp mắt, tay, lá và miệng được điều khiển bằng `dist/companion.css`. Không cần tải một nhân vật thương mại để dùng cho bản đầu.
- Hoa, bong bóng và biểu tượng: đồ họa dựng bằng mã trong dự án.
- Phông Be Vietnam Pro từ Google Fonts, giấy phép OFL trong `dist/assets/fonts/`.
- Ba chuyện ngắn: nội dung gốc trong `dist/companion-engine.js`. Giọng đọc hiện dùng giọng của thiết bị, không phải một file podcast đã thu.

## Nếu bạn muốn góp hình:

Bạn có thể gửi một nhân vật gốc có 5 trạng thái: nghỉ, vui, vẫy tay, lắng nghe, buồn ngủ. Để nhân vật cử động tự nhiên, bản SVG có tay, mắt và miệng tách lớp sẽ hữu ích hơn một ảnh phẳng. Nếu gửi PNG, dùng nền trong suốt, cùng kích thước khung và cùng vị trí chân ở mọi trạng thái. Cần giữ giấy phép hoặc xác nhận quyền sử dụng của người vẽ.

Một bộ nền ngày/đêm cùng góc nhìn, tỷ lệ 16:9, khoảng trống ở giữa cho Mây sẽ giúp chế độ ngồi yên có diện mạo riêng hơn. Tránh chữ, logo và nhân vật có bản quyền của game khác trong nền.

## Nếu bạn muốn góp nội dung hoặc âm thanh:

- 5–10 mẩu chuyện đời thường ngắn, giúp người nghe cảm thấy được tôn trọng, không ép lạc quan hoặc hứa khỏi bệnh.
- Một bản thu giọng đọc 45–90 giây có sự đồng ý của người đọc, kèm bản chữ.
- Âm thanh môi trường tự thu hoặc có giấy phép cho phép sử dụng và phân phối. Ghi rõ tác giả, nguồn và điều kiện ghi công.

Chưa cần mua bộ asset hoặc gửi API key để chơi thử bản hiện tại. Nếu triển khai AI thật, cấu hình khóa ở backend; không dán khóa vào cuộc trò chuyện hay mã frontend.
