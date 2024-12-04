describe("플래너 페이지 접속", () => {
  before(()=>{
    cy.visit("/")
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
  })
  it('자신의 여행 계획 페이지로 이동', () => {    
    cy.dataCy('travel-planner-page').click();
    cy.url().should('include', '/planner');
    cy.dataCy('planner-page').should('be.visible');
  });
});