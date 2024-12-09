import { createTestTravelPlan, generateTravelPlanData } from "../support/utils/travelPlanUtils";

describe('여행 계획 상세 페이지', () => {
  let testTravelPlanId: string;

  before(() => {
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
    
    const testPlanData = generateTravelPlanData({
      title: '테스트 여행',
      destination: '테스트 도시',
      startDate: '2024-11-18',
      endDate: '2024-11-24',
      budget: 500000,
      description: '테스트를 위한 여행 계획입니다.',
    });

    createTestTravelPlan(testPlanData).then(id => {
      testTravelPlanId = id;
      console.log("testTravelPlanId", testTravelPlanId);
    });
  });

  beforeEach(() => {
    cy.session([Cypress.env('TEST_USER_EMAIL')], () => {
      cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
    });

    cy.visit(`/planner/${testTravelPlanId}`);
  });

  it('여행 계획 세부정보 확인', () => {
    cy.dataCy('travel-plan-detail').should('be.visible');
    cy.dataCy('travel-plan-title').should('exist');
    cy.dataCy('travel-plan-date').should('exist');
  });

  it('여행 계획 세부정보 수정', () => {
    cy.dataCy('plan-detail-button').click();

    cy.dataCy('travel-plan-title-input').should('be.visible');
    cy.dataCy('travel-plan-destination-input').should('be.visible');

    cy.dataCy('travel-plan-title-input').clear().type('서울 여행');
    cy.dataCy('travel-plan-destination-input').clear().type('서울');
    cy.dataCy('travel-plan-budget-input').clear().type('200000');
    cy.dataCy('travel-plan-startDate-input').clear().type('2024-11-18');
    cy.dataCy('travel-plan-endDate-input').clear().type('2024-11-24');
    cy.dataCy('travel-plan-description-textarea').clear().type('서울 여행 갑니다.');

    cy.dataCy('plan-detail-edit-button').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('여행 계획 수정에 성공했습니다');
    });

    cy.dataCy('travel-plan-title').should('contain', '서울 여행');
    cy.dataCy('travel-plan-destination').should('contain', '서울');
    cy.dataCy('travel-plan-description').should('contain', '서울 여행 갑니다.');
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

  it('새 일정 추가', () => {
    cy.dataCy('itinerary-date-input').type('2024-11-20');
    cy.dataCy('itinerary-time-input').type('14:00');
    cy.dataCy('itinerary-activity-input').type('남산타워 방문'); 
    cy.dataCy('itinerary-location-input').type('남산');    
    cy.dataCy('itinerary-expense-input').type('20000');
    cy.dataCy('itinerary-category-input').select('entertainment');
    cy.dataCy('itinerary-notes-textarea').type('서울 야경 구경');
    
    cy.dataCy('itinerary-manager-add-submit').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('새 일정이 추가되었습니다.');
    });

    cy.wait(2000);
    
    cy.get('[data-cy="itinerary-item"]').first().within(() => {  
      cy.dataCy('itinerary-activity').should('contain', '남산타워 방문');
      cy.dataCy('itinerary-location').should('contain', '남산');
      cy.dataCy('itinerary-date').should('contain', '2024. 11. 20.');
      cy.dataCy('itinerary-time').should('contain', '14:00');
      cy.dataCy('itinerary-expense').should('contain', '20,000 원');
      cy.dataCy('itinerary-notes').should('contain', '서울 야경 구경');
    });
  });

  it('기존 일정 수정', () => {
    cy.get('[data-cy="itinerary-item"]').first().scrollIntoView().should('be.visible').within(() => {
      cy.dataCy('itinerary-item-edit-button').should('be.visible').click({ force: true });
    });
  
    cy.dataCy('itinerary-date-input').should('be.visible').clear().type('2024-11-21');
    cy.get('[data-cy="itinerary-activity-input"]').should('be.visible').clear().type('수정된 활동');
    cy.get('[data-cy="itinerary-location-input"]').should('be.visible').clear().type('수정된 장소');
    cy.get('[data-cy="itinerary-expense-input"]').should('be.visible').clear().type('30000');
    cy.dataCy('itinerary-manager-edit-submit').should('be.visible').click();
  
    cy.on('window:alert', (str) => {
      expect(str).to.equal('일정이 수정되었습니다.');
    });
  
    cy.wait(2000);
  
    cy.get('[data-cy="itinerary-item"]').first().scrollIntoView().within(() => {
      cy.dataCy('itinerary-activity').should('contain', '수정된 활동');
    });
  });

  it('일정 삭제', () => {
    cy.get('[data-cy="itinerary-item"]').first().within(() => {
      cy.dataCy('itinerary-item-delete-button').click({ force: true });
    });
  
    cy.on('window:alert', (str) => {
      expect(str).to.equal('일정을 삭제했습니다.');
    });
  
    cy.wait(2000);
  
    cy.dataCy('itinerary-item-item').should('not.exist');
  });

  it('토글 매니저 확인', () => {
    cy.dataCy('floating-toggle-manager').should('be.visible');
  });

  it('체크리스트 항목 추가', () => {
    const newItemText = '여권 준비하기';

    cy.dataCy('checklist-input').type(newItemText);
    cy.dataCy('checklist-add-button').click();

    cy.dataCy('checklist-item').first().should('contain', newItemText);
  });

  it('체크리스트 항목 완료 표시', () => {
    cy.dataCy('checklist-item').first().within(() => {
      cy.dataCy('checklist-completed-checkbox').click();
      cy.get('span').should('have.class', 'line-through');
      cy.get('input[type="checkbox"]').should('be.checked');
    });
  });

  it('체크리스트 항목 삭제', () => {
    cy.get('[data-cy=checklist-item]').then((items) => {
      if (items.length > 0) {
        cy.dataCy('checklist-item').first().within(() => {
          cy.dataCy('checklist-delete-button').click();
        });
  
        cy.wait(2000);
  
        cy.dataCy('checklist-item').should('not.exist');
      } else {
        throw new Error('삭제할 체크리스트 항목이 없습니다.');
      }
    });
  });
  
  
  it('체크리스트와 예산 분석 전환', () => {
    cy.dataCy('toggle-button').click();
    cy.contains('예산 분석').should('be.visible');

    cy.dataCy('toggle-button').click();
    cy.contains('체크리스트').should('be.visible');
  });

  it('여행 계획 삭제', () => {
    cy.dataCy('plan-detail-delete-button').click();

    cy.on('window:confirm', (str) => {
      expect(str).to.equal('정말로 이 여행 계획을 삭제하시겠습니까?');
      return true;
    });

    cy.url().should('include', '/planner');
  });
});