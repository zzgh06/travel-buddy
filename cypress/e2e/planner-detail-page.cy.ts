describe('여행 계획 상세 페이지', () => {
  beforeEach(() => {
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
    const testTravelPlanId = '6711610bb34d29e20a0de325';
    cy.visit(`/planner/${testTravelPlanId}`);
  })

  it('여행 계획 세부정보 확인', () => {
    cy.dataCy('travel-plan-detail').should('be.visible');
    cy.dataCy('travel-plan-title').should('exist');
    cy.dataCy('travel-plan-date').should('exist');
  });

  it('여행 계획 세부정보 수정', () => {
    cy.dataCy('plan-detail-button').click();

    cy.dataCy('travel-plan-title-input').should('be.visible');
    cy.dataCy('travel-plan-destination-input').should('be.visible');

    cy.dataCy('travel-plan-title-input').type('서울 여행');
    cy.dataCy('travel-plan-destination-input').type('서울');
    cy.dataCy('travel-plan-budget-input').type('200000');
    cy.dataCy('travel-plan-startDate-input').type('2024-11-18');
    cy.dataCy('travel-plan-endDate-input').type('2024-11-24');
    cy.dataCy('travel-plan-description-textarea').type('서울 여행 갑니다.');

    cy.dataCy('plan-detail-edit-button').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('여행 계획 수정에 성공했습니다');
    });

    cy.dataCy('travel-plan-title').should('contain', '서울 여행');
    cy.dataCy('travel-plan-destination').should('contain', '서울');
    cy.dataCy('travel-plan-description').should('contain', '서울 여행 갑니다.');
  });

  it('여행 계획 삭제', () => {
    cy.dataCy('plan-detail-delete-button').click();

    cy.on('window:confirm', (str) => {
      expect(str).to.equal('정말로 이 여행 계획을 삭제하시겠습니까?');
      return true;
    });

    cy.url().should('include', '/planner');
  });

  it('예산 추적기 확인', () => {
    cy.dataCy('budget-tracker').should('be.visible');
    cy.dataCy('total-budget').should('exist');
    cy.dataCy('remaining-budget').should('exist');
  });

  it('일정 매니저 확인', () => {
    cy.get('[data-cy="itinerary-manager"]').should('be.visible');
    cy.get('[data-cy="itinerary-manager-date"]').should('exist');
    cy.get('[data-cy="itinerary-manager-time"]').should('exist');
  });

  it.only('새 일정 추가', () => {
    cy.dataCy('itinerary-date-input').type('2024-11-20');
    cy.dataCy('itinerary-time-input').type('14:00');
    cy.get('[date-cy="itinerary-activity-input"]').type('남산타워 방문');
    cy.get('[date-cy="itinerary-location-input"]').type('남산');
    cy.get('[date-cy="itinerary-expense-input"]').type('20000');
    cy.get('[date-cy="itinerary-category-input"]').select('entertainment');
    cy.dataCy('itinerary-notes-textarea').type('서울 야경 구경');
    cy.dataCy('add-itinerary-manager-submit').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('새 일정이 추가되었습니다.');
    });

    cy.get('[date-cy="itinerary-item"]').first().within(() => {
      cy.dataCy('itinerary-activity').should('contain', '남산타워 방문');
      cy.dataCy('itinerary-location').should('contain', '남산');
      cy.dataCy('itinerary-date').should('contain', '2024. 11. 20.');
      cy.dataCy('itinerary-time').should('contain', '14:00');
      cy.dataCy('itinerary-expense').should('contain', '20,000 원');
      cy.dataCy('itinerary-notes').should('contain', '서울 야경 구경');
    });
  });

  it('기존 일정 수정', () => {
    cy.get('[date-cy="itinerary-item"]').first().within(() => {
      cy.dataCy('edit-itinerary-item-button').click();
    });

    cy.dataCy('itinerary-date-input').clear().type('2024-11-21');
    cy.get('[date-cy="itinerary-activity-input"]').clear().type('수정된 활동');
    cy.get('[date-cy="itinerary-location-input"]').clear().type('수정된 장소');
    cy.get('[date-cy="itinerary-expense-input"]').clear().type('30000');
    cy.dataCy('edit-itinerary-manager-submit').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('일정이 수정되었습니다.');
    });

    cy.wait(2000);

    cy.get('[date-cy="itinerary-item"]').first().within(() => {
      cy.dataCy('itinerary-activity').should('be.visible').and('contain', '일정 : 수정된 활동');
    });
  });

  it.only('일정 삭제', () => {
    cy.get('[date-cy="itinerary-item"]').first().within(() => {
      cy.dataCy('itinerary-activity').invoke('text').as('deletedItemText');
      cy.dataCy('delete-itinerary-item-button').click();
    });

    cy.on('window:alert', (str) => {
      expect(str).to.equal('일정을 삭제했습니다.');
    });
  })

  it('토글 매니저 확인', () => {
    cy.dataCy('floating-toggle-manager').should('be.visible');
  });
});