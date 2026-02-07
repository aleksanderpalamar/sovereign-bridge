export interface BillingRequest {
  amount: number;
  methods: string[];
  customer: { email: string };
}

export interface WithdrawRequest {
  externalId: string;
  method: "PIX";
  amount: number;
  pix: {
    key: string;
  };
  description?: string;
}

export interface BridgeResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IGatewayProvider {
  createBilling(amount: number, email: string): Promise<BridgeResponse<any>>;
  createWithdraw(amount: number, pixKey: string, externalId: string): Promise<BridgeResponse<any>>;
}

export interface SovereignNodeTask {
  id: string;
  requesterNode: string;
  executorNode: string;
  service: string;
  amount: number;
  stake: number;
  status: 'PENDING' | 'LOCKED' | 'COMPLETED' | 'SLASHED';
  proof?: string;
}
