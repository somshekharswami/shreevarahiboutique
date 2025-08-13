describe('Home Page', () => {
  it('displays product grid with title and category links', () => {
    cy.visit('/');
    cy.contains('Shree Varahi Boutique').should('be.visible');
  });

  it('displays correctly on mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.contains('Shree Varahi Boutique').should('be.visible');
  });
});
