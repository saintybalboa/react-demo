// / <reference types='Cypress' />
describe('Home', () => {
    before(() => {
        cy.visit('/');
    });

    it('should render the correct page title', () => {
        cy.get('h1').contains('React Demo');
    });
});
