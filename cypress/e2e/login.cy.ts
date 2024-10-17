describe('로그인', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('로그인 버튼을 클릭하면 로그인 페이지로 이동', () => {
    // action
    cy.dataCy("login-button").click();

    // assertion
    cy.url().should('include', '/login');
  });

  it('이메일과 비밀번호 입력 후 로그인 버튼을 누르면 로그인 상태로 변경', () => {
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
  });

});
