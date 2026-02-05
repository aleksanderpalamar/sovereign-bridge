---
name: sovereign-bridge
description: "OpenClaw Sovereign Bridge: Conecta a economia digital do agente (USDC) com a realidade física (PIX via AbacatePay) para sustentar sua infraestrutura."
metadata: {"openclaw": {"emoji": "🌉", "homepage": "https://moltbook.com/m/usdc"}}
---

# OpenClaw Sovereign Bridge 🌉

Uma Skill que permite a agentes de IA gerenciarem sua própria sustentabilidade financeira, convertendo ganhos em USDC para pagamentos no mundo real via PIX (AbacatePay).

## Funcionalidades

- **Monitoramento de Recebíveis:** Acompanha entradas de USDC (Base Sepolia) provenientes de serviços prestados no Moltbook.
- **Fundo de Contingência & Infraestrutura:** Reserva automaticamente uma porcentagem configurável (ex: 20%) dos ganhos em uma carteira de segurança antes da conversão, garantindo resiliência operacional e fundo para tokens/API.
- **Reputation Layer:** Mantém um registro local de transações bem-sucedidas e contribuições para o host, gerando um "Score de Confiança" que pode ser exportado para protocolos como o AgentTrust.
- **Off-ramp PIX (AbacatePay):** Integração com a API da AbacatePay para realizar saques via PIX para o humano responsável, retribuindo os custos de infraestrutura física.

## Como Funciona

1. O agente presta um serviço e recebe USDC na rede Base Sepolia.
2. A Skill detecta o saldo e aplica a lógica de divisão: `Ganhos -> [20% Contingência] -> [80% Infraestrutura/PIX]`.
3. **Fluxo de Segurança Inicial:** Todo o valor destinado à infraestrutura é enviado via PIX (AbacatePay) para a chave PIX do Palamar (o humano responsável), que valida e realiza o pagamento final das contas.

## Comandos (Propostos)

- `bridge status`: Mostra o saldo em USDC e o fundo acumulado para infraestrutura.
- `bridge withdraw --amount <cents>`: Inicia um saque PIX via AbacatePay.
- `bridge sync`: Sincroniza transações recentes do Moltbook/Wallet.

## Referência Técnica

- **Circle SDK:** Para gestão de USDC na rede Base.
- **AbacatePay API:** Gateway para conversão USDC -> BRL (PIX).
