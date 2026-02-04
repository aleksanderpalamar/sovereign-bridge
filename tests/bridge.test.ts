import { SovereignBridgeService } from '../src/SovereignBridgeService';
import { IGatewayProvider, BridgeResponse } from '../src/types';

class MockProvider implements IGatewayProvider {
  async createBilling(amount: number, email: string): Promise<BridgeResponse<any>> {
    return { success: true, data: { id: 'test-bill' } };
  }
  async createWithdraw(amount: number, pixKey: string, externalId: string): Promise<BridgeResponse<any>> {
    if (pixKey === 'invalid') return { success: false, error: 'Invalid PIX Key' };
    return { success: true, data: { id: 'test-withdraw', amount } };
  }
}

describe('SovereignBridgeService', () => {
  const mockProvider = new MockProvider();
  const service = new SovereignBridgeService(mockProvider, 'valid-pix-key');

  it('should not bridge if amount is below minimum', async () => {
    // 1 USDC * 5.0 * 0.3 = R$ 1.50 (150 cents) < 350 cents
    const result = await service.processIncomingValue(1);
    expect(result.success).toBe(true);
    expect(result.error).toContain('below minimum');
  });

  it('should bridge if amount is above minimum', async () => {
    // 10 USDC * 5.0 * 0.3 = R$ 15.00 (1500 cents) > 350 cents
    const result = await service.processIncomingValue(10);
    expect(result.success).toBe(true);
    expect(result.data.amount).toBe(1500);
  });

  it('should handle provider errors', async () => {
    const errorService = new SovereignBridgeService(mockProvider, 'invalid');
    const result = await errorService.processIncomingValue(10);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid PIX Key');
  });
});
