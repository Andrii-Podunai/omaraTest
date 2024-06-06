export const interceptApi = (alias, urlPattern) => {
  cy.intercept('GET', urlPattern).as(alias);
};


export const  navigateTo = (linkSelector) => {
  cy.get(linkSelector).first().as('menuLink');
  cy.get('@menuLink').should('be.visible').click({ force: true });
};

export const checkFilters = (filters) => {
  cy.get('.top-filter__widget').within(() => {
    filters.forEach(filter => {
      cy.contains('h2.widget__title', filter.title).should('exist').click();

      if (!filter.noMoreButton) {
        cy.contains('button', 'Zobraziť viac').then(button => {
          if (button.is(':visible')) {
            cy.wrap(button).scrollIntoView().should('be.visible').click({ force: true });
          }
        });
      }

      filter.options.forEach(option => {
        cy.contains(option).should('exist');
      });
    });
  });
};
