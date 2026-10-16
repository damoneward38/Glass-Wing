export type PlanType = 'starter' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanDetails {
  id: PlanType;
  name: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  description: string;
  features: string[];
  inactiveFeatures?: string[];
  popular?: boolean;
}

export interface Order {
  orderId: string;
  customerEmail: string;
  customerName: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  amount: number;
  status: 'completed' | 'processing' | 'refunded';
  licenseKey: string;
  paymentMethod: string;
  createdAt: string;
}

export interface License {
  key: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  plan: PlanType;
  seats: number;
  active: boolean;
  createdAt: string;
  lastActivatedAt?: string;
}

export interface AdminUser {
  email: string;
  role: 'admin';
  displayName: string;
  token: string;
}
