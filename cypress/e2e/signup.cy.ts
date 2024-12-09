describe('회원가입', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('회원가입 페이지 렌더링 확인', () => {
    cy.dataCy('signup-title').should('contain', 'Create an Account');
    cy.dataCy('signup-name-input').should('exist');
    cy.dataCy('signup-email-input').should('exist');
    cy.dataCy('signup-password-input').should('exist');
    cy.dataCy('signup-confirm-password-input').should('exist');
    cy.dataCy('signup-submit-button').should('exist');
  });

  it('잘못된 입력 데이터로 회원가입 시 에러 메시지 표시', () => {
    cy.dataCy('signup-name-input').type('이름이열자를초과하는경우');
    cy.dataCy('signup-email-input').type('invalid-email');
    cy.dataCy('signup-password-input').type('1234');
    cy.dataCy('signup-confirm-password-input').type('5678');
    
    cy.dataCy('signup-submit-button').click();

    cy.dataCy('error-message')
      .should('contain', '이름은 10자를 초과할 수 없습니다')
      .and('contain', '유효한 이메일 주소를 입력해주세요')
      .and('contain', '비밀번호는 5자 이상이어야 합니다')
      .and('contain', '비밀번호가 일치하지 않습니다');
  });

  it('이미 존재하는 이메일로 회원가입 시도 시 에러 메시지 표시', () => {
    const testUser = {
      name: 'Test User',
      email: 'admin@gmail.com',
      password: 'testPassword123'
    };

    cy.dataCy('signup-name-input').type(testUser.name);
    cy.dataCy('signup-email-input').type(testUser.email);
    cy.dataCy('signup-password-input').type(testUser.password);
    cy.dataCy('signup-confirm-password-input').type(testUser.password);
    
    cy.dataCy('signup-submit-button').click();

    cy.dataCy('error-message').should('contain', '이미 존재하는 이메일입니다.');
  });

  it('유효한 데이터로 회원가입 후 로그인 페이지로 이동', () => {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testPassword123'
    };

    cy.dataCy('signup-name-input').type(testUser.name);
    cy.dataCy('signup-email-input').type(testUser.email);
    cy.dataCy('signup-password-input').type(testUser.password);
    cy.dataCy('signup-confirm-password-input').type(testUser.password);
    
    cy.dataCy('signup-submit-button').click();

    cy.on('window:alert', (text) => {
      expect(text).to.equal('회원가입에 성공하였습니다.');
    });

    cy.url().should('include', '/login');
  });
});