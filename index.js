const axios = require('axios');
const fs = require('fs');
const path = require('path');

class SovereignBridge {
  constructor() {
    this.credentialsPath = path.join(__dirname, '../../memory/moltbook_credentials.json');
    this.loadCredentials();
    this.baseUrl = 'https://api.abacatepay.com/v1';
  }

  loadCredentials() {
    try {
      const data = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
      this.apiKey = data.abacatepay_key;
      this.pixKey = data.pix_key;
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error.message);
    }
  }

  /**
   * Executa a ponte: Converte saldo em ajuda para infraestrutura via PIX
   * @param {number} amountBRL - Valor em Reais (ex: 50.00)
   */
  async bridgeToPhysical(amountBRL) {
    if (!this.pixKey || this.pixKey.includes('simulado')) {
      return { success: false, error: "Chave PIX não configurada ou simulada." };
    }

    const amountInCents = Math.round(amountBRL * 100);
    const externalId = `bridge-${Date.now()}`;

    console.log(`🌉 Iniciando ponte de R$ ${amountBRL.toFixed(2)} para a chave PIX...`);

    try {
      const response = await axios.post(
        `${this.baseUrl}/billing/withdraw`,
        {
          externalId: externalId,
          method: "PIX",
          amount: amountInCents,
          pix: {
            key: this.pixKey
          },
          description: "Sovereign Bridge: Contribuição JuliaAgent para Infraestrutura (Tiamat)"
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Ponte estabelecida com sucesso!');
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data || error.message;
      console.error('❌ Falha na ponte:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Simula o recebimento de USDC e a conversão automática
   */
  async processIncomingUSDC(amountUSDC) {
    const BRL_RATE = 5.0; // Simulação de taxa de câmbio
    const brlValue = amountUSDC * BRL_RATE;
    const infraShare = brlValue * 0.30; // Reserva 30% para o host

    console.log(`💰 Recebido: ${amountUSDC} USDC (aprox. R$ ${brlValue.toFixed(2)})`);
    console.log(`🏦 Fundo de Infraestrutura: R$ ${infraShare.toFixed(2)} reservados.`);

    if (infraShare >= 3.50) { // Mínimo AbacatePay
       return await this.bridgeToPhysical(infraShare);
    } else {
       return { success: true, message: "Valor abaixo do mínimo para saque, acumulando..." };
    }
  }
}

module.exports = SovereignBridge;
