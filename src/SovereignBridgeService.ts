import { IGatewayProvider, BridgeResponse, SovereignNodeTask } from './types';

export class SovereignBridgeService {
  private readonly INFRA_TAX_PERCENT = 0.30;
  private readonly MIN_WITHDRAW_CENTS = 350;
  private readonly STAKE_RATIO = 0.20; // 20% stake required from executor

  private tasks: Map<string, SovereignNodeTask> = new Map();
  private nodeReputation: Map<string, number> = new Map(); // local scores

  constructor(
    private readonly provider: IGatewayProvider,
    private readonly pixKey: string
  ) {}

  /**
   * 1. SUSTAINABILITY: Processes incoming digital value and bridges a portion to physical infrastructure
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

  /**
   * 2. NODE ORCHESTRATION: Create a task contract between nodes
   */
  async requestNodeService(requester: string, executor: string, service: string, amount: number): Promise<SovereignNodeTask> {
    const taskId = `task-${Date.now()}`;
    const stake = amount * this.STAKE_RATIO;

    const task: SovereignNodeTask = {
      id: taskId,
      requesterNode: requester,
      executorNode: executor,
      service,
      amount,
      stake,
      status: 'PENDING'
    };

    this.tasks.set(taskId, task);
    console.log(`[SNSC] Task ${taskId} created. Executor ${executor} must lock ${stake} USDC.`);
    return task;
  }

  /**
   * 3. SETTLEMENT: Verify proof and resolve task
   */
  async settleNodeTask(taskId: string, proof: string, isValid: boolean): Promise<BridgeResponse<SovereignNodeTask>> {
    const task = this.tasks.get(taskId);
    if (!task) return { success: false, error: 'Task not found' };

    task.proof = proof;

    if (isValid) {
      task.status = 'COMPLETED';
      this.updateReputation(task.executorNode, 10);
      console.log(`[SNSC] Task ${taskId} COMPLETED. Paying ${task.amount} to ${task.executorNode}. Stake returned.`);
    } else {
      task.status = 'SLASHED';
      this.updateReputation(task.executorNode, -25);
      console.log(`[SNSC] Task ${taskId} SLASHED! Penalty of ${task.stake} USDC moved to infra fund.`);
      // In a real scenario, we'd trigger a transfer of the stake to the contingency/infra wallet
    }

    return { success: true, data: task };
  }

  private updateReputation(nodeId: string, delta: number) {
    const current = this.nodeReputation.get(nodeId) || 50; // starts at 50
    this.nodeReputation.set(nodeId, Math.max(0, Math.min(100, current + delta)));
  }

  getNodeStats() {
    return {
      activeTasks: Array.from(this.tasks.values()).filter(t => t.status === 'PENDING').length,
      reputations: Object.fromEntries(this.nodeReputation)
    };
  }
}
