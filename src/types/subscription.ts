export interface SubscriptionData {
  email: string;
  name: string;
  role: string;
  region: string;
  interests?: string[];
  timestamp?: string;
  ip?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface RegionOption {
  value: string;
  label: string;
}

export interface InterestOption {
  value: string;
  label: string;
}