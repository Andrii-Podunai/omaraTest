import BasePage from './BasePage';

class HomePage extends BasePage {
  visit() {
    cy.visit('https://omara.sk/');
  }
}

export default HomePage;
