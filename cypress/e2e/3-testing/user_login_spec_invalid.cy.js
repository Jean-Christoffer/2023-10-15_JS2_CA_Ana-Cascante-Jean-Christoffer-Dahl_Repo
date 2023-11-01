describe('Login Form Tests', () => {
    beforeEach(() => {
      cy.visit('src/index.html');
    });
  
    it('The user cannot submit the login form with invalid credentials and is shown a message', () => {

      cy.get('#email').type('invalid_email@example.com');
      cy.get('#password').type('wrong!');
      cy.get('#login_form').submit();
  

      cy.get('#emailError').should('contain', 'Invalid email format. Must be a Noroff mail');
      cy.get('#passwordError').should('contain', 'Password must be at least 8 characters long.');
  

      cy.url().should('include', '/index.html'); 
    });
  });