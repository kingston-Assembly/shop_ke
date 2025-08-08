// Main app logic for Kingstone KE SPA

const storageKeys = {
  cart: 'kingstone_ke_cart',
  theme: 'kingstone_ke_theme'
};

const deliveryFeeNairobi = 300;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.cart)) || [];
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
}

function calculateCart(cart) {
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);
  return { subtotal, delivery: cart.length > 0 ? deliveryFeeNairobi : 0, total: subtotal + (cart.length > 0 ? deliveryFeeNairobi : 0) };
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  categoryList.forEach((cat, i) => {
    const color = i % 2 === 0 ? '#00a859' : '#bb1919';
    const el = document.createElement('a');
    el.href = '#shop';
    el.className = 'category-card reveal';
    el.innerHTML = `
      <div class="category-icon" style="background: linear-gradient(180deg, ${color}22, ${color}10)">🔖</div>
      <div class="category-name">${cat}</div>
    `;
    grid.appendChild(el);
  });
}

function productMatchesQuery(product, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q) || product.tags.some(t => t.toLowerCase().includes(q));
}

function sortProducts(products, mode) {
  const p = [...products];
  switch (mode) {
    case 'priceLow': return p.sort((a, b) => a.price - b.price);
    case 'priceHigh': return p.sort((a, b) => b.price - a.price);
    case 'newest': return p.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'popularity':
    default: return p.sort((a, b) => b.popularity - a.popularity);
  }
}

function renderProducts({ query = '', sort = 'popularity' } = {}) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const filtered = productCatalog.filter(p => productMatchesQuery(p, query));
  const sorted = sortProducts(filtered, sort);
  grid.innerHTML = '';
  if (sorted.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; color: var(--muted); padding: 20px;">No products found.</div>`;
    return;
  }
  sorted.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.innerHTML = `
      <div class="product-media" style="background-image: url('${prod.image}')"></div>
      <div class="product-body">
        <h3 class="product-title">${prod.name}</h3>
        <div class="product-meta">${prod.category}</div>
      </div>
      <div class="product-foot">
        <div class="price">${formatPriceKES(prod.price)}</div>
        <button class="add-btn" data-id="${prod.id}">Add</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function getProductById(id) {
  return productCatalog.find(p => p.id === id);
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const cart = loadCart();
  const existing = cart.find(line => line.id === product.id);
  if (existing) existing.qty += 1; else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
  saveCart(cart);
  animateCartCount();
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  const cart = loadCart();
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  if (countEl) countEl.textContent = String(count);
}

function animateCartCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  el.animate([
    { transform: 'scale(1)', offset: 0 },
    { transform: 'scale(1.25)', offset: 0.4 },
    { transform: 'scale(1)', offset: 1 }
  ], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
}

function openCart() { document.getElementById('cartDrawer')?.classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer')?.classList.remove('open'); }

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('cartSubtotal');
  const cart = loadCart();
  if (!itemsEl || !subtotalEl) return;
  itemsEl.innerHTML = '';
  if (cart.length === 0) {
    itemsEl.innerHTML = `<div style="color: var(--muted);">Your cart is empty.</div>`;
  }
  cart.forEach(line => {
    const row = document.createElement('div');
    row.className = 'cart-line';
    row.innerHTML = `
      <div class="cart-line-thumb" style="background-image: url('${line.image}')"></div>
      <div class="cart-line-body">
        <div class="cart-line-title">${line.name}</div>
        <div class="cart-line-meta">${formatPriceKES(line.price)}</div>
        <div class="qty">
          <button class="qty-dec" data-id="${line.id}">−</button>
          <input value="${line.qty}" readonly />
          <button class="qty-inc" data-id="${line.id}">+</button>
        </div>
      </div>
      <button class="icon-btn remove-line" data-id="${line.id}" title="Remove">✕</button>
    `;
    itemsEl.appendChild(row);
  });
  const calc = calculateCart(cart);
  subtotalEl.textContent = formatPriceKES(calc.subtotal);
}

function updateLineQty(productId, delta) {
  const cart = loadCart();
  const line = cart.find(l => l.id === productId);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    const idx = cart.findIndex(l => l.id === productId);
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeLine(productId) {
  const cart = loadCart();
  const idx = cart.findIndex(l => l.id === productId);
  if (idx >= 0) cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function renderCheckout() {
  const itemsEl = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const deliveryEl = document.getElementById('checkoutDelivery');
  const totalEl = document.getElementById('checkoutTotal');
  if (!itemsEl || !subtotalEl || !deliveryEl || !totalEl) return;
  const cart = loadCart();
  itemsEl.innerHTML = '';
  cart.forEach(line => {
    const row = document.createElement('div');
    row.className = 'checkout-line';
    row.innerHTML = `
      <div class="checkout-thumb" style="background-image: url('${line.image}')"></div>
      <div>
        <div style="font-weight:600">${line.name}</div>
        <div style="color:var(--muted); font-size:13px;">Qty: ${line.qty}</div>
      </div>
      <div>${formatPriceKES(line.price * line.qty)}</div>
    `;
    itemsEl.appendChild(row);
  });
  const calc = calculateCart(cart);
  subtotalEl.textContent = formatPriceKES(calc.subtotal);
  deliveryEl.textContent = formatPriceKES(calc.delivery);
  totalEl.textContent = formatPriceKES(calc.total);
}

function isValidKenyanPhone(msisdn) {
  const s = (msisdn || '').replace(/\s|-/g, '');
  if (/^(?:\+?254|0)(7|1)\d{8}$/.test(s)) return true; // +2547|+2541|07|01
  return false;
}

function simulateMpesaPayment(phone, amount) {
  return new Promise((resolve) => {
    const status = document.getElementById('mpesaStatus');
    if (status) {
      status.style.color = 'var(--muted)';
      status.textContent = 'Sending STK Push... Check your phone to authorize payment.';
    }
    setTimeout(() => {
      if (status) status.textContent = 'Awaiting confirmation...';
    }, 1200);
    setTimeout(() => {
      resolve({ success: true, receipt: 'KS' + Math.floor(Math.random() * 1e8).toString().padStart(8, '0') });
    }, 2800);
  });
}

function handleMpesaSubmit(e) {
  e.preventDefault();
  const phone = document.getElementById('mpesaPhone').value.trim();
  const status = document.getElementById('mpesaStatus');
  const cart = loadCart();
  const { total } = calculateCart(cart);
  if (!isValidKenyanPhone(phone)) {
    status.style.color = 'var(--accent-2)';
    status.textContent = 'Enter a valid Kenyan phone number.';
    return;
  }
  simulateMpesaPayment(phone, total).then(res => {
    if (res.success) {
      status.style.color = 'var(--accent)';
      status.innerHTML = `Payment received. Receipt <strong>${res.receipt}</strong>. Thank you!`;
      localStorage.removeItem(storageKeys.cart);
      updateCartCount();
      renderCart();
      renderCheckout();
      window.location.hash = 'home';
    } else {
      status.style.color = 'var(--accent-2)';
      status.textContent = 'Payment failed. Try again.';
    }
  });
}

function bindUI() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-btn');
    if (addBtn) {
      const id = addBtn.getAttribute('data-id');
      addToCart(id);
    }

    const qtyInc = e.target.closest('.qty-inc');
    if (qtyInc) updateLineQty(qtyInc.getAttribute('data-id'), +1);

    const qtyDec = e.target.closest('.qty-dec');
    if (qtyDec) updateLineQty(qtyDec.getAttribute('data-id'), -1);

    const removeBtn = e.target.closest('.remove-line');
    if (removeBtn) removeLine(removeBtn.getAttribute('data-id'));

    const cartBtn = e.target.closest('#cartButton');
    if (cartBtn) { renderCart(); openCart(); }

    const closeBtn = e.target.closest('#closeCart');
    if (closeBtn) closeCart();
  });

  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const sort = document.getElementById('sortSelect').value;
    renderProducts({ query: e.target.value, sort });
  });

  document.getElementById('sortSelect')?.addEventListener('change', (e) => {
    const query = document.getElementById('searchInput').value;
    renderProducts({ query, sort: e.target.value });
  });

  document.getElementById('mpesaForm')?.addEventListener('submit', handleMpesaSubmit);
}

function setupRevealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function setupTheme() {
  const saved = localStorage.getItem(storageKeys.theme);
  if (saved === 'light') document.documentElement.dataset.theme = 'light';
  const btn = document.getElementById('themeToggle');
  btn?.addEventListener('click', () => {
    const isLight = document.documentElement.dataset.theme === 'light';
    document.documentElement.dataset.theme = isLight ? '' : 'light';
    localStorage.setItem(storageKeys.theme, isLight ? 'dark' : 'light');
  });
}

(function main() {
  setYear();
  renderCategories();
  renderProducts();
  updateCartCount();
  renderCheckout();
  bindUI();
  setupRevealOnScroll();
  setupTheme();
})();