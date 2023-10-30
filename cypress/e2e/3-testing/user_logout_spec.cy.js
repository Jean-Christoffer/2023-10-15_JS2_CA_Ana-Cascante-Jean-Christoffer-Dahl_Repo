import { mail,password } from "../../creds";
describe('Logout Test', () => {
    beforeEach(() => {

        cy.visit('src/index.html');


        cy.get('#email').type(mail);
        cy.get('#password').type(password);
        cy.get('form').submit();
        

        cy.visit('src/profile.html');
    });

    it('The user can log out with the logout button', () => {
    
        cy.get('#logOut').click();


        cy.url().should('include', 'src/index.html');


    });
});
