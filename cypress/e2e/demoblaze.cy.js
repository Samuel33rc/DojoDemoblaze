import { faker } from "@faker-js/faker";

describe("automatisation Demoblaze", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("creation et inscription d'un utilisateur aléatoire", () => {
    cy.intercept("https://api.demoblaze.com/signup").as("signup");
    cy.writeFile("cypress/fixtures/user.json", {
      userName: `${faker.internet.userName()}`,
      password: `${faker.internet.password()}`,
      name: `${faker.name.fullName()}`,
      country: `${faker.address.country()}`,
      city: `${faker.address.city()}`,
      creditCard: `${faker.finance.creditCardNumber()}`,
      month: `${faker.date.month()}`,
      year: `${Math.random()}`,
    });

    cy.fixture("user.json").as("user");
    cy.get("@user").then((user) => {
      cy.get("#signin2").click();
      cy.wait(2000);
      cy.get("#sign-username").type(user.userName);
      cy.wait(2000);
      cy.get("#sign-password").type(user.password);
      cy.wait(2000);
      cy.get(
        "#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
      ).click();
      cy.wait("@signup")
        .its("response")
        .then((response) => {
          cy.wrap(response).its("statusCode").should("eq", 200);
        });
    });
  });

  it("parcours utilisateur connecté", () => {
    cy.intercept("https://api.demoblaze.com/login").as("login");
    cy.fixture("user.json").as("user");
    cy.get("@user").then((user) => {
      cy.get("#login2").click();
      cy.wait(2000);
      cy.get("#loginusername").type(user.userName);
      cy.wait(2000);
      cy.get("#loginpassword").type(user.password);
      cy.wait(2000);
      cy.get(
        "#logInModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
      ).click();
      cy.wait("@login")
        .its("response")
        .then((response) => {
          cy.wrap(response).its("statusCode").should("eq", 200);
          cy.wrap(response).its("statusMessage").should("eq", "OK");
          cy.wrap(response).its("body").should("contain", "Auth_token");
        });
      cy.wait(2000);
      cy.get(":nth-child(3) > .card > :nth-child(1) > .card-img-top").click();
      cy.wait(2000);
      cy.intercept("https://api.demoblaze.com/addtocart").as("addToCart");
      cy.get(".col-sm-12 > .btn").click();
      cy.wait(2000);
      cy.wait("@addToCart")
        .its("response")
        .then((response) => {
          cy.wrap(response).its("statusCode").should("eq", 200);
          cy.wrap(response).its("statusMessage").should("eq", "OK");
        });
      cy.wait(2000);
      cy.get("#cartur").click();
      cy.wait(2000);
      cy.get(".col-lg-1 > .btn").click();
      cy.wait(2000);
      cy.get("@user").then((user) => {
        cy.get("#name").type(user.name);
        cy.get("#country").type(user.country);
        cy.get("#city").type(user.city);
        cy.get("#card").type(user.creditCard);
        cy.get("#month").type(user.month);
        cy.get("#year").type(user.year);
      });
      cy.wait(2000);
      cy.intercept("https://api.demoblaze.com/deletecart").as("deleteCart");
      cy.get(
        "#orderModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary"
      ).click();
      cy.get(".sweet-alert").should("be.visible");
      cy.get(".sweet-alert").should("contain", "Thank you for your purchase!");
      cy.wait("@deleteCart")
        .its("response")
        .then((response) => {
          cy.wrap(response).its("statusCode").should("eq", 200);
          cy.wrap(response).its("statusMessage").should("eq", "OK");
        });
      cy.wait(2000);
      cy.get(".confirm").click();
      cy.url().should("include", "index.html");
    });
  });
});
