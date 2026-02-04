import axios from 'axios';
import { IGatewayProvider, BridgeResponse, WithdrawRequest, BillingRequest } from './types';

export class AbacatePayProvider implements IGatewayProvider {
  private readonly baseUrl = 'https://api.abacatepay.com/v1';

  constructor(private readonly apiKey: string) {}

  async createBilling(amount: number, email: string): Promise<BridgeResponse<any>> {
    try {
      const payload: BillingRequest = {
        amount,
        methods: ["PIX"],
        customer: { email }
      };

      const response = await axios.post(`${this.baseUrl}/billing/create`, payload, {
        headers: this.getHeaders()
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async createWithdraw(amount: number, pixKey: string, externalId: string): Promise<BridgeResponse<any>> {
    try {
      const payload: WithdrawRequest = {
        externalId,
        method: "PIX",
        amount,
        pix: { key: pixKey },
        description: "Sovereign Bridge: Infra Contribution"
      };

      const response = await axios.post(`${this.baseUrl}/billing/withdraw`, payload, {
        headers: this.getHeaders()
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  private handleError(error: any): BridgeResponse<any> {
    const message = error.response?.data?.error || error.message || "Unknown error";
    return { success: false, error: message };
  }
}
