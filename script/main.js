class Product {
  constructor(title, price, imgUrl, whereUse, colours, numbers) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.whereUse = whereUse;
    this.colours = colours;
    this.numbers = numbers;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.value = attrValue;
    this.name = attrName;
  }
}

class Component {
  constructor(renderHookId) {
    this.hookId = renderHookId;
  }

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ProductItem extends Component {
  constructor(product, renderHookId, products, index) {
    super(renderHookId);
    this.product = product;
    this.isFavorited = false;
    this.index = index;
    this.products = products;
  }

  addToCart() {
    App.cart.addProductToCart(this.product);
    App.cart.updateCartNotificationCount();
  }

  toggleFavorite() {
    const favIcon = document.getElementById(`fav-icon-${this.index}`);
    const productElement = document.getElementById(`store-list${this.index}`);
    const existingFavorites = document.querySelector(".favorites-section");

    if (App.fav.isProductFavorited(this.product)) {
      favIcon.classList.remove("fa-solid");
      favIcon.classList.add("fa-regular");
      App.fav.removeFavoriteProduct(this.product);
      if (document.querySelector("#fav-list-app")) {
        if (productElement) productElement.remove();
        if (existingFavorites) existingFavorites.remove();
        new FavoriteList("fav-list-app").render();
      }
    } else {
      favIcon.classList.add("fa-solid");
      favIcon.classList.remove("fa-regular");
      App.fav.addFavoriteProduct(this.product);
    }
    App.fav.updateFavoriteNotificationCount();
  }

  showDetailsInPopup() {
    if (document.querySelector("#popup") || document.querySelector("#app")) {
      new PopupTemplate(this.product).render();
    }
  }

  render() {
    const prodEl = this.createRootElement("div", "shoes-container");
    const uniqueFavIconID = `fav-icon-${this.index}`;
    const favIconClass = App.fav.isProductFavorited(this.product)
      ? "fa-solid"
      : "fa-regular";

    prodEl.innerHTML = `
    <img class="shoes-container__img"
      src="${this.product.imgUrl}"
      alt="${this.product.title}"/>
    <a onclick="return false;">
      <i id="${uniqueFavIconID}" class="shoes-container__icon fa-regular ${favIconClass} fa-heart fa-xl"></i>
    </a>
    <span class="shoes-container__price">\$${this.product.price}</span>
    <div class="shoes-container__shoes-details">
      <span>${this.product.title}</span>
      <span>${this.product.colours}</span>
    </div>

    `;
    const favBtn = prodEl.querySelector(`#${uniqueFavIconID}`);
    favBtn.addEventListener("click", this.toggleFavorite.bind(this));
    prodEl.addEventListener("click", () => this.showDetailsInPopup());

    return prodEl;
  }
}

class ProductList extends Component {
  products = [
    new Product(
      "Ultimate Shoes",
      19.99,
      "sourse/img/shoes1/shoes1.jpg",
      "Men Running",
      "Brown",
      [41, 42, 43, 44, 45, 46, 47]
    ),
    new Product(
      "Superstar Shoes",
      25.99,
      "sourse/img/shoes2/shoes22.jpg",
      "Originals",
      "Navy blue",
      [39, 40, 44, 45, 46, 47]
    ),
    new Product(
      "Forum Low Shoes",
      31.99,
      "sourse/img/shoes3/shoes32.jpg",
      "Originals",
      "Ecru",
      [42, 43, 44, 45, 46, 47]
    ),
    new Product(
      "ZX 700HD Shoes",
      15.99,
      "sourse/img/shoes5/shoes51.jpg",
      "Children Original",
      "Gray",
      [39, 40, 41, 42, 43, 44, 45, 46]
    ),
  ];

  constructor(renderHookId) {
    super(renderHookId);
  }

  render() {
    const storeSection = this.createRootElement("section", "store-section");
    const rowDiv = this.createRootElement("div", "row");
    storeSection.append(rowDiv);

    const renderProductsList = (productsToShow) => {
      rowDiv.innerHTML = "";

      if (productsToShow.length === 0) {
        const noProductDiv = document.createElement("div");
        noProductDiv.className = "no-product";
        noProductDiv.textContent = "No products found.";
        rowDiv.appendChild(noProductDiv);
        return;
      }

      for (let index = 0; index < productsToShow.length; index++) {
        const prod = productsToShow[index];
        const colDiv = this.createRootElement("div", "col-1-of-4", [
          new ElementAttribute("id", `store-list${index}`),
        ]);
        const prodPopup = this.createRootElement("a", "shoesPopup", [
          new ElementAttribute("href", "#popup"),
        ]);

        rowDiv.append(colDiv);
        colDiv.append(prodPopup);
        const productItem = new ProductItem(
          prod,
          colDiv.id,
          productsToShow,
          index
        );
        const productElement = productItem.render();
        prodPopup.append(productElement);
      }
    };

    const filterHandler = document.getElementById("shoes-filter");
    filterHandler.addEventListener("input", (event) => {
      const inputFilter = filterHandler.value.toLowerCase();
      let filteredProducts;

      if (!inputFilter.trim()) {
        filteredProducts = this.products;
      } else {
        filteredProducts = this.products.filter((product) =>
          product.title.toLowerCase().includes(inputFilter)
        );
      }

      renderProductsList(filteredProducts);
    });
    renderProductsList(this.products);
  }
}

class PopupTemplate {
  constructor(product) {
    this.product = product;
  }

  render() {
    const existingPopup = document.querySelector(".popup");
    if (existingPopup) {
      existingPopup.remove();
    }
    const popupTemplate = document.getElementById("popupTemplate");
    const clonePopupTemplate = document.importNode(popupTemplate.content, true);
    clonePopupTemplate.getElementById("popupImg").src = this.product.imgUrl;
    clonePopupTemplate
      .getElementById("popupImg")
      .classList.add("popup__container--img");
    clonePopupTemplate.getElementById(
      "popupPrice"
    ).textContent = `$${this.product.price}`;
    clonePopupTemplate.getElementById("popupColor").textContent =
      this.product.colours;
    const numbersDivs = clonePopupTemplate.querySelectorAll(
      ".popup__container--description__numbers--number"
    );
    numbersDivs.forEach((div, index) => {
      if (this.product.numbers[index] !== undefined) {
        div.textContent = this.product.numbers[index];
      } else {
        div.style.display = "none";
      }
    });

    let selectedSize = null;
    numbersDivs.forEach((e) => {
      e.addEventListener("click", function () {
        if (this.classList.contains("active-numbers")) {
          this.classList.remove("active-numbers");
          addcartContianer.classList.remove("active-add-cart");
          return;
        }
        numbersDivs.forEach((innerDiv) => {
          innerDiv.classList.remove("active-numbers");
          addcartContianer.classList.remove("active-add-cart");
        });
        this.classList.add("active-numbers");
        addcartContianer.classList.add("active-add-cart");
        selectedSize = e.textContent;
      });
    });

    var cartBtn = clonePopupTemplate.getElementById("add-to-bag");
    cartBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (selectedSize) {
        const productWithSize = {
          ...this.product,
          size: selectedSize,
        };
        const productItemInstance = new ProductItem(productWithSize);
        productItemInstance.addToCart();
      }
    });

    document.body.append(clonePopupTemplate);
  }
}

class FavoriteCart {
  favItems = [];

  addFavoriteProduct(Product) {
    if (!this.favItems.find((p) => p.title === Product.title)) {
      this.favItems.push(Product);
    }
    const updateItems = [...this.favItems];
    this.favItems = updateItems;
    this.saveFavoritesToLocalStorage();
  }

  removeFavoriteProduct(product) {
    this.favItems = this.favItems.filter((p) => p.title !== product.title);
    this.saveFavoritesToLocalStorage();
  }

  isProductFavorited(product) {
    return !!this.favItems.find((p) => p.title === product.title);
  }

  updateFavoriteNotificationCount() {
    const countElement = document.querySelector("#header-fav-count");
    const numberOfFavorites = this.favItems.length;
    countElement.textContent = numberOfFavorites;
    if (numberOfFavorites >= 1) {
      countElement.classList.add("visible");
      countElement.classList.remove("invisible");
    } else if (numberOfFavorites <= 0) {
      countElement.classList.add("invisible");
      countElement.classList.remove("visible");
    }
  }

  saveFavoritesToLocalStorage() {
    localStorage.setItem("favoriteProducts", JSON.stringify(this.favItems));
  }

  loadFavoritesFromLocalStorage() {
    const savedFavorites = localStorage.getItem("favoriteProducts");
    if (savedFavorites) {
      this.favItems = JSON.parse(savedFavorites);
    }
  }

  getFavoriteProducts() {
    return this.favItems;
  }
}

class FavoriteList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
  }

  render() {
    const favorites = App.fav.getFavoriteProducts();

    const favSection = this.createRootElement("section", "favorites-section");
    const yourWish = document.getElementById("head-wishlist");
    const cloneYourWish = document.importNode(yourWish.content, true);
    cloneYourWish.querySelector("h3").textContent = "Your WISHLIST";
    cloneYourWish.querySelector("h6").textContent = `${favorites.length} ITEMS`;

    let rowDiv = this.createRootElement("div", "row");
    rowDiv.append(cloneYourWish);
    favSection.append(rowDiv);
    if (favorites.length === 0) {
      const noProductDiv = document.createElement("div");
      noProductDiv.className = "no-product";
      noProductDiv.textContent = "No products found.";
      rowDiv.appendChild(noProductDiv);
      return;
    }

    for (let i = 0; i < Math.min(2, favorites.length); i++) {
      var colDiv = this.createRootElement("div", "col-1-of-4", [
        new ElementAttribute("id", `store-list${i}`),
      ]);
      rowDiv.append(colDiv);
      const productItem = new ProductItem(
        favorites[i],
        colDiv.id,
        favorites,
        i
      );
      const productElement = productItem.render();
      colDiv.append(productElement);
    }

    const wishlistCol = this.createRootElement("div", "col-2-of-4");
    const wishlistDiv = document.createElement("div");
    wishlistDiv.className = "wishlist-container";
    wishlistDiv.innerHTML = ` <h4>Don't lose your wishlist</h4>
    <p class="wishlist-container__text">
      Join the ourClub today and receive a 15% discount voucher for your first
      order. Or log in to save the item(s) so they won't be lost.
    </p>
    <a class="btn btn--whislist" href="logIn.html"
      >Register &nbsp;
      <i class="fa-solid fa-arrow-right"></i>
    </a>
    <p class="wishlist-container__text">Already an ourClub member?</p>
    <a class="wishlist-container__login" href="logIn.html">LOG IN</a>`;
    wishlistCol.append(wishlistDiv);
    rowDiv.append(wishlistCol);

    if (favorites.length > 2) {
      rowDiv = this.createRootElement("div", "row");
      favSection.append(rowDiv);

      for (let i = 2; i < favorites.length; i++) {
        colDiv = this.createRootElement("div", "col-1-of-4", [
          new ElementAttribute("id", `store-list${i}`),
        ]);
        const productItem = new ProductItem(
          favorites[i],
          colDiv.id,
          favorites,
          i
        );
        const productElement = productItem.render();
        colDiv.append(productElement);
        rowDiv.append(colDiv);
      }
    }
  }
}

class ShoppingCart {
  cartItems = [];

  getTotalItemCount() {
    return this.cartItems.reduce((acc, product) => acc + product.quantity, 0);
  }

  addProductToCart(product) {
    const existingProduct = this.cartItems.find(
      (p) => p.title === product.title
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      product.quantity = 1;
      this.cartItems.push(product);
    }
    this.updateCartInLocalStorage();
  }

  removeProductCart(productTitle) {
    const productItem = this.cartItems.find((p) => p.title === productTitle);
    if (productItem && productItem.quantity > 1) {
      productItem.quantity--;
    } else {
      this.cartItems = this.cartItems.filter((p) => p.title !== productTitle);
    }
    this.updateCartInLocalStorage();
  }

  updateCartNotificationCount() {
    const countElement = document.querySelector("#header-cart-count");
    const numberofCartItems = this.cartItems.length;
    countElement.textContent = numberofCartItems;
    if (numberofCartItems >= 1) {
      countElement.classList.add("visible");
      countElement.classList.remove("invisible");
    } else if (numberofCartItems <= 0) {
      countElement.classList.add("invisible");
      countElement.classList.remove("visible");
    }
  }

  getTotalValueCartItems() {
    return this.cartItems.reduce((acc, product) => acc + product.quantity, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }

  updateCartInLocalStorage() {
    localStorage.setItem("shoppingCart", JSON.stringify(this.cartItems));
  }

  loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("shoppingCart");
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }
  getCartItems() {
    return this.cartItems;
  }
}

class ShoppingList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
  }

  updateTotalPriceAndItemCount() {
    const totalPrice = App.cart.getTotalPrice();
    const itemCount = App.cart.getTotalItemCount();

    const totalPriceElement = document.getElementById(
      "basket-section-total-payment-value"
    );
    const itemCountElement = document.getElementById("basket-item-value");
    const deliveryChargeElement = document.getElementById(
      "basket-section-delivery"
    );

    let deliveryCharge = totalPrice >= 50 ? 0 : 10;
    deliveryChargeElement.textContent =
      totalPrice >= 50 ? "Free" : `$${deliveryCharge}`;

    totalPriceElement.textContent = `$${(totalPrice + deliveryCharge).toFixed(
      2
    )}`;
    itemCountElement.textContent = `${itemCount} ITEMS`;
  }

  render() {
    const cartItems = App.cart.getCartItems();

    const cartSection = this.createRootElement("section", "basket-section");
    let rowDiv = this.createRootElement("div", "row");
    cartSection.append(rowDiv);

    let cartItemTotalPriceValue = 0;
    const cartItemLenght = cartItems.length;
    let orderPrice = 0;
    for (const i of cartItems) {
      cartItemTotalPriceValue = cartItemTotalPriceValue + i.price;
    }

    if (cartItems.length === 0) {
      const noProductDiv = document.createElement("div");
      noProductDiv.className = "no-product";
      noProductDiv.textContent = "No products found.";
      rowDiv.appendChild(noProductDiv);
      return;
    }

    for (let i = 0; i < 1; i++) {
      let colDiv = this.createRootElement("div", "col-2-of-4", [
        new ElementAttribute("id", `store-list${i}`),
      ]);
      rowDiv.append(colDiv);

      const basketItemTemplate = document.getElementById(
        "basket-item-template"
      );
      const basketItemEl = document.importNode(
        basketItemTemplate.content,
        true
      );
      basketItemEl.getElementById("basket-section-img").src =
        cartItems[i].imgUrl;
      basketItemEl.getElementById("basket-section-title").textContent =
        cartItems[i].title;
      basketItemEl.getElementById("basket-section-price").textContent =
        cartItems[i].price;
      basketItemEl.getElementById(
        "basket-section-color"
      ).textContent = `Color: ${cartItems[i].colours}`;
      basketItemEl.getElementById(
        "basket-section-size"
      ).textContent = `Size: ${cartItems[i].size}`;

      let orderCount = basketItemEl.getElementById("basket-section-select");
      orderCount.addEventListener("change", (event) => {
        const selectedQuantity = parseInt(event.target.value);
        const cartItem = cartItems[i];
        cartItem.quantity = selectedQuantity;
        App.cart.updateCartInLocalStorage();
        this.updateTotalPriceAndItemCount();
      });

      const removeBtn = basketItemEl.getElementById("basket-section-remove");
      removeBtn.addEventListener("click", () => {
        App.cart.removeProductCart(cartItems[i].title);
        if (document.querySelector("#shopping-app")) {
          document.querySelector(".basket-section").remove();
        }
        this.render();
      });

      colDiv.append(basketItemEl);
      cartSection.append(rowDiv);

      let orderDiv = this.createRootElement("div", "col-1-of-4");
      const orderTemp = document.getElementById("order-template");
      const orderTempEl = document.importNode(orderTemp.content, true);
      orderTempEl.getElementById(
        "basket-item-value"
      ).textContent = `${cartItemLenght} ITEMS`;
      orderTempEl.getElementById(
        "basket-section-payment-value"
      ).textContent = `${cartItemTotalPriceValue} \$`;
      if (cartItemTotalPriceValue >= 50) {
        orderTempEl.getElementById(
          "basket-section-delivery"
        ).textContent = `Free`;
        orderPrice = 0;
      } else if (cartItemTotalPriceValue <= 50) {
        orderTempEl.getElementById(
          "basket-section-delivery"
        ).textContent = `\$10 `;
        orderPrice = 10;
      }
      orderTempEl.getElementById(
        "basket-section-total-payment-value"
      ).textContent = "$" + (cartItemTotalPriceValue + orderPrice).toFixed(2);
      orderDiv.append(orderTempEl);
      rowDiv.append(orderDiv);
    }
    for (let i = 1; i < cartItemLenght; i++) {
      let rowDiv = this.createRootElement("div", "row");
      let colDiv = this.createRootElement("div", "col-2-of-4", [
        new ElementAttribute("id", `store-list${i}`),
      ]);

      const basketItemTemplate = document.getElementById(
        "basket-item-template"
      );
      const basketItemEl = document.importNode(
        basketItemTemplate.content,
        true
      );
      basketItemEl.getElementById("basket-section-img").src =
        cartItems[i].imgUrl;
      basketItemEl.getElementById("basket-section-title").textContent =
        cartItems[i].title;
      basketItemEl.getElementById("basket-section-price").textContent =
        cartItems[i].price;
      basketItemEl.getElementById(
        "basket-section-color"
      ).textContent = `Color: ${cartItems[i].colours}`;
      basketItemEl.getElementById(
        "basket-section-size"
      ).textContent = `Size: ${cartItems[i].size}`;

      let orderCount = basketItemEl.getElementById("basket-section-select");
      orderCount.addEventListener("change", (event) => {
        const selectedQuantity = parseInt(event.target.value);
        const cartItem = cartItems[i];
        cartItem.quantity = selectedQuantity;
        App.cart.updateCartInLocalStorage();
        this.updateTotalPriceAndItemCount();
      });

      const removeBtn = basketItemEl.getElementById("basket-section-remove");
      removeBtn.addEventListener("click", () => {
        App.cart.removeProductCart(cartItems[i].title);
        if (document.querySelector("#shopping-app")) {
          document.querySelector(".basket-section").remove();
        }
        this.render();
      });

      colDiv.append(basketItemEl);
      rowDiv.append(colDiv);
      cartSection.append(rowDiv);
    }
  }
}

class App {
  static fav = new FavoriteCart();
  static cart = new ShoppingCart();

  static addCartToFav(product) {
    this.fav.addFavoriteProduct(product);
  }

  static App() {
    if (document.querySelector("#app")) {
      const prodlist = new ProductList("app");
      prodlist.render();
      App.goOnPopupScript();
      App.removeScript();
    }
  }

  static shoppingApp() {
    if (document.querySelector("#shopping-app")) {
      const shopList = new ShoppingList("shopping-app");
      shopList.render();
    }
  }

  static favApp() {
    if (document.querySelector("#fav-list-app")) {
      const favlist = new FavoriteList("fav-list-app");
      favlist.render();
    }
  }

  static init() {
    this.fav.loadFavoritesFromLocalStorage();
    this.fav.updateFavoriteNotificationCount();
    this.cart.loadCartFromLocalStorage();
    this.cart.updateCartNotificationCount();
    this.shoppingApp();
    this.favApp();
    this.App();
  }

  static removeScript() {
    const script = document.getElementById("dinamikScript");
    if (script) {
      script.remove();
    }
  }

  static loadScript() {
    const script = document.createElement("script");
    script.id = "dinamikScript";
    script.src = "script/popup.js";
    script.defer = true;
    document.head.append(script);
  }

  static goOnPopupScript() {
    const links = document.querySelectorAll('a[href="#popup"]');
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        App.loadScript();
        window.addEventListener("click", function () {
          App.removeScript();
        });
      });
    });
  }
}

App.init();



