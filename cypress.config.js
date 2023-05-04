const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'yvsawm',
  e2e: {
    baseUrl : 'https://www.demoblaze.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
