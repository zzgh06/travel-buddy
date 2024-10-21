describe('로그인', () => {
  it('이메일과 비밀번호 입력 후 로그인 버튼을 누르면 로그인 상태로 변경', () => {
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
  });
});
