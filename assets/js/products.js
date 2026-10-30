/* Dữ liệu sản phẩm được sinh tự động (deterministic) để trang luôn có 360 mặt hàng. */
window.SHOP_DATA = (function () {
  const categories = [
    { id: 'nen-kinh', name: 'Nẹp viền chân kính inox', base: 209000, hue: 205 },
    { id: 'buoc-chan', name: 'Ốp bước chân', base: 349000, hue: 25 },
    { id: 've-mua', name: 'Vè che mưa', base: 159000, hue: 190 },
    { id: 'tham-san', name: 'Thảm lót sàn', base: 690000, hue: 265 },
    { id: 'op-guong', name: 'Ốp gương chiếu hậu', base: 259000, hue: 340 },
    { id: 'den-led', name: 'Đèn LED ban ngày', base: 890000, hue: 45 },
    { id: 'camera', name: 'Camera hành trình', base: 1290000, hue: 220 },
    { id: 'vo-lang', name: 'Bọc vô lăng', base: 320000, hue: 15 },
    { id: 'gia-noc', name: 'Giá nóc - thanh ngang', base: 1150000, hue: 160 },
    { id: 'lot-cop', name: 'Lót cốp', base: 450000, hue: 285 },
    { id: 'op-cot', name: 'Ốp cột A - B', base: 189000, hue: 100 },
    { id: 'noi-that', name: 'Trang trí nội thất', base: 240000, hue: 300 }
  ];

  const models = [
    'Hyundai Stargazer', 'Hyundai Accent', 'Hyundai Creta', 'Kia Seltos',
    'Kia Morning', 'Mazda CX-5', 'Mazda 3', 'Toyota Vios',
    'Toyota Corolla Cross', 'Ford Everest', 'Mitsubishi Xpander',
    'VinFast VF 5', 'Honda City', 'Nissan Almera'
  ];

  const variants = ['bản tiêu chuẩn', 'bản cao cấp', 'màu carbon', 'màu bạc', 'full bộ', 'loại dày'];

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeImage(cat, seed) {
    const h = cat.hue;
    const c1 = 'hsl(' + h + ' 72% 94%)';
    const c2 = 'hsl(' + h + ' 62% 80%)';
    const accent = 'hsl(' + h + ' 68% 42%)';
    const tilt = (seed % 7) - 3;
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="400" height="400" fill="url(#g)"/>' +
      '<circle cx="330" cy="72" r="96" fill="#ffffff" opacity="0.35"/>' +
      '<circle cx="60" cy="330" r="70" fill="#ffffff" opacity="0.25"/>' +
      '<g transform="rotate(' + tilt + ' 200 200)" fill="none" stroke="' + accent +
      '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M55 250c0-26 22-38 52-44l44-38c12-10 30-16 52-16h62c24 0 44 8 60 26l26 30c22 6 34 16 34 34v18H55z"/>' +
      '<circle cx="132" cy="262" r="30"/><circle cx="318" cy="262" r="30"/>' +
      '<path d="M152 168h148"/>' +
      '</g>' +
      '<text x="200" y="352" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" ' +
      'font-size="26" font-weight="700" fill="' + accent + '" opacity="0.8">ABF-AUTO</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  const products = [];
  const TOTAL = 360;

  for (let i = 0; i < TOTAL; i++) {
    const cat = categories[i % categories.length];
    const modelIndex = Math.floor(i / categories.length) % models.length;
    const variantIndex = Math.floor(i / (categories.length * models.length)) % variants.length;
    const rand = mulberry32(i * 7919 + 13);

    const modelFactor = 1 + (modelIndex % 5) * 0.04;
    const variantFactor = 1 + variantIndex * 0.06;
    const raw = cat.base * (0.85 + rand() * 0.5) * modelFactor * variantFactor;
    const price = Math.round(raw / 1000) * 1000;
    const oldPrice = Math.round((price * (1.1 + rand() * 0.28)) / 1000) * 1000;
    const rating = Math.min(5, Math.round((4 + rand()) * 10) / 10);
    const sold = 5 + Math.floor(rand() * 495);
    const badge = rand() < 0.12 ? 'Mall' : rand() < 0.35 ? 'Yêu thích' : '';

    products.push({
      id: 'SP' + String(i + 1).padStart(3, '0'),
      name: cat.name + ' ' + models[modelIndex] + ' ' + variants[variantIndex],
      category: cat.id,
      categoryName: cat.name,
      model: models[modelIndex],
      price: price,
      oldPrice: oldPrice,
      discount: Math.round((1 - price / oldPrice) * 100),
      rating: rating,
      sold: sold,
      badge: badge,
      image: makeImage(cat, i)
    });
  }

  return { categories: categories, models: models, products: products };
})();
