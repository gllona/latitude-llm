export enum SubscriptionPlan {
  EnterpriseV1 = 'enterprise_v1',
  HobbyV1 = 'hobby_v1',
  HobbyV2 = 'hobby_v2',
  TeamV1 = 'team_v1',
}

export const SubscriptionPlans = {
  [SubscriptionPlan.HobbyV2]: {
    name: 'Hobby',
    credits: 20_000,
    users: 1,
  },
  [SubscriptionPlan.HobbyV1]: {
    name: 'Hobby',
    credits: 50_000,
    users: 1,
  },
  [SubscriptionPlan.TeamV1]: {
    name: 'Team',
    credits: 100_000,
    users: 5,
  },
  [SubscriptionPlan.EnterpriseV1]: {
    name: 'Enterprise',
    credits: 1_000_000,
    users: 1000,
  },
}