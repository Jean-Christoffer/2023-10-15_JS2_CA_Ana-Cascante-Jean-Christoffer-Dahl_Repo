import { mail,password } from "../../creds";
describe('User Login and Profile Access', () => {
    it('allows the user to log in and access their profile', () => {

      cy.visit('src/index.html');
  

      cy.get('#email').type(mail);
      cy.get('#password').type(password);
  

      cy.get('form').submit();
  

      cy.url().should('include', '/profile');
  
    });
  });