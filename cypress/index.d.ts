declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * 커스텀 커맨드를 사용하여 로그인합니다.
     * @example
     * cy.login('user@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>

    /**
     * 특정 데이터 속성을 가진 요소를 선택합니다.
     * @example
     * cy.dataCy('submit-button')
     */
    dataCy(value: string): Chainable<JQuery<HTMLElement>>
  }
}
