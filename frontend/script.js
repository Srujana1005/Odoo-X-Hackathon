
/* ---------- Helpers ---------- */
function picsum(seed){ return `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`; }
function fallbackDataURI(label){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#1e3c72'/><stop offset='1' stop-color='#2a5298'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      fill='#ffffff' font-family='Segoe UI, Arial' font-size='36' font-weight='700'>
      ${label.replace(/</g,'&lt;')}
    </text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* ---------- Navigation ---------- */
const sections = document.querySelectorAll('.section');
const menuLinks = document.querySelectorAll('.menu-bar a[data-section]');
menuLinks.forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    sections.forEach(sec=>sec.classList.remove('active'));
    document.getElementById(link.dataset.section).classList.add('active');
    menuLinks.forEach(l=>l.classList.remove('active'));
    link.classList.add('active');
  });
});
function showSection(section){ sections.forEach(s=>s.classList.remove('active')); section.classList.add('active'); }

/* ---------- Settings Dropdown ---------- */
const settings = document.querySelector('.settings');
settings.addEventListener('click', (e)=>{
  const trigger = e.target.closest('.settings > a');
  if(trigger){ e.preventDefault(); settings.classList.toggle('open'); }
});
document.addEventListener('click', (e)=>{
  if(!settings.contains(e.target)) settings.classList.remove('open');
});
document.querySelectorAll('.dropdown .keep-open').forEach(a=>{
  a.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); });
});

/* ---------- Auth ---------- */
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
loginBtn.addEventListener('click', ()=> showSection(loginSection));
signupBtn.addEventListener('click', ()=> showSection(signupSection));
document.getElementById('show-signup').addEventListener('click', ()=> showSection(signupSection));
document.getElementById('show-login').addEventListener('click', ()=> showSection(loginSection));

/* ---------- Data ---------- */
let products = [
  {name:"Blue Shirt", price:500, img:picsum("ecofinds-shirt"), category:"Clothing"},
  {name:"Sunglasses", price:1200, img:picsum("ecofinds-sunglasses"), category:"Accessories"},
  {name:"Table Lamp", price:800, img:picsum("ecofinds-lamp"), category:"Household Essentials"},
  {name:"Face Cream", price:300, img:picsum("ecofinds-cream"), category:"Beauty & Personal Care"},
];
let cart = [];
let wishlist = [];
let orders = [];

/* ---------- Render Products ---------- */
function renderProducts(){
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  products.forEach((p,i)=>{
    const card = document.createElement('div');
    card.className = 'product-card';

    const imgEl = document.createElement('img');
    imgEl.alt = p.name;
    imgEl.src = p.img;
    imgEl.onerror = ()=>{ imgEl.src = fallbackDataURI(p.category); };

    const h3 = document.createElement('h3'); h3.textContent = p.name;
    const price = document.createElement('p'); price.textContent = `₹${p.price}`;

    // Add to Cart → go to Cart
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Cart';
    addBtn.addEventListener('click', ()=>{
      cart.push(p);
      renderCart();
      showSection(document.getElementById('cart'));
    });

    // Add to Wishlist → go to Wishlist
    const wishBtn = document.createElement('button');
    wishBtn.textContent = 'Add to Wishlist';
    wishBtn.style.marginTop = '6px';
    wishBtn.style.background = '#ff6f61';
    wishBtn.style.color = 'white';
    wishBtn.addEventListener('click', ()=>{
      if(!wishlist.includes(p)){ wishlist.push(p); }
      renderWishlist();
      showSection(document.getElementById('wishlist'));
    });

    // Buy Now → go to Orders
    const buyNowBtn = document.createElement('button');
    buyNowBtn.textContent = 'Buy Now';
    buyNowBtn.style.marginTop = '6px';
    buyNowBtn.style.background = '#00c853';
    buyNowBtn.style.color = 'white';
    buyNowBtn.addEventListener('click', ()=>{
      orders.push(p);
      renderOrders();
      showSection(document.getElementById('orders'));
    });

    card.appendChild(imgEl);
    card.appendChild(h3);
    card.appendChild(price);
    card.appendChild(addBtn);
    card.appendChild(wishBtn);
    card.appendChild(buyNowBtn);

    container.appendChild(card);
  });
}

/* ---------- Render Cart ---------- */
function renderCart(){
  const cartItems = document.getElementById('cart-items');
  const totalP = document.getElementById('cart-total');
  cartItems.innerHTML='';
  let total=0;
  if(!cart.length){ totalP.textContent=''; cartItems.innerHTML='<div class="cart-card"><p>Cart is empty</p></div>'; return; }

  cart.forEach((c,idx)=>{
    total+=c.price;
    const item = document.createElement('div'); item.className='cart-card';

    const h = document.createElement('h3'); h.textContent=c.name;
    const p = document.createElement('p'); p.textContent=`₹${c.price}`;

    const rem = document.createElement('button');
    rem.textContent='Remove';
    rem.addEventListener('click', ()=>{ cart.splice(idx,1); renderCart(); });

    item.appendChild(h); item.appendChild(p); item.appendChild(rem);
    cartItems.appendChild(item);
  });
  totalP.textContent = `Total: ₹${total}`;
}

/* ---------- Render Wishlist ---------- */
function renderWishlist(){
  const container = document.getElementById('wishlist-items');
  container.innerHTML = '';
  if(!wishlist.length){
    container.innerHTML = '<div class="wishlist-card"><p>Wishlist is empty</p></div>';
    return;
  }

  wishlist.forEach((item, idx)=>{
    const card = document.createElement('div');
    card.className = 'wishlist-card';

    const h3 = document.createElement('h3'); h3.textContent = item.name;
    const price = document.createElement('p'); price.textContent = `₹${item.price}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', ()=>{
      wishlist.splice(idx,1);
      renderWishlist();
    });

    card.appendChild(h3);
    card.appendChild(price);
    card.appendChild(removeBtn);

    container.appendChild(card);
  });
}

/* ---------- Render Orders ---------- */
function renderOrders(){
  const container = document.getElementById('orders-list');
  if(!orders.length){
    container.textContent = 'No orders yet.';
    return;
  }
  container.innerHTML = '';
  orders.forEach(o=>{
    const div = document.createElement('div');
    div.textContent = `${o.name} - ₹${o.price}`;
    container.appendChild(div);
  });
}

/* ---------- Init ---------- */
renderProducts();
renderCart();
renderWishlist();
renderOrders();

/* ---------- Sell Product + Preview ---------- */
const sellImgInput = document.getElementById('sell-img');
const previewImg = document.getElementById('preview-img');
previewImg.src = fallbackDataURI('Preview'); 

sellImgInput.addEventListener('input', ()=>{
  const url = sellImgInput.value.trim();
  if(!url){ previewImg.src = fallbackDataURI('Preview'); return; }
  previewImg.src = url;
  previewImg.onerror = ()=>{ previewImg.src = fallbackDataURI('Preview'); };
});

document.getElementById('sell-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('sell-name').value.trim();
  const price = parseInt(document.getElementById('sell-price').value,10);
  const url = document.getElementById('sell-img').value.trim();
  const category = document.getElementById('sell-category').value;

  if(!name || !price || !category){ return; }
  const img = url || picsum(`${name}-${category}`);

  products.push({name,price,img,category});
  e.target.reset();
  previewImg.src = fallbackDataURI('Preview');
  renderProducts();
  showSection(document.getElementById('home'));
});

/* ---------- Dummy Auth ---------- */
document.getElementById('login-form').addEventListener('submit', (e)=>{ e.preventDefault(); alert('Logged in!'); showSection(document.getElementById('home')); });
document.getElementById('signup-form').addEventListener('submit', (e)=>{ e.preventDefault(); alert('Signed up!'); showSection(document.getElementById('home')); });
