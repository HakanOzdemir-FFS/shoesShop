var addCartBtns = document.querySelectorAll(".cartBtn");
var addToBagBtn = document.getElementById("add-to-bag");

var moveCartBtnHandler = () => {
  const moveBasket = document.querySelector(".addCartBtn");

  function animationEndCallback() {
    moveBasket.classList.remove("cartItemsMove");
    moveBasket.removeEventListener("animationend", animationEndCallback);
  }

  if (moveBasket.classList.contains("cartItemsMove")) {
    moveBasket.classList.remove("cartItemsMove");
  } else {
    moveBasket.classList.add("cartItemsMove");
    moveBasket.addEventListener("animationend", animationEndCallback);
  }
};

addToBagBtn.addEventListener("click", (event) => {
  moveCartBtnHandler();
  event.preventDefault();
  setTimeout(() => {
    window.location.href = event.target.href;
  }, 2500);
});

var popup = document.getElementById("popup");
var storeList = document.getElementById("store-list");

//ŞİMDİLİK BU ŞEKİLDE KALSIN ANCAK SONRA DEVAM EDİCEM
popup.addEventListener("click", (event) => {
  window.location.href = "http://127.0.0.1:5501/index.html#";
});

var popupContainer = popup.querySelector(".popup__container");
popupContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

var numbersDivs = document.querySelectorAll(
  ".popup__container--description__numbers--number"
);
var addcartContianer = document.getElementById("add-cart-whit-numbers");

var addCartIcon = document.getElementById("addCartBtn");

window.addEventListener("resize", function () {
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (width <= 900) {
    addCartIcon.classList.add("fa-sm");
    addCartIcon.classList.remove("fa-lg");
  } else {
    addCartIcon.classList.add("fa-lg");
    addCartIcon.classList.remove("fa-sm");
  }
});

window.dispatchEvent(new Event("resize"));
