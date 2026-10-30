(function () {
  const { categories, models, products } = window.SHOP_DATA;
  const PAGE_SIZE = 24;
  const CART_KEY = 'abf-auto-cart';

  const state = {
    category: '',
    model: '',
    price: '',
    sort: 'popular',
    keyword: '',
    page: 1
  };

  const el = {
    grid: document.getElementById('productGrid'),
    pagination: document.getElementById('pagination'),
    chips: document.getElementById('categoryChips'),
    modelFilter: document.getElementById('modelFilter'),
    priceFilter: document.getElementById('priceFilter'),
    sortFilter: document.getElementById('sortFilter'),
    searchForm: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput'),
    resultCount: document.getElementById('resultCount'),
    totalProducts: document.getElementById('totalProducts'),
    pageInfo: document.getElementById('pageInfo'),
    listTitle: document.getElementById('listTitle'),
    cartCount: document.getElementById('cartCount'),
    cartBody: document.getElementById('cartBody'),
    cartTotal: document.getElementById('cartTotal'),
    drawer: document.getElementById('cartDrawer'),
    overlay: document.getElementById('overlay'),
    toast: document.getElementById('toast')
  };

  const formatPrice = (n) => n.toLocaleString('vi-VN') + 'đ';

  /* ---------- Cart ---------- */
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((i) => i && i.id && i.qty > 0) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* localStorage có thể bị chặn - bỏ qua */
    }
  }

  function cartQuantity() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function cartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function addToCart(id, qty) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const existing = cart.find((i) => i.id === id);
    if (existing) {
      existing.qty += qty || 1;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: qty || 1 });
    }
    saveCart();
    renderCart();
    showToast('Đã thêm vào giỏ: ' + product.name);
  }

  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function renderCart() {
    el.cartCount.textContent = cartQuantity();

    if (!cart.length) {
      el.cartBody.innerHTML = '<div class="cart-empty"><p>Giỏ hàng đang trống.</p><p>Hãy chọn vài món phụ kiện nhé!</p></div>';
      el.cartTotal.textContent = '0đ';
      return;
    }

    el.cartBody.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" />
          <div class="cart-item-info">
            <p class="cart-item-name">${escapeHtml(item.name)}</p>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="qty">
              <button type="button" data-action="dec" data-id="${item.id}" aria-label="Giảm số lượng">−</button>
              <span>${item.qty}</span>
              <button type="button" data-action="inc" data-id="${item.id}" aria-label="Tăng số lượng">+</button>
            </div>
            <div><button class="remove-btn" type="button" data-action="remove" data-id="${item.id}">Xoá</button></div>
          </div>
        </div>`
      )
      .join('');

    el.cartTotal.textContent = formatPrice(cartTotal());
  }

  el.cartBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'inc') changeQty(id, 1);
    if (btn.dataset.action === 'dec') changeQty(id, -1);
    if (btn.dataset.action === 'remove') removeItem(id);
  });

  function openCart() {
    el.toast.classList.remove('show');
    el.drawer.classList.add('show');
    el.overlay.classList.add('show');
  }

  function closeCart() {
    el.drawer.classList.remove('show');
    el.overlay.classList.remove('show');
  }

  document.getElementById('openCart').addEventListener('click', openCart);
  document.getElementById('closeCart').addEventListener('click', closeCart);
  el.overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!cart.length) {
      showToast('Giỏ hàng đang trống.');
      return;
    }
    const msg = document.getElementById('cartMsg');
    msg.textContent = '✓ Đã ghi nhận đơn hàng ' + formatPrice(cartTotal()) + ' (demo).';
    msg.classList.add('show');
    clearTimeout(checkoutTimer);
    checkoutTimer = setTimeout(() => {
      msg.classList.remove('show');
      msg.textContent = '';
    }, 4000);
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  let checkoutTimer;
  function showToast(message) {
    if (el.drawer.classList.contains('show')) return;
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------- Filters ---------- */
  function buildFilters() {
    el.chips.innerHTML =
      '<button class="chip active" type="button" data-cat="">Tất cả</button>' +
      categories
        .map((c) => `<button class="chip" type="button" data-cat="${c.id}">${escapeHtml(c.name)}</button>`)
        .join('');

    el.modelFilter.innerHTML =
      '<option value="">Tất cả dòng xe</option>' +
      models.map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');

    el.chips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.category = chip.dataset.cat;
      state.page = 1;
      el.chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      render();
    });

    el.modelFilter.addEventListener('change', () => {
      state.model = el.modelFilter.value;
      state.page = 1;
      render();
    });

    el.priceFilter.addEventListener('change', () => {
      state.price = el.priceFilter.value;
      state.page = 1;
      render();
    });

    el.sortFilter.addEventListener('change', () => {
      state.sort = el.sortFilter.value;
      state.page = 1;
      render();
    });

    el.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.keyword = el.searchInput.value.trim();
      state.page = 1;
      render();
    });

    el.searchInput.addEventListener('input', () => {
      if (el.searchInput.value.trim() === '' && state.keyword !== '') {
        state.keyword = '';
        state.page = 1;
        render();
      }
    });
  }

  function getFiltered() {
    const keyword = state.keyword.toLowerCase();
    let list = products.filter((p) => {
      if (state.category && p.category !== state.category) return false;
      if (state.model && p.model !== state.model) return false;
      if (state.price) {
        const [min, max] = state.price.split('-').map(Number);
        if (p.price < min || p.price > max) return false;
      }
      if (keyword && !(p.name.toLowerCase().includes(keyword) || p.id.toLowerCase().includes(keyword))) return false;
      return true;
    });

    const sorters = {
      popular: (a, b) => b.sold - a.sold,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.sold - a.sold,
      name: (a, b) => a.name.localeCompare(b.name, 'vi')
    };
    return list.sort(sorters[state.sort] || sorters.popular);
  }

  /* ---------- Render ---------- */
  function cardHtml(p) {
    const badge = p.badge
      ? `<span class="badge${p.badge === 'Mall' ? ' mall' : ''}">${p.badge}</span>`
      : '';
    return `
      <article class="card">
        <div class="card-media">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
          ${badge}
          <span class="discount">-${p.discount}%</span>
        </div>
        <div class="card-body">
          <h3 class="card-name" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h3>
          <div class="price-row">
            <span class="price">${formatPrice(p.price)}</span>
            <span class="old-price">${formatPrice(p.oldPrice)}</span>
          </div>
          <div class="meta-row">
            <span class="stars">★ ${p.rating.toFixed(1)}</span>
            <span>|</span>
            <span>Đã bán ${p.sold}</span>
          </div>
          <div class="card-actions">
            <button class="btn-add" type="button" data-add="${p.id}">Thêm vào giỏ</button>
            <button class="btn-buy" type="button" data-buy="${p.id}">Mua</button>
          </div>
        </div>
      </article>`;
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      el.pagination.innerHTML = '';
      return;
    }
    const current = state.page;
    const pages = [];
    const push = (n) => pages.push(n);

    push(1);
    for (let i = current - 2; i <= current + 2; i++) {
      if (i > 1 && i < totalPages) push(i);
    }
    if (totalPages > 1) push(totalPages);

    const unique = [...new Set(pages)].sort((a, b) => a - b);
    let html = `<button class="page-btn" type="button" data-page="${current - 1}" ${current === 1 ? 'disabled' : ''}>‹</button>`;
    let prev = 0;
    unique.forEach((n) => {
      if (prev && n - prev > 1) html += '<span class="page-dots">…</span>';
      html += `<button class="page-btn${n === current ? ' active' : ''}" type="button" data-page="${n}">${n}</button>`;
      prev = n;
    });
    html += `<button class="page-btn" type="button" data-page="${current + 1}" ${current === totalPages ? 'disabled' : ''}>›</button>`;
    el.pagination.innerHTML = html;
  }

  function render() {
    const list = getFiltered();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    el.resultCount.textContent = list.length;
    el.pageInfo.textContent = list.length
      ? `Trang ${state.page}/${totalPages} · ${start + 1}-${start + pageItems.length} trên ${list.length}`
      : '';

    const activeCat = categories.find((c) => c.id === state.category);
    el.listTitle.textContent = state.keyword
      ? `Kết quả cho "${state.keyword}"`
      : activeCat
        ? activeCat.name
        : 'Gợi ý cho bạn';

    if (!pageItems.length) {
      el.grid.innerHTML =
        '<div class="empty" style="grid-column:1/-1"><h3>Không tìm thấy sản phẩm</h3><p>Thử bỏ bớt bộ lọc hoặc từ khoá khác.</p></div>';
      el.pagination.innerHTML = '';
      return;
    }

    el.grid.innerHTML = pageItems.map(cardHtml).join('');
    renderPagination(totalPages);
  }

  el.grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      addToCart(addBtn.dataset.add, 1);
      return;
    }
    const buyBtn = e.target.closest('[data-buy]');
    if (buyBtn) {
      addToCart(buyBtn.dataset.buy, 1);
      openCart();
    }
  });

  el.pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]');
    if (!btn || btn.disabled) return;
    const page = Number(btn.dataset.page);
    if (!page || page < 1) return;
    state.page = page;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('followBtn').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const liked = btn.dataset.liked === '1';
    btn.dataset.liked = liked ? '0' : '1';
    btn.textContent = liked ? 'Yêu thích' : 'Đã yêu thích ♥';
    showToast(liked ? 'Đã bỏ yêu thích shop.' : 'Đã thêm shop vào yêu thích.');
  });

  /* ---------- Init ---------- */
  el.totalProducts.textContent = products.length;
  buildFilters();
  renderCart();
  render();
})();
