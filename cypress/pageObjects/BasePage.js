class BasePage {
  interceptApi(method, alias, urlPattern) {
    cy.intercept(method, urlPattern).as(alias);
  }

  navigateTo(linkSelector) {
    cy.get(linkSelector).first().as('menuLink');
    cy.get('@menuLink').should('be.visible').click({ force: true });
  }

  checkFilters(filters) {
    cy.get('.top-filter__widget').within(() => {
      filters.forEach(filter => {
        cy.contains('h2.widget__title', filter.title).should('exist').click();

        if (!filter.noMoreButton) {
          cy.contains('button', 'Zobraziť viac').should('be.visible').each(button => {
            cy.wrap(button).scrollIntoView().click({ force: true });
          });
        }

        filter.options.forEach(option => {
          cy.contains(option).should('exist');
        });
      });
    });
  }
}

export default BasePage;
