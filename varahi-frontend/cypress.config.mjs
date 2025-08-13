// cypress.config.mjs
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // E2E Node events go here if needed
    },
    supportFile: 'cypress/support/e2e.js', // optional, depends on your structure
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
});
