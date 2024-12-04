import { TravelPlan } from "@/types/types";

interface TravelPlanResponse {
  data: {
    _id: string;
    [key: string]: any; 
  }
}

const TEST_USER_EMAIL = Cypress.env('TEST_USER_EMAIL');

const DEFAULT_TRAVEL_PLAN: Omit<TravelPlan, '_id' | 'userEmail'> = {
  title: '테스트 여행 계획',
  destination: '테스트 목적지',
  startDate: '2024-12-20',
  endDate: '2024-12-25',
  budget: 500000,
  description: '테스트를 위한 여행 계획입니다.',
};

const createTestTravelPlan = (customData: Partial<TravelPlan> = {}): Cypress.Chainable<string> => {
  const planData = {
    ...DEFAULT_TRAVEL_PLAN,
    ...customData,
    userEmail: TEST_USER_EMAIL
  };

  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/api/travel-plans`,
    body: planData,
  }).then((response: Cypress.Response<TravelPlanResponse>) => {
    expect(response.status).to.eq(200);
    return response.body.data._id;
  });
};

const generateTravelPlanData = (overrides: Partial<TravelPlan> = {}): Omit<TravelPlan, '_id' | 'userEmail'> => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 5);

  return {
    ...DEFAULT_TRAVEL_PLAN,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    ...overrides
  };
};

export {
  createTestTravelPlan,
  generateTravelPlanData,
};