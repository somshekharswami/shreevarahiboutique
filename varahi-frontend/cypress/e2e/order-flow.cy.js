describe("Guest Checkout Flow", () => {
  it("adds product to cart and redirects to login on checkout", () => {
    // Step 1: Visit homepage
    cy.visit("/");

    // Step 2: Click on a product
    cy.contains("White Cotton Palazzo").click();

    // Step 3: Add to cart
    cy.get("button").contains("Add to Cart").click();

    // Step 4: Go to cart page
    cy.contains("Cart").click();

    // Step 5: Click checkout
    cy.get("button").contains("Checkout").click();

    // Step 6: Verify redirected to login
    cy.url().should("include", "/login");
    cy.contains("Sign in to access your cart").should("exist");
  });
});
