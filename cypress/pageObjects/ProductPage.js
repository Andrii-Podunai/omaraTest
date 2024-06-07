import BasePage from './BasePage';

class ProductPage extends BasePage {
  selectProduct(productName) {
    cy.get('.product-grid-item__name').contains(productName).click();
  }

  addToWishlist() {
    cy.contains('Pridať do zoznamu želaní').click();
  }
}

export default ProductPage;
