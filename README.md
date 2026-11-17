# Mây Ơi:

Chơi một chút. Kể Mây nghe.

Trò chơi đồng hành hỗ trợ cảm xúc bằng tiếng Việt, dành cho người trưởng thành trẻ. Bản phát triển v0.4.

## Chơi thử:

https://btphuong3011.github.io/hen-ngay-mai/

Vườn mây, phòng trà có mưa, sân khấu với ba điệu nhảy và nhạc tổng hợp tùy chọn, trò chơi chạm, vườn việc nhỏ và bốn bản kể AI tạo sẵn có tua/tốc độ/âm lượng. Giọng AI có ghi nhãn; không mô phỏng giọng Hêu Podcast.

GitHub Pages chạy bản trò chuyện viết sẵn với nhãn rõ ràng. Phần kể AI là tệp âm thanh có sẵn, nghe được trực tiếp trên Pages. Gemini trò chuyện cần backend riêng.

## Chạy Gemini trên máy:

Cần Node.js 22 trở lên. Sao chép `.env.example` thành `.env.local`, cấu hình khóa tại máy, rồi chạy `node scripts/dev-server.mjs`. Mở http://127.0.0.1:4183/. Không đưa khóa lên GitHub hoặc mã trình duyệt.

## Kiểm tra và build:

`node --test tests/*.test.mjs`

`node scripts/build-worker.mjs`

Game không cần cài thư viện để chạy. Công cụ biên soạn âm thanh trong `scripts/` không chạy trong build: tạo lại WAV cần API và có thể mất phí; mã hóa MP3 cần Python và lameenc, xem `NARRATION_CREDITS.md`.

## Phạm vi và nguồn:

Ứng dụng không chẩn đoán, cung cấp trị liệu hoặc dịch vụ khẩn cấp; chưa có nghiên cứu hiệu quả sức khỏe. Xem `CONCEPT_V4.md`, `QA_V4.md`, `PODCAST_REFERENCES.md`, `ASSETS_GUIDE.md`, `NARRATION_CREDITS.md` để biết thiết kế, giới hạn kiểm tra và nguồn tài nguyên. Tài liệu minh họa tại `docs/minh-hoa.pdf` được cập nhật theo tên Mây Ơi và nguyên mẫu v0.4. URL giữ tên cũ để các liên kết đã gửi tiếp tục hoạt động.
