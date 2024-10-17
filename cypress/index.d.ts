declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<JQuery<HTMLElement>>

    /**
     * Custom command to login.
     * @example cy.login('user@email.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>
  }
}