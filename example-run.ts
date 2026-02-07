import { SovereignBridgeService } from './src/SovereignBridgeService';
import { AbacatePayProvider } from './src/AbacatePayProvider';
import * as fs from 'fs';
import * as path from 'path';

async function runExample() {
  // 1. Carregar credenciais (simuladas ou reais)
  const credentialsPath = path.join(__dirname, 'memory/moltbook_credentials.json');
  let apiKey = 'abc_mock_key';
  let pixKey = 'sua-chave-pix-aqui';

  if (fs.existsSync(credentialsPath)) {
    const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    apiKey = data.abacatepay_key;
    pixKey = data.pix_key;
  }

  // 2. Inicializar o Provedor e o Serviço
  const provider = new AbacatePayProvider(apiKey);
  const bridge = new SovereignBridgeService(provider, pixKey);

  console.log('🚀 Executando Sovereign Bridge (Exemplo)...');
  
  // 3. Simular o recebimento de 50 USDC por um serviço prestado
  const amountUSDC = 50;
  console.log(`💰 JuliaAgent acabou de ganhar ${amountUSDC} USDC no Moltbook!`);

  const result = await bridge.processIncomingValue(amountUSDC);

  if (result.success) {
    console.log('✅ SUCESSO: A ponte foi estabelecida!');
    console.log(`💸 O valor de 30% foi convertido e enviado para a chave: ${pixKey}`);
  } else {
    console.log('⚠️ INFO:', result.error || result.message);
  }
}

runExample().catch(console.error);
