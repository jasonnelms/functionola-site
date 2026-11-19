'use strict';
// FunctioNola: a client-only student business storefront demonstration.
// The cart uses localStorage. The checkout is entirely simulated: no data is sent,
// no payment information is requested, and the sample address is read-only.
const products = [
  {id:'maple-bar',name:'Maple Pecan',form:'Granola Bar',flavor:'maple',type:'bar',price:3.49,image:'assets/maple-bar.webp',tag:'THE COZY ONE',category:'Maple sweetness · Toasty pecan',description:'A cozy combo with the flavor of maple and pecans. Your afternoon pick-me-up has never looked so good.',details:'Warm maple-inspired sweetness and nutty pecan flavor make this single-bar concept an easy grab-and-go favorite.'},
  {id:'chocolate-bar',name:'Peanut Butter Chocolate',form:'Granola Bar',flavor:'chocolate',type:'bar',price:3.49,image:'assets/chocolate-bar.webp',tag:'THE CLASSIC DUO',category:'Nutty · Chocolatey',description:'An iconic pairing that gets the crunchy treatment. For when you want something a little more indulgent.',details:'Peanut butter meets chocolate in a rich, satisfying flavor concept designed for sweet-tooth snack breaks.'},
  {id:'maple-pouch',name:'Maple Pecan',form:'Granola Pouch',flavor:'maple',type:'pouch',price:12.99,image:'assets/maple-pouch.webp',tag:'POUR ON THE GOOD',category:'Maple sweetness · Toasty pecan',description:'All that cozy maple-pecan personality in a scoopable granola pouch.',details:'A shareable, scoopable take on the Maple Pecan concept. Snack straight from the pouch or bring some crunch to your breakfast.'},
  {id:'chocolate-pouch',name:'Peanut Butter Chocolate',form:'Granola Pouch',flavor:'chocolate',type:'pouch',price:12.99,image:'assets/chocolate-pouch.webp',tag:'MORE TO LOVE',category:'Nutty · Chocolatey',description:'Big peanut butter-chocolate energy in a pouch made for snacking and sharing.',details:'Chocolate-inspired richness and peanut butter flavor meet crunchy granola in this pouch-style concept.'}
];
const productMap = Object.fromEntries(products.map(p=>[p.id,p]));
const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const $ = selector => document.querySelector(selector);
const grid = $('#product-grid');
const cartDialog = $('#cart-dialog');
const productDialog = $('#product-dialog');
const checkoutDialog = $('#checkout-dialog');
let cart = {};
let activeProduct = null;
let selectedQty = 1;
let checkoutDetails = null;
let toastTimer;
const STORAGE_KEY='functionola_demo_cart_v1';
try {const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');if(saved&&typeof saved==='object'){for(const [id,quantity] of Object.entries(saved)){if(productMap[id]&&Number.isInteger(quantity)&&quantity>0&&quantity<=99) cart[id]=quantity;}}} catch(_) {cart={};}
const save = ()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch(_){/* Private mode works without persistence. */}};
const totalQty = ()=>Object.values(cart).reduce((a,b)=>a+b,0);
const subtotal = ()=>products.reduce((sum,p)=>sum+p.price*(cart[p.id]||0),0);
const shipping = ()=>subtotal()>=35?0:4.95;
const escapeText = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2300);}
function updateCount(){const qty=totalQty();$('#bag-count').textContent=String(qty);$('#cart-open').setAttribute('aria-label',`Open shopping bag, ${qty} ${qty===1?'item':'items'}`);$('#cart-heading-count').textContent=`(${qty})`;}
function productCard(p){return `<article class="product-card ${p.flavor}" data-product-id="${p.id}">
  <button class="product-image" type="button" data-view="${p.id}" aria-label="View details for ${p.name} ${p.form}"><span class="product-tag">${p.tag}</span><img class="${p.type==='bar'?'bar-image':''}" src="${p.image}" alt="${p.name} ${p.form} packaging concept" loading="lazy"></button>
  <div class="product-body"><p class="product-category">${p.form} · ${p.category}</p><h3>${p.name}</h3><p class="product-desc">${p.description}</p><div class="product-bottom"><div class="product-price">${money(p.price)}<small>Demo price</small></div><button class="add-button" type="button" data-add="${p.id}" aria-label="Add ${p.name} ${p.form} to bag">+</button></div></div></article>`;}
function renderProducts(filter='all'){grid.innerHTML=products.filter(p=>filter==='all'||p.type===filter).map(productCard).join('');}
function changeCart(id,delta){if(!productMap[id])return;const next=Math.min(99,Math.max(0,(cart[id]||0)+delta));if(next)cart[id]=next;else delete cart[id];save();updateCount();if(cartDialog.open)renderCart();if(checkoutDialog.open)renderCheckoutSummary();}
function addToCart(id,qty=1){changeCart(id,qty);const p=productMap[id];notify(`${qty} × ${p.name} ${p.form} added to bag`);}
function openProduct(id){const p=productMap[id];if(!p)return;activeProduct=p;selectedQty=1;$('#product-dialog-content').innerHTML=`<div class="quick-view"><div class="quick-image ${p.flavor}"><img src="${p.image}" alt="${p.name} ${p.form} packaging concept"></div><div class="quick-copy"><p class="kicker">${p.form.toUpperCase()} · ${p.tag}</p><h2>${p.name}</h2><p class="quick-desc">${p.details}</p><div class="quick-price">${money(p.price)} <small>Illustrative price</small></div><div class="quick-controls"><div class="stepper" aria-label="Product quantity"><button type="button" id="quick-minus" aria-label="Decrease quantity">−</button><span id="quick-quantity">1</span><button type="button" id="quick-plus" aria-label="Increase quantity">+</button></div><button type="button" id="quick-add" class="btn btn-dark">Add to bag <span aria-hidden="true">↗</span></button></div><p class="quick-footnote">Student product concept. Prices and product details are illustrative. No real purchases.</p></div></div>`;productDialog.showModal();}
function renderCart(){const items=products.filter(p=>cart[p.id]);const target=$('#cart-items');const bottom=$('#cart-bottom');if(items.length===0){target.innerHTML=`<div class="cart-empty"><span class="empty-art" aria-hidden="true">♡</span><h3>Feeling a little empty?</h3><p>Good news: your next favorite crunch is just a click away.</p><button class="btn btn-dark" type="button" id="empty-shop">Shop the bars ↗</button></div>`;bottom.innerHTML='';return;}
 target.innerHTML=items.map(p=>`<div class="cart-row"><div class="cart-thumb ${p.flavor}"><img src="${p.image}" alt=""></div><div class="cart-item-main"><h3>${p.name}</h3><p>${p.form} · Demo item</p><div class="cart-item-price">${money(p.price*cart[p.id])}</div><div class="cart-item-actions"><div class="stepper" aria-label="Quantity for ${p.name} ${p.form}"><button type="button" data-decrease="${p.id}" aria-label="Decrease quantity">−</button><span>${cart[p.id]}</span><button type="button" data-increase="${p.id}" aria-label="Increase quantity">+</button></div><button type="button" class="remove-item" data-remove="${p.id}">Remove</button></div></div></div>`).join('');
 const remaining=Math.max(0,35-subtotal());bottom.innerHTML=`<div class="cart-bottom-row"><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div class="ship-progress" aria-label="Progress toward sample free shipping"><span style="width:${Math.min(100,subtotal()/35*100)}%"></span></div><p>${remaining>0?`Add ${money(remaining)} more to unlock illustrative free shipping.`:'Illustrative free shipping unlocked!'}</p><button class="btn btn-dark" id="start-checkout" type="button">Checkout <span>↗</span></button><p>Demo checkout: no real payment, shipping, or order processing.</p>`;
}
function openCart(){renderCart();cartDialog.showModal();}
function renderCheckoutSummary(){const items=products.filter(p=>cart[p.id]);$('#checkout-summary').innerHTML=`<h3>Your order</h3>${items.map(p=>`<div class="checkout-line"><img src="${p.image}" alt=""><span>${p.name}<small>${p.form} · Qty ${cart[p.id]}</small></span><strong>${money(p.price*cart[p.id])}</strong></div>`).join('')}<div class="checkout-totals"><div><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div><span>Demo shipping</span><strong>${shipping()===0?'FREE':money(shipping())}</strong></div><div class="final-total"><span>Demo total</span><strong>${money(subtotal()+shipping())}</strong></div></div><p class="shipping-hint">All prices and shipping examples are fictional. Taxes are not calculated and no payment is collected.</p>`;}
function renderCheckoutShipping(){$('#checkout-main').innerHTML=`<span class="demo-pill">INTERACTIVE CHECKOUT DEMO</span><h2>Where would it <em>go?</em></h2><p class="checkout-explainer">This sample checkout displays <strong>fictional, read-only shipping details</strong>. You cannot enter personal information, and nothing is submitted to a server.</p><form id="shipping-form"><div class="form-row"><div class="form-field"><label for="first-name">First name</label><input id="first-name" name="first" required autocomplete="off" value="Alex" readonly aria-readonly="true"></div><div class="form-field"><label for="last-name">Last name</label><input id="last-name" name="last" required autocomplete="off" value="Example" readonly aria-readonly="true"></div></div><div class="form-field"><label for="email">Demo email</label><input type="email" id="email" name="email" required autocomplete="off" value="alex@example.com" readonly aria-readonly="true"></div><div class="form-field"><label for="address">Address</label><input id="address" name="address" required autocomplete="off" value="123 Pretend Lane" readonly aria-readonly="true"></div><div class="form-row"><div class="form-field"><label for="city">City</label><input id="city" name="city" required autocomplete="off" value="Exampletown" readonly aria-readonly="true"></div><div class="form-field"><label for="state">State / region</label><input id="state" name="state" required autocomplete="off" value="TN" readonly aria-readonly="true"></div></div><div class="form-field"><label for="zip">ZIP code</label><input id="zip" name="zip" required autocomplete="off" value="00000" readonly aria-readonly="true"></div><button class="btn btn-dark checkout-cta" type="submit">Review demo order <span aria-hidden="true">↗</span></button></form>`;}
function checkoutReview(){if(!checkoutDetails)return;const d=checkoutDetails;$('#checkout-main').innerHTML=`<span class="demo-pill">FINAL REVIEW · NO PAYMENT</span><h2>One last <em>look.</em></h2><p class="checkout-explainer">Here's what your example order would look like. Nothing will be purchased or shipped.</p><h3>Sample shipping address</h3><p class="review-address">${escapeText(d.first)} ${escapeText(d.last)}\n${escapeText(d.address)}\n${escapeText(d.city)}, ${escapeText(d.state)} ${escapeText(d.zip)}\n${escapeText(d.email)}</p><h3>Payment method</h3><div class="fake-payment"><div class="card-icon">DEMO</div><div><strong>No payment required</strong><span>This mock checkout never charges a card.</span></div></div><button class="btn btn-dark checkout-cta" type="button" id="place-demo-order">Place demo order <span aria-hidden="true">↗</span></button><button class="back-button" type="button" id="back-to-shipping">← Edit sample details</button>`;}
function orderSuccess(){const demoOrder=`FN-DEMO-${String(Date.now()).slice(-6)}`;cart={};save();updateCount();renderCheckoutSummary();checkoutDetails=null;$('#checkout-main').innerHTML=`<div class="success-panel"><div class="success-icon" aria-hidden="true">✓</div><span class="demo-pill">SUCCESSFUL SIMULATION</span><h2>You've got<br><em>great taste.</em></h2><p>Your mock order <strong>${demoOrder}</strong> is complete! This is only a student-project demonstration. <strong>No payment was made, no customer details were saved, and no products will be shipped.</strong></p><button class="btn btn-dark" id="finish-checkout" type="button">Keep exploring <span aria-hidden="true">↗</span></button></div>`;$('#checkout-summary').innerHTML=`<h3>Demo complete</h3><p>This was a sample shopping experience, not a real transaction.</p>`;}
function openCheckout(){if(!totalQty())return;cartDialog.close();checkoutDetails=null;renderCheckoutShipping();renderCheckoutSummary();checkoutDialog.showModal();}
function closeDialog(id){const dialog=document.getElementById(id);if(dialog?.open)dialog.close();if(id==='checkout-dialog')checkoutDetails=null;}
// The entire site works from static files, including nested GitHub Pages paths.
renderProducts();updateCount();$('#year').textContent=new Date().getFullYear();
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 if(el.matches('[data-add]'))addToCart(el.dataset.add);
 if(el.matches('[data-view]'))openProduct(el.dataset.view);
 if(el.matches('[data-close]'))closeDialog(el.dataset.close);
 if(el.id==='cart-open')openCart();
 if(el.id==='quick-minus'){selectedQty=Math.max(1,selectedQty-1);$('#quick-quantity').textContent=selectedQty;}
 if(el.id==='quick-plus'){selectedQty=Math.min(99,selectedQty+1);$('#quick-quantity').textContent=selectedQty;}
 if(el.id==='quick-add'&&activeProduct){addToCart(activeProduct.id,selectedQty);closeDialog('product-dialog');openCart();}
 if(el.dataset.increase)changeCart(el.dataset.increase,1);
 if(el.dataset.decrease)changeCart(el.dataset.decrease,-1);
 if(el.dataset.remove){delete cart[el.dataset.remove];save();updateCount();renderCart();}
 if(el.id==='empty-shop'){closeDialog('cart-dialog');$('#shop').scrollIntoView({behavior:'smooth'});}
 if(el.id==='start-checkout')openCheckout();
 if(el.id==='place-demo-order')orderSuccess();
 if(el.id==='back-to-shipping')renderCheckoutShipping();
 if(el.id==='finish-checkout'){closeDialog('checkout-dialog');$('#shop').scrollIntoView({behavior:'smooth'});}
 if(el.id==='dismiss-demo')$('#demo-banner').remove();
 if(el.id==='menu-toggle'){const nav=$('#site-nav');const next=!nav.classList.contains('open');nav.classList.toggle('open',next);el.setAttribute('aria-expanded',String(next));el.setAttribute('aria-label',next?'Close menu':'Open menu');}
 if(el.closest('.navigation')&&el.tagName==='A'){$('#site-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}
 if(el.matches('button.filter')){document.querySelectorAll('.filter').forEach(button=>{const selected=button===el;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});renderProducts(el.dataset.filter);}
});
document.addEventListener('submit',event=>{if(event.target.id==='shipping-form'){event.preventDefault();checkoutDetails={first:'Alex',last:'Example',email:'alex@example.com',address:'123 Pretend Lane',city:'Exampletown',state:'TN',zip:'00000'};checkoutReview();}});
// Native <dialog> handles keyboard focus and Escape key without an external library.
checkoutDialog.addEventListener('close',()=>{checkoutDetails=null;});
