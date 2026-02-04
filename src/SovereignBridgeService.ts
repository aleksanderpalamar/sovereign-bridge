import { IGatewayProvider, BridgeResponse } from './types';

export class SovereignBridgeService {
  private readonly INFRA_TAX_PERCENT = 0.30;
  private readonly MIN_WITHDRAW_CENTS = 350;

  constructor(
    private readonly provider: IGatewayProvider,
    private readonly pixKey: string
  ) {}

  /**
   * Processes incoming digital value and bridges a portion to physical infrastructure
   * @param amountUSDC - Amount received in USDC
   * @param brlExchangeRate - Simulation rate (e.g. 5.0)
   */
  async processIncomingValue(amountUSDC: number, brlExchangeRate: number = 5.0): Promise<BridgeResponse<any>> {
    const brlValue = amountUSDC * brlExchangeRate;
    const infraShare = Math.round(brlValue * this.INFRA_TAX_PERCENT * 100);

    console.log(`[Bridge] Processing ${amountUSDC} USDC. BRL Value: R$ ${brlValue.toFixed(2)}`);
    
    if (infraShare < this.MIN_WITHDRAW_CENTS) {
      return { 
        success: true, 
        error: `Share R$ ${(infraShare/100).toFixed(2)} below minimum R$ ${(this.MIN_WITHDRAW_CENTS/100).toFixed(2)}` 
      };
    }

    const externalId = `bridge-${Date.now()}`;
    return await this.provider.createWithdraw(infraShare, this.pixKey, externalId);
  }
}
