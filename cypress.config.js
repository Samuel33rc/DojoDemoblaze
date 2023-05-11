const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'yvsawm',
  reporter: "cypress-mochawesome-reporter",
  e2e: {
    baseUrl : 'https://www.demoblaze.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("cypress-mochawesome-reporter/plugin")(on)
    },
  },
});
