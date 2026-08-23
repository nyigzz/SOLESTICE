const products = [
  { id: 1, name: 'New Balance 550', category: 'lifestyle', color: 'coral', shoe: 'shoe-white', image: 'daily.jpg', meta: 'White / light gray', price: 2850 },
  { id: 2, name: 'Adizero EVO SL', category: 'running', color: 'blue', shoe: 'shoe-navy', image: 'pace.jpg', meta: 'White / black / gray', price: 5700 },
  { id: 3, name: "Jordan 1 Low OG 'Travis Scott Medium Olive'", category: 'collabs', color: 'yellow', shoe: 'shoe-yellow', image: 'court.jpg', meta: 'Medium olive / white / black', price: 39900 },
  { id: 4, name: "Nike Air Force 1 Low 'White'", category: 'lifestyle', color: 'sage', shoe: 'shoe-green', image: 'local.jpg', meta: 'Triple white', price: 4560 },
  { id: 5, name: 'Asics Gel-Kayano 14', category: 'running', color: 'ink', shoe: 'shoe-black', image: 'night-run.jpg', meta: 'Black / silver', price: 6840 },
  { id: 6, name: 'Jordan x Off-White The 10: Air Jordan 1 "Chicago"', category: 'collabs', color: 'pink', shoe: 'shoe-red', image: 'studio.jpg', meta: 'Chicago red / white / black', price: 256500 },
  { id: 7, name: "Nike Kobe 6 Protro 'Reverse Grinch'", category: 'sports', color: 'blue', shoe: 'shoe-black', image: 'motion.jpg', meta: 'Bright crimson / black / green', price: 22800 }
];

let activeFilter = 'all';
let searchTerm = '';
let cart = [];

const productGrid = document.querySelector('#productGrid');
const emptyState = document.querySelector('#emptyState');
const resultsLabel = document.querySelector('#resultsLabel');
const cartDrawer = document.querySelector('#cartDrawer');
const drawerBackdrop = document.querySelector('#drawerBackdrop');
const cartItems = document.querySelector('#cartItems');
const cartFooter = document.querySelector('#cartFooter');
const toast = document.querySelector('#toast');

function formatPrice(price) {
  return `₱${price.toLocaleString('en-PH')}`;
}

function visibleProducts() {
  return products
    .filter(product => activeFilter === 'all' || product.category === activeFilter)
    .filter(product => `${product.name} ${product.meta} ${product.category}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const sort = document.querySelector('#sortSelect').value;
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return a.id - b.id;
    });
}

function renderProducts() {
  const visible = visibleProducts();
  resultsLabel.textContent = `${visible.length} ${visible.length === 1 ? 'style' : 'styles'}`;
  emptyState.hidden = visible.length > 0;
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image ${product.color}">
        ${product.category === 'collabs' ? '<span class="stock-badge">Low stock</span>' : ''}
        <button class="favorite-button" type="button" data-favorite="${product.id}" aria-label="Add ${product.name} to wishlist" aria-pressed="false">♡</button>
        <img class="product-photo ${[2, 4, 5].includes(product.id) ? 'crop-photo' : ''} ${[4, 5].includes(product.id) ? 'flip-photo' : ''}" src="images/${product.image}" alt="${product.name} sneaker in ${product.meta}">
      </div>
      <div class="product-info"><div><h3>${product.name}</h3><span class="product-meta">${product.meta}</span></div><span class="price">${formatPrice(product.price)}</span></div>
      <div class="product-actions"><label class="sr-only" for="size-${product.id}">Choose a size for ${product.name}</label><select class="size-select" id="size-${product.id}"><option value="">Choose size</option><option>US 7</option><option>US 8</option><option>US 9</option><option>US 10</option><option>US 11</option></select><button class="add-button" type="button" data-add="${product.id}">Add to bag</button></div>
    </article>`).join('');
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  drawerBackdrop.hidden = false;
  document.querySelector('#cartToggle').setAttribute('aria-expanded', 'true');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  drawerBackdrop.hidden = true;
  document.querySelector('#cartToggle').setAttribute('aria-expanded', 'false');
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}
function renderCart() {
  const count = cart.length;
  document.querySelector('#cartCount').textContent = count;
  if (!count) {
    cartItems.innerHTML = '<div class="cart-empty"><span>○</span><p>Your bag is ready when you are.</p><a href="#shop" id="startShopping">Browse sneakers</a></div>';
    cartFooter.hidden = true;
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-item"><div class="cart-item-image ${item.color}"><div class="mini-shoe ${item.shoe}"></div></div><div><h3>${item.name}</h3><p>${item.size} · ${formatPrice(item.price)}</p></div><button class="remove-item" type="button" data-remove="${index}" aria-label="Remove ${item.name}">×</button></div>`).join('');
  document.querySelector('#subtotal').textContent = formatPrice(cart.reduce((sum, item) => sum + item.price, 0));
  cartFooter.hidden = false;
}

productGrid.addEventListener('click', event => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const isActive = favorite.classList.toggle('active');
    favorite.textContent = isActive ? '♥' : '♡';
    favorite.setAttribute('aria-pressed', String(isActive));
    favorite.setAttribute('aria-label', `${isActive ? 'Remove' : 'Add'} ${products.find(product => product.id === Number(favorite.dataset.favorite)).name} ${isActive ? 'from' : 'to'} wishlist`);
    showToast(isActive ? 'Saved to your wishlist' : 'Removed from your wishlist');
  }
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    const product = products.find(item => item.id === Number(addButton.dataset.add));
    const size = document.querySelector(`#size-${product.id}`).value;
    if (!size) { showToast('Choose a size before adding your pair'); return; }
    cart.push({ ...product, size });
    renderCart();
    showToast(`${product.name} added to your bag`);
  }
});

cartItems.addEventListener('click', event => {
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) { cart.splice(Number(removeButton.dataset.remove), 1); renderCart(); showToast('Item removed from your bag'); }
  if (event.target.closest('#startShopping')) closeCart();
});
document.querySelector('#cartToggle').addEventListener('click', openCart);
document.querySelector('#cartClose').addEventListener('click', closeCart);
drawerBackdrop.addEventListener('click', closeCart);
document.querySelector('#checkoutButton').addEventListener('click', () => showToast('Checkout is ready for your details'));
document.querySelector('#searchToggle').addEventListener('click', () => { const bar = document.querySelector('#searchBar'); bar.hidden = !bar.hidden; document.querySelector('#searchToggle').setAttribute('aria-expanded', String(!bar.hidden)); if (!bar.hidden) document.querySelector('#searchInput').focus(); });
document.querySelector('#searchInput').addEventListener('input', event => { searchTerm = event.target.value; renderProducts(); });
document.querySelector('#clearSearch').addEventListener('click', () => { document.querySelector('#searchInput').value = ''; searchTerm = ''; renderProducts(); document.querySelector('#searchInput').focus(); });
document.querySelector('#sortSelect').addEventListener('change', renderProducts);
document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => { document.querySelector('.filter-button.active').classList.remove('active'); button.classList.add('active'); activeFilter = button.dataset.filter; renderProducts(); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });

renderProducts();
renderCart();
