import HomePage from '../pageObjects/HomePage';
import ProductPage from '../pageObjects/ProductPage';
import BasePage from '../pageObjects/BasePage';

describe('Testing omara.sk website', () => {
  const basePage = new BasePage();
  const homePage = new HomePage();
  const productPage = new ProductPage();

  beforeEach(() => {
    homePage.visit();
  });

  it('Should navigate to "Zásnuby", check responses and filters', () => {
    homePage.interceptApi('GET', 'apiCheck', '**/engagement**');

    basePage.navigateTo('a[href="../engagement"]');

    cy.wait('@apiCheck', { timeout: 10000 }).then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.not.be.null;
    });

    cy.contains('label', 'Štandardný').prev('input[type="radio"]').should('be.checked');

    const expectedFilters = [
      { title: 'Kategória', options: ['Náušnice', 'Náramky', 'Náhrdelníky', 'Prstene', 'Náramky na nohu'] },
      { title: 'Kovy', options: ['417 Žlté Zlato (10K)', '417 Biele Zlato (10K)', '417 Ružové Zlato (10K)', '585 Žlté Zlato (14K)', '585 Biele Zlato (14K)', '585 Ružové Zlato (14K)', '750 Žlté Zlato (18K)', '750 Biele Zlato (18K)', '750 Ružové Zlato (18K)', '950 Platina'] },
      { title: 'Tvar Prsteňa', options: ['Triple', 'Contemporary', 'Swirl', 'Twisted Vine', 'Tapered', 'Twisted', 'Split Tapered', 'Square Edge', 'Knife Edge', 'Single'] },
      { title: 'Tvar Kameňov', options: ['Markíza', 'Hruška', 'Smaragd', 'Oválny', 'Vankúšikový', 'Princezná', 'Okrúhly'] },
      { title: 'Štýly Hlavy Prsteňa', options: ['4-Prong', 'Bead Single Halo Veľký', 'Trojkamenný Center Halo', 'Bezel Plný', 'Bead Single Halo Malý', 'Bezel Polovičný', 'Trojkamenný', '6-Prong', 'U-Páve Single Halo Malý', 'U-Páve Single Halo Veľký', 'Dvojité Halo'] },
      { title: 'Štýl Osadenia Kameňa', options: ['Žiadny Kameň', 'U-Páve'], noMoreButton: true }
    ];

    homePage.checkFilters(expectedFilters);
  });

  it('Should navigate find product, check responses, add to wishlist', () => {
    cy.intercept('GET', '**/collection/initials').as('allRequests');

    basePage.navigateTo('.header__nav a[href="/collection/initials"]');

    productPage.interceptApi('GET', 'apiProductCheck', '**/product**');

    productPage.selectProduct('Náhrdelník Mon Petit');

    cy.wait('@allRequests', { timeout: 10000 }).then((interception) => {
      cy.log('All Requests:', interception);
    });

    cy.url().should('include', '/product');
    cy.wait('@apiProductCheck', { timeout: 10000 }).then((interception) => {
      cy.log('Product API check response:', interception.response);
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.not.be.null;
    });

    productPage.interceptApi('POST', 'wishlistCheck', '**/wishlist**'); // Assuming wishlist is a POST request

    productPage.addToWishlist();

    cy.wait('@wishlistCheck', { timeout: 10000 }).then((interception) => {
      cy.log('Wishlist API check response:', interception.response);
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.not.be.null;
    });
  });
});
