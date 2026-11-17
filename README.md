# Hẹn Ngày Mai

Nguyên mẫu trò chơi hỗ trợ cảm xúc bằng tiếng Việt, dành cho người trưởng thành trẻ.

## Chơi thử:

https://btphuong3011.github.io/hen-ngay-mai/

Bản GitHub Pages có vườn, phòng trà, hoạt động chạm, gieo việc nhỏ, nghe chuyện và góc trò chuyện viết sẵn có nhãn rõ ràng. GitHub Pages không chạy backend Gemini.

## Chạy bản Gemini trên máy:

Cần Node.js 22 trở lên. Sao chép `.env.example` thành `.env.local`, cấu hình khóa tại máy, rồi chạy `node scripts/dev-server.mjs`. Mở http://127.0.0.1:4183/. Không đưa khóa lên GitHub hoặc mã trình duyệt.

## Phạm vi:

Bản ổn định v0.3, lưu ngày 17/11/2026. Những bổ sung về giọng kể AI và sân khấu nhảy đang phát triển riêng, chưa nằm trong bản nộp này. Ứng dụng không chẩn đoán, cung cấp trị liệu hay dịch vụ khẩn cấp; chưa có nghiên cứu hiệu quả sức khỏe.

## Kiểm tra:

`node --test tests/companion.test.mjs tests/chat-api.test.mjs`

Tham khảo `CONCEPT_V3.md`, `PODCAST_REFERENCES.md`, `ASSETS_GUIDE.md` để biết thiết kế, nguồn nội dung và tài nguyên.
