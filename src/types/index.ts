export interface TelecomOperator {
  id: string;
  name: string;
  logo_url?: string;
  created_at?: string;
}

export interface RechargePlan {
  id: string;
  name: string;
  operator_id: string;
  amount: number;
  validity_days: number;
  data: string;
  calls: string;
  sms: string;
  description?: string;
  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FinancingOption {
  id: string;
  plan_id: string;
  discounted_price: number;
  initial_payment: number;
  emi_amount: number;
  emi_count: number;
  gst_percentage: number;
  processing_fee: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserRecharge {
  id: string;
  user_id: string;
  plan_id: string;
  phone_number: string;
  total_amount: number;
  wallet_amount_used: number;
  payment_status: string;
  transaction_id?: string;
  is_financing: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EMITransaction {
  id: string;
  recharge_id: string;
  user_id: string;
  financing_id: string;
  amount: number;
  emi_number: number;
  due_date: string;
  payment_status: string;
  transaction_id?: string;
  payment_date?: string;
  reminder_sent?: boolean;
  created_at?: string;
  updated_at?: string;
  user_recharges?: {
    plan_id: string;
    phone_number: string;
  };
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  reference?: string;
  created_at?: string;
}

export interface Plan {
  id: string;
  name: string;
  provider: string;
  amount: number;
  isThreeMonth: boolean;
  data: string;
  calls: string;
  sms: string;
  validity: string;
}
