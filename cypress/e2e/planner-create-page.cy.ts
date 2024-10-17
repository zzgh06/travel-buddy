describe('여행 계획 생성', () => {
  beforeEach(()=>{
    cy.visit("/")
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
  })
  it('로그인 후 여행 계획 시작하기 버튼 클릭 후 새 여행 계획 만들기 페이지로 이동', () => {    
    cy.dataCy('planner-page-button').click();

    cy.url().should('include', '/planner/create');
  });

  it.only('여행 계획 작성 후에 여행계획 만들기 버튼 누르면 플래너 페이지로 이동', () => {
    // 새 여행 계획 만들기 페이지로 이동
    cy.dataCy('planner-page-button').click();

    // 여행 제목 입력
    cy.dataCy('trip-title-input').type('도쿄 여행 2024');

    // 여행 날짜 선택
    cy.dataCy('trip-start-date').type('2024-10-18');
    cy.dataCy('trip-end-date').type('2024-10-23');

    // 여행 목적지 선택
    cy.dataCy('trip-destination-input').type('도쿄');

    // 여행 설명 입력
    cy.dataCy('trip-description-input').type('관광');

    // 여행 계획 만들기 버튼 클릭
    cy.dataCy('create-trip-button').click();

    // 플래너 페이지로 이동 확인
    cy.url().should('include', '/planner');

    // 생성된 여행 계획 확인
    cy.dataCy('trip-list').should('exist');
    cy.dataCy('trip-item').first().within(() => {
      cy.dataCy('trip-title').should('contain', '도쿄 여행 2024');
      cy.dataCy('trip-destination').should('contain', '도쿄');
    });
  });
  
});
