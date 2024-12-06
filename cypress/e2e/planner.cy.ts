describe("여행 플래너 페이지", () => {
  beforeEach(() => {
    cy.session('user-session', () => {
      cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
    });

    cy.visit("/planner");
  });

  it('자신의 여행 계획 페이지로 이동', () => {
    cy.dataCy('travel-planner-page').click();
    cy.url().should('include', '/planner');
    cy.dataCy('planner-page').should('be.visible');
  });

  it('검색어 입력 및 검색 실행', () => {
    const searchTerm = '도쿄 여행';

    cy.dataCy('search-input')
      .type(searchTerm)
      .should('have.value', searchTerm);

    cy.dataCy('search-button').click();

    cy.dataCy('trip-item')
      .should('be.visible')
      .and('contain', searchTerm);
  });
});