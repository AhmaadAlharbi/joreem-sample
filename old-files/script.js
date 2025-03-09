// Variables globales
let cart = [];
const cartCount = document.getElementById("cartCount");
const cartNotification = document.getElementById("cartNotification");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const menuBtn = document.getElementById("menuBtn");

// تأثيرات القسم الرئيسي
function animateHero() {
  setTimeout(() => {
    document.getElementById("heroText1").style.opacity = "1";
    document.getElementById("heroText1").style.transform = "translateY(0)";

    setTimeout(() => {
      document.getElementById("heroText2").style.opacity = "1";
      document.getElementById("heroText2").style.transform = "translateY(0)";

      setTimeout(() => {
        document.getElementById("heroSubtitle").style.opacity = "1";
        document.getElementById("heroSubtitle").style.transform =
          "translateY(0)";

        setTimeout(() => {
          document.getElementById("heroButtons").style.opacity = "1";
          document.getElementById("heroButtons").style.transform =
            "translateY(0)";

          setTimeout(() => {
            document.getElementById("heroImage").style.opacity = "1";
            document.getElementById("heroImage").style.transform =
              "translateY(0)";
          }, 200);
        }, 200);
      }, 200);
    }, 200);
  }, 500);
}

// وظائف سلة التسوق
function updateCartCount() {
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalQuantity;
}

function formatPrice(price) {
  return parseFloat(price).toFixed(3);
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `${formatPrice(total)} د.ك`;
}

function showCartNotification() {
  cartNotification.classList.add("show");

  setTimeout(() => {
    cartNotification.classList.remove("show");
  }, 3000);
}

function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price: parseFloat(price),
      quantity: 1,
    });
  }

  updateCartCount();
  showCartNotification();
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartCount();
  updateCartUI();
  saveCart();
}

function updateItemQuantity(id, quantity) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartCount();
      updateCartUI();
      saveCart();
    }
  }
}

function saveCart() {
  localStorage.setItem("joreem-cart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("joreem-cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function updateCartUI() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>لا توجد منتجات في سلة التسوق</p>
            </div>
        `;
  } else {
    let html = "";

    cart.forEach((item) => {
      html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <span>${item.name.slice(-5)}</span>
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${formatPrice(
                          item.price
                        )} د.ك</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease-quantity" data-id="${
                              item.id
                            }">-</button>
                            <input type="text" class="quantity-input" value="${
                              item.quantity
                            }" readonly>
                            <button class="quantity-btn increase-quantity" data-id="${
                              item.id
                            }">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
    });

    cartItems.innerHTML = html;

    // إضافة مستمعي الأحداث
    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const item = cart.find((item) => item.id === id);
        if (item) {
          updateItemQuantity(id, item.quantity + 1);
        }
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        const item = cart.find((item) => item.id === id);
        if (item && item.quantity > 1) {
          updateItemQuantity(id, item.quantity - 1);
        }
      });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.dataset.id;
        removeFromCart(id);
      });
    });
  }

  updateCartTotal();
}

function showCartModal() {
  cartModal.classList.add("show");
  updateCartUI();
}

function hideCartModal() {
  cartModal.classList.remove("show");
}

// مستمعي الأحداث
function setupEventListeners() {
  // أزرار إضافة للعربة
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = this.dataset.price;
      addToCart(id, name, price);
    });
  });

  // زر العربة
  cartBtn.addEventListener("click", showCartModal);

  // زر إغلاق نافذة العربة
  closeCartBtn.addEventListener("click", hideCartModal);

  // إغلاق نافذة العربة عند النقر خارجها
  cartModal.addEventListener("click", function (e) {
    if (e.target === cartModal) {
      hideCartModal();
    }
  });

  // منع انتشار النقر داخل نافذة العربة
  document
    .querySelector(".cart-container")
    .addEventListener("click", function (e) {
      e.stopPropagation();
    });
}

// تحريك العناصر عند التمرير
function setupScrollAnimations() {
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "-50px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // كروت المميزات
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // كروت المنتجات
  document.querySelectorAll(".product-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // كروت آراء العملاء
  document.querySelectorAll(".testimonial-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // عناصر قسم من نحن
  document.querySelector(".about-text").style.opacity = "0";
  document.querySelector(".about-text").style.transform = "translateX(50px)";
  document.querySelector(".about-text").style.transition =
    "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(document.querySelector(".about-text"));

  document.querySelector(".about-image").style.opacity = "0";
  document.querySelector(".about-image").style.transform = "translateX(-50px)";
  document.querySelector(".about-image").style.transition =
    "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(document.querySelector(".about-image"));
}

// إضافة فئة تحريك للعناصر المرئية
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".animate").forEach((element) => {
    element.classList.add("animate");
  });
});

// تهيئة التطبيق
function initApp() {
  loadCart();
  setupEventListeners();
  animateHero();
  setupScrollAnimations();
}

// بدء التطبيق
window.addEventListener("DOMContentLoaded", initApp);
