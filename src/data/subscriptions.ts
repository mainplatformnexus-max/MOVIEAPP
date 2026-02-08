export interface SubscriptionPlan {
  id: string;
  plan: "normal" | "agent";
  duration: "1day" | "1week" | "1month";
  label: string;
  price: number;
  currency: string;
  features: string[];
}

export const normalPlans: SubscriptionPlan[] = [
  {
    id: "normal-1day",
    plan: "normal",
    duration: "1day",
    label: "1 Day",
    price: 5000,
    currency: "UGX",
    features: ["Access all movies", "Access all TV shows", "HD streaming", "Download for offline"],
  },
  {
    id: "normal-1week",
    plan: "normal",
    duration: "1week",
    label: "1 Week",
    price: 10000,
    currency: "UGX",
    features: ["Access all movies", "Access all TV shows", "HD streaming", "Download for offline", "No ads"],
  },
  {
    id: "normal-1month",
    plan: "normal",
    duration: "1month",
    label: "1 Month",
    price: 25000,
    currency: "UGX",
    features: ["Access all movies", "Access all TV shows", "Full HD streaming", "Download for offline", "No ads", "Priority support"],
  },
];

export const agentPlans: SubscriptionPlan[] = [
  {
    id: "agent-1week",
    plan: "agent",
    duration: "1week",
    label: "1 Week",
    price: 20000,
    currency: "UGX",
    features: ["Early access to new movies", "All Normal plan features", "Agent badge", "Priority streaming", "Exclusive content"],
  },
  {
    id: "agent-1month",
    plan: "agent",
    duration: "1month",
    label: "1 Month",
    price: 50000,
    currency: "UGX",
    features: ["Early access to new movies", "All Normal plan features", "Agent badge", "Priority streaming", "Exclusive content", "Agent-only releases"],
  },
];

export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString()}`;
}
