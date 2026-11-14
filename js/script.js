// JS chỉ dùng cho: lọc danh mục, thêm/xóa sản phẩm, tính lại tóm tắt, kiểm tra mã giảm giá
'use strict';

const STUDENT_RATE = 0.01;      // ưu đãi HSSV 1%
const STUDENT_MAX = 500000;     // tối đa 500.000đ
const SHIPPING = 0;             // phí vận chuyển (minh họa)
const COUPONS = { GIAM200K: 200000 }; // mã minh họa
const STORAGE_KEY = 'gearvn-demo-cart';

// Dữ liệu sản phẩm dùng chung cho 2 trang
const PRODUCTS = {
  'acer-nitro': { name: 'Laptop gaming Acer Nitro ProPanel ANV16-I12-53VH', img: 'images/product-demo.jpg', price: 27290000, listPrice: 36990000, gifts: 3 },
  'man-hinh':   { name: 'Màn hình gaming 24" IPS 144Hz', img: 'images/man-hinh.svg', price: 3490000, listPrice: 3490000, gifts: 0 },
  'ban-phim':   { name: 'Bàn phím cơ không dây 75%', img: 'images/ban-phim.svg', price: 1290000, listPrice: 1290000, gifts: 0 },
  'tai-nghe':   { name: 'Tai nghe gaming 7.1', img: 'images/tai-nghe.svg', price: 890000, listPrice: 890000, gifts: 0 },
  'chuot':      { name: 'Chuột gaming có dây 26.000 DPI', img: 'images/chuot.svg', price: 590000, listPrice: 590000, gifts: 0 },
  'lot-chuot':  { name: 'Lót chuột cỡ lớn XL', img: 'images/lot-chuot.svg', price: 250000, listPrice: 250000, gifts: 0 }
};

const $ = (id) => document.getElementById(id);
const formatVND = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';

// Giỏ hàng lưu trong trình duyệt để giữ khi chuyển trang (mặc định: 1 laptop)
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const entries = Object.entries(JSON.parse(raw)).filter(([id, q]) => PRODUCTS[id] && q > 0);
      return new Map(entries);
    }
  } catch (e) { /* không đọc được thì dùng mặc định */ }
  return new Map([['acer-nitro', 1]]);
}
function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(cart))); } catch (e) { /* bỏ qua */ }
}

const cart = loadCart();
let couponCode = '';

function cartCount() {
  let n = 0;
  cart.forEach((q) => { n += q; });
  return n;
}
function renderBadge() {
  const n = cartCount();
  $('cart-badge').textContent = n;
  $('cart-badge').closest('a').setAttribute('aria-label', 'Xem giỏ hàng (' + n + ' sản phẩm)');
}

// Thông báo ngắn, tự ẩn sau 3 giây
let toastTimer;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.textContent = ''; }, 3000);
}

/* ===== Trang sản phẩm (index.html) ===== */
function initShop() {
  // Nút "Thêm vào giỏ"
  document.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.closest('.product-card').dataset.id;
      cart.set(id, (cart.get(id) || 0) + 1);
      saveCart();
      renderBadge();
      toast('Đã thêm "' + PRODUCTS[id].name + '" vào giỏ (số lượng: ' + cart.get(id) + ').');
    });
  });

  // Danh mục: lọc thẻ sản phẩm theo data-category
  const categoryBtns = document.querySelectorAll('.category-bar__btn');
  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      let shown = 0;
      document.querySelectorAll('.product-card').forEach((card) => {
        card.hidden = cat !== 'all' && card.dataset.category !== cat;
        if (!card.hidden) shown++;
      });
      categoryBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      $('products-title').textContent = cat === 'all' ? 'Sản phẩm nổi bật' : btn.textContent;
      $('products-count').textContent = shown + ' sản phẩm';
    });
  });
}

/* ===== Trang giỏ hàng (gio-hang.html) ===== */
function renderItems() {
  const list = $('cart-items');
  const tpl = $('cart-item-tpl');
  list.replaceChildren();

  cart.forEach((qty, id) => {
    const p = PRODUCTS[id];
    const li = tpl.content.firstElementChild.cloneNode(true);
    li.querySelector('.cart-item__thumb').src = p.img;
    li.querySelector('.cart-item__name').textContent = p.name;
    li.querySelector('.price--new').textContent = formatVND(p.price);
    const old = li.querySelector('.price--old');
    if (p.listPrice > p.price) old.textContent = formatVND(p.listPrice);
    else old.remove();

    li.querySelector('.qty').setAttribute('aria-label', 'Số lượng ' + p.name);
    li.querySelector('.qty__value').textContent = qty;
    const dec = li.querySelector('[data-dec]');
    dec.disabled = qty <= 1;
    dec.setAttribute('aria-label', 'Giảm số lượng');
    dec.addEventListener('click', () => changeQty(id, -1, '[data-dec]'));
    const inc = li.querySelector('[data-inc]');
    inc.setAttribute('aria-label', 'Tăng số lượng');
    inc.addEventListener('click', () => changeQty(id, 1, '[data-inc]'));

    const removeBtn = li.querySelector('[data-remove]');
    removeBtn.setAttribute('aria-label', 'Xóa ' + p.name + ' khỏi giỏ');
    removeBtn.addEventListener('click', () => removeItem(id));
    li.dataset.id = id;
    list.append(li);
  });
}

// Tính lại các khoản tiền
function renderTotals() {
  let count = 0, listTotal = 0, saleTotal = 0, gifts = 0;
  cart.forEach((qty, id) => {
    const p = PRODUCTS[id];
    count += qty;
    listTotal += p.listPrice * qty;
    saleTotal += p.price * qty;
    gifts += p.gifts * qty;
  });

  const productDiscount = listTotal - saleTotal;
  const student = Math.min(Math.round(saleTotal * STUDENT_RATE), STUDENT_MAX);
  const coupon = couponCode ? Math.min(COUPONS[couponCode], saleTotal - student) : 0;
  const subtotal = listTotal - productDiscount - student - coupon;
  const total = subtotal + SHIPPING;
  const saving = productDiscount + student + coupon;

  $('cart-count').textContent = count + ' sản phẩm' + (gifts ? ' + ' + gifts + ' quà tặng' : '');
  $('cart-empty').hidden = count > 0;
  $('cart-gifts').hidden = gifts === 0;
  $('gift-count').textContent = gifts;

  $('list-total').textContent = formatVND(listTotal);
  $('product-discount-row').hidden = productDiscount === 0;
  $('product-discount').textContent = '−' + formatVND(productDiscount);
  $('student-discount').textContent = '−' + formatVND(student);
  $('coupon-row').hidden = !couponCode;
  $('coupon-row-code').textContent = couponCode ? '(' + couponCode + ')' : '';
  $('coupon-row-amount').textContent = '−' + formatVND(coupon);
  $('subtotal').textContent = formatVND(subtotal);
  $('total').textContent = formatVND(total);
  $('saving').textContent = formatVND(saving);
  $('order-btn').disabled = count === 0;
}

function renderCart() {
  renderItems();
  renderTotals();
  renderBadge();
}

function changeQty(id, delta, focusSel) {
  const next = cart.get(id) + delta;
  if (next < 1) return;
  cart.set(id, next);
  saveCart();
  renderCart();
  // giữ focus trên nút vừa bấm sau khi vẽ lại
  const btn = document.querySelector('.cart-item[data-id="' + id + '"] ' + focusSel);
  if (btn && !btn.disabled) btn.focus();
  else document.querySelector('.cart-item[data-id="' + id + '"] [data-inc]').focus();
}

function removeItem(id) {
  const name = PRODUCTS[id].name;
  cart.delete(id);
  if (cart.size === 0) couponCode = ''; // giỏ trống thì bỏ mã
  saveCart();
  renderCart();
  toast('Đã xóa "' + name + '" khỏi giỏ.');
  $('cart-title').focus({ preventScroll: true });
}

// Mã giảm giá: báo rõ trống / sai / đúng
function showCouponMsg(type, text) {
  const msg = $('coupon-msg');
  msg.className = 'coupon__msg coupon__msg--' + type;
  msg.textContent = (type === 'success' ? '✓ ' : '! ') + text;
  $('coupon-input').setAttribute('aria-invalid', type === 'error' ? 'true' : 'false');
}

function initCart() {
  $('coupon-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('coupon-input');
    const code = input.value.trim().toUpperCase();

    if (!code) {
      showCouponMsg('error', 'Vui lòng nhập mã giảm giá.');
    } else if (cart.size === 0) {
      showCouponMsg('error', 'Giỏ hàng đang trống, chưa thể áp dụng mã.');
    } else if (!(code in COUPONS)) {
      showCouponMsg('error', 'Mã "' + code + '" không hợp lệ hoặc đã hết hạn.');
    } else {
      couponCode = code;
      renderTotals();
      showCouponMsg('success', 'Đã áp dụng mã ' + code + ': giảm ' + formatVND(COUPONS[code]) + '.');
      return;
    }
    input.focus();
  });

  // Nút "Xác nhận đơn": không có backend nên chỉ thông báo
  $('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    toast('Trang minh họa: đơn hàng ' + $('total').textContent + ' chưa được gửi đi.');
  });

  renderCart();
}

// Chạy phần tương ứng với trang hiện tại
renderBadge();
if ($('cart-items')) initCart();
else initShop();
