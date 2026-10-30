# MiniShop — ABF-AUTO

Website bán phụ kiện ô tô tĩnh (HTML/CSS/JS thuần, không build, không phụ thuộc thư viện ngoài).

**Xem trực tiếp:** https://tuda1921.github.io/MiniShop/

## Các trang

| Trang | File | Mô tả |
| --- | --- | --- |
| Trang chính (Shop) | `index.html` | Danh sách 360 sản phẩm, tìm kiếm, lọc, giỏ hàng |
| Sản phẩm | `shop.html` | Trang giữ chỗ — hiển thị địa chỉ web dự kiến |
| Danh mục hàng | `about.html` | Trang giữ chỗ — hiển thị địa chỉ web dự kiến |

## Tính năng trang chính

- 360 mặt hàng thuộc 12 danh mục phụ kiện ô tô, mỗi sản phẩm có ảnh, giá, giá gốc, % giảm, đánh giá và số đã bán.
- Nút **Thêm vào giỏ** và **Mua** trên từng sản phẩm.
- Giỏ hàng trượt bên phải: tăng/giảm số lượng, xoá món, tính tổng tiền, lưu lại sau khi tải lại trang (localStorage).
- Tìm kiếm theo tên/mã, lọc theo danh mục, dòng xe, khoảng giá và 5 kiểu sắp xếp.
- Phân trang 24 sản phẩm/trang, giao diện responsive (4 cột desktop, 2 cột mobile).

## Chạy tại máy

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một static server:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Cấu trúc

```
index.html            # Trang chính
shop.html             # Trang Sản phẩm (chưa triển khai)
about.html            # Trang Danh mục hàng (chưa triển khai)
assets/css/style.css  # Toàn bộ giao diện
assets/js/products.js # Sinh dữ liệu 360 sản phẩm (deterministic)
assets/js/app.js      # Lọc, tìm kiếm, phân trang, giỏ hàng
```

## Tuỳ chỉnh dữ liệu

Sửa `assets/js/products.js`:

- `categories`: danh mục và giá gốc.
- `models`: danh sách dòng xe.
- `TOTAL`: tổng số sản phẩm được sinh.

Ảnh sản phẩm là SVG sinh tự động nên không cần file ảnh đi kèm.

## Triển khai GitHub Pages

Toàn bộ site là file tĩnh ở thư mục gốc nên bật Pages với nhánh `main` / thư mục `/ (root)` là chạy ngay. File `.nojekyll` đã có sẵn để Jekyll không xử lý lại thư mục `assets`.
