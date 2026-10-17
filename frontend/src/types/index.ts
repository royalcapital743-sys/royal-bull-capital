export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'customer';
  referral_code: string;
  referrer_id: string | null;
  status: 'active' | 'suspended';
  is_verified: boolean;
  created_at: string;
}

export interface Wallet {
  user_id: string;
  original_principal_cents: number;
  principal_credits_cents: number;
  roi_balance_cents: number;
  direct_bonus_cents: number;
  level_commission_cents: number;
  withdrawn_total_cents: number;
  total_balance_cents: number;
  withdrawable_balance_cents: number;
}

export interface ProfileResponse {
  user: User;
  wallet: Wallet;
  direct_referrals_count: number;
  qualified_referrals_count: number;
  is_qualified: boolean;
  total_network_count: number;
}

export interface Deposit {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  amount_cents: number;
  amount_usd: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  note: string | null;
  created_at: string;
  confirmed_at: string | null;
}

export interface Commission {
  id: string;
  deposit_id: string;
  source_user_id: string;
  source_user_name?: string;
  recipient_user_id: string;
  level: number;
  commission_type: 'direct_bonus' | 'level_commission';
  rate_percent: number;
  base_cents: number;
  amount_cents: number;
  status: 'credited' | 'reversed';
  created_at: string;
}

export interface ReferralNode {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  level: number;
  status: string;
  has_funded_deposit: boolean;
  funded_amount_cents: number;
  created_at: string;
}

export interface ReferralLevelSummary {
  level: number;
  rate_percent: number;
  members_count: number;
  funded_members_count: number;
  total_commissions_cents: number;
}

export interface ReferralNetworkResponse {
  referral_code: string;
  referral_link: string;
  total_direct_count: number;
  qualified_direct_count: number;
  is_qualified: boolean;
  total_network_count: number;
  levels_summary: ReferralLevelSummary[];
  members: ReferralNode[];
}

export interface LedgerEntry {
  id: string;
  user_id: string;
  entry_type: string;
  amount_cents: number;
  balance_after_cents: number;
  description: string;
  reference_id: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  amount_cents: number;
  amount_usd: number;
  principal_portion_cents: number;
  roi_portion_cents: number;
  commission_portion_cents: number;
  is_early_withdrawal: boolean;
  month_key: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  payout_method: string;
  payout_details: string | null;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notif_type: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  sender_role: string;
  message: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: SupportMessage[];
}

export interface SystemRules {
  direct_bonus: number;
  level_rates: number[];
  monthly_roi: number;
  monthly_principal: number;
  minimum_deposit: number;
  min_withdrawal: number;
  max_withdrawal: number;
  demo_mode_active: boolean;
  last_monthly_run: string | null;
}

export interface MonthlyCycleRun {
  id: string;
  month_key: string;
  total_eligible_deposits: number;
  total_roi_usd: number;
  total_principal_usd: number;
  status: string;
  executed_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  detail: string | null;
  created_at: string;
}

export interface PublicStats {
  platform_name: string;
  tagline: string;
  demo_mode?: boolean;
  total_registered_users: number;
  total_deposits_usd?: number;
  total_commissions_usd?: number;
  total_withdrawals_usd?: number;
  total_demo_deposits_usd: number;
  total_demo_commissions_usd: number;
  total_demo_withdrawals_usd: number;
  level_commission_total_rate: number;
  direct_bonus_rate: number;
}
