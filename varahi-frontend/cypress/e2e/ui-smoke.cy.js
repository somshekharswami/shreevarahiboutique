describe("Varahi Boutique - UI Smoke Tests", () => {

  it("Homepage loads and shows products", () => {
    cy.visit("/");
    cy.contains("VB").should("exist"); 
   
  });

  it("displays VB logo, search bar, and menu icon", () => {
    cy.visit("/");

    // VB logo
    cy.contains("VB").should("exist");

    // Search bar with correct placeholder
    cy.get("input[placeholder='kurti, dupatta, palazzo..']").should("exist");

    // Menu icon (hamburger)
    cy.get("svg").should("exist"); // Adjust selector if icon has specific data-testid/class
  });

  it("Cart page loads for guest", () => {
    cy.visit("/cart");
    cy.contains("Your Cart").should("exist");
      
  });

  it("Product detail page loads", () => {
    cy.visit("/");
     cy.contains("White Cotton Palazzo").click();
    cy.get("button").contains("Add to Cart").should("exist");
  });

  it("Category page loads (Kurti)", () => {
    cy.visit("/Kurti");
    cy.contains("Kurti Collection").should("exist");
  });

});
