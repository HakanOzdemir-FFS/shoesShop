class FavoriteProductsList extends Component {
  constructor(renderHookId) {
    super(renderHookId);
    this.favorites = App.cart.getFavoriteProducts();
  }

  render() {
    const favoritesSection = this.createRootElement(
      "section",
      "favorites-section"
    );
    for (let product of this.favorites) {
      const productItem = new ProductItem(product, favoritesSection.id);
      productItem.render();
    }
  }
}

const favoritesList = new FavoriteProductsList("favorites-container");
favoritesList.render();
