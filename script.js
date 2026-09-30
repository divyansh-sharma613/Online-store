// Products ka data. Naya product jodna ho to ek aur line likh do
const PRODUCTS = [
  { id: 1, name: 'Wireless Earbuds',  category: 'Audio',       price: 2499, emoji: '🎧' },
  { id: 2, name: 'Bluetooth Speaker', category: 'Audio',       price: 1899, emoji: '🔊' },
  { id: 3, name: 'Smart Watch',       category: 'Wearables',   price: 3999, emoji: '⌚' },
  { id: 4, name: 'Fitness Band',      category: 'Wearables',   price: 1799, emoji: '📿' },
  { id: 5, name: 'Power Bank',        category: 'Accessories', price: 1299, emoji: '🔋' },
  { id: 6, name: 'Phone Case',        category: 'Accessories', price: 499,  emoji: '📱' },
  { id: 7, name: 'USB-C Cable',       category: 'Accessories', price: 299,  emoji: '🔌' },
  { id: 8, name: 'Laptop Sleeve',     category: 'Accessories', price: 899,  emoji: '💼' }
];

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Accessories'];

const tabs = document.getElementById('tabs');
const grid = document.getElementById('grid');
const cartBox = document.getElementById('cartBox');
const cartCount = document.getElementById('cartCount');

// Cart: { productId: quantity }. Page refresh karne par bhi cart bacha rehta hai
let cart = {};
try { cart = JSON.parse(localStorage.getItem('urbanCart')) || {}; } catch (e) { cart = {}; }

function saveCart() {
  try { localStorage.setItem('urbanCart', JSON.stringify(cart)); } catch (e) {}
}

// Products dikhao (category ke hisaab se)
function showProducts(category) {
  tabs.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    if (cat === category) btn.className = 'on';
    btn.addEventListener('click', () => showProducts(cat));
    tabs.appendChild(btn);
  });

  grid.innerHTML = PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .map(p => `
      <div class="item">
        <div class="img">${p.emoji}</div>
        <div class="body">
          <h3>${p.name}</h3>
          <p>${p.category}</p>
          <div class="price">₹${p.price}<button data-add="${p.id}">Add</button></div>
        </div>
      </div>`)
    .join('');
}

// "Add" button dabane par cart mein jodo
grid.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (btn) changeQty(+btn.dataset.add, 1);
});

// Quantity badhao ya ghatao (0 hone par item hat jata hai)
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

// Cart dikhao
function renderCart() {
  const ids = Object.keys(cart);
  cartCount.textContent = ids.reduce((sum, id) => sum + cart[id], 0);

  if (!ids.length) {
    cartBox.innerHTML = 'Your cart is empty. Add a product above.';
    return;
  }

  let total = 0;
  const rows = ids.map(id => {
    const p = PRODUCTS.find(x => x.id === +id);
    const line = p.price * cart[id];
    total += line;
    return `
      <div class="row">
        <span>${p.emoji} ${p.name}</span>
        <span class="qty">
          <button data-id="${id}" data-delta="-1" aria-label="Decrease">−</button>
          ${cart[id]}
          <button data-id="${id}" data-delta="1" aria-label="Increase">+</button>
          ₹${line}
        </span>
      </div>`;
  }).join('');

  cartBox.innerHTML = rows +
    `<div class="row total"><b>Total</b><b>₹${total}</b></div>
     <button class="btn" id="checkout">Checkout</button>`;
}

// Cart ke andar ke buttons (plus, minus, checkout)
cartBox.addEventListener('click', e => {
  const qtyBtn = e.target.closest('[data-delta]');
  if (qtyBtn) return changeQty(+qtyBtn.dataset.id, +qtyBtn.dataset.delta);

  if (e.target.id === 'checkout') {
    cart = {};
    saveCart();
    renderCart();
    cartBox.innerHTML = '<p class="done">Order placed! Thank you for shopping.</p>';
  }
});

// Page khulte hi shuru karo
showProducts('All');
renderCart();