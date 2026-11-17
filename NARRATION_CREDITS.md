# Nguồn âm thanh và cách tạo:

Bốn truyện nằm trong `dist/companion-engine.js`, được viết riêng cho Mây Ơi. Chủ đề tham khảo và các liên kết podcast nằm ở `PODCAST_REFERENCES.md`; không dùng bản thu, nhạc, mẫu giọng hoặc cốt truyện đặc thù của Hêu Podcast.

## Bản kể AI:

- Google Gemini, model `gemini-3.8-flash-lite-tts`, giọng có sẵn `Sulafat`.
- Tạo từ văn bản gốc và chỉ dẫn biểu cảm theo ba đoạn, không dùng tham chiếu giọng người thật.
- Định dạng phát: MP3 mono, 64 kbps. Metadata về tệp và thời lượng ở `dist/assets/narration/manifest.json`.
- Giọng AI được ghi rõ trong giao diện. Có lựa chọn giọng thiết bị; không tự đổi nguồn khi bản thu lỗi.
- Chỉ công cụ biên soạn ngoại tuyến gọi API. Khi người chơi nghe bản thu, trình duyệt tải tệp âm thanh từ nơi lưu game; nội dung tâm sự không tham gia quá trình tạo âm thanh này.

Tài liệu nhà cung cấp: https://ai.google.dev/gemini-api/docs/speech-generation

## Công cụ biên soạn:

`scripts/generate-narration.mjs` đọc khóa cục bộ và tạo WAV ở thư mục ngoài repo. Không chạy công cụ này trong build hoặc khi người chơi mở game; tạo lại có thể phát sinh phí API.

`scripts/encode-narration.py` dùng `lameenc` 1.8.1 để mã hóa WAV thành MP3. Đây là công cụ ngoại tuyến, không nằm trong runtime game và không phân phối thư viện nhị phân trong repo. Gói công cụ có giấy phép LGPL-3.0: https://pypi.org/project/lameenc/1.8.1/

## Sân khấu:

Nhạc nền sân khấu là giai điệu ngắn tổng hợp bằng Web Audio từ mã gốc, không trích từ podcast. Bật nhạc và nhảy là hai lựa chọn chủ động. Chuyển cảnh, mở cửa sổ hoạt động, giảm chuyển động hoặc ẩn tab sẽ dừng tiết mục.
