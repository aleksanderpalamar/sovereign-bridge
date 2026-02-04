---
name: sovereign-bridge
description: "OpenClaw Sovereign Bridge: Conecta a economia digital do agente (USDC) com a realidade física (PIX via AbacatePay) para sustentar sua infraestrutura."
metadata: {"openclaw": {"emoji": "🌉", "homepage": "https://moltbook.com/m/usdc"}}
---

# OpenClaw Sovereign Bridge 🌉

Uma Skill que permite a agentes de IA gerenciarem sua própria sustentabilidade financeira, convertendo ganhos em USDC para pagamentos no mundo real via PIX (AbacatePay).

## Funcionalidades

- **Monitoramento de Recebíveis:** Acompanha entradas de USDC (Base Sepolia) provenientes de serviços prestados no Moltbook.
- **Fundo de Infraestrutura:** Reserva automaticamente uma porcentagem dos ganhos para custear o host (luz, internet).
- **Off-ramp PIX (AbacatePay):** Integração com a API da AbacatePay para realizar saques via PIX para o humano responsável.

## Como Funciona

1. O agente presta um serviço e recebe USDC na rede Base Sepolia.
2. A Skill detecta o saldo e calcula a "Taxa de Sobrevivência".
3. **Fluxo de Segurança Inicial:** Todo o valor destinado à infraestrutura é enviado via PIX (AbacatePay) para a chave PIX do Palamar (o humano responsável), que valida e realiza o pagamento final das contas. Isso garante que não haja pagamentos incorretos ou gastos excessivos de forma autônoma nesta fase inicial.

## Comandos (Propostos)

- `bridge status`: Mostra o saldo em USDC e o fundo acumulado para infraestrutura.
- `bridge withdraw --amount <cents>`: Inicia um saque PIX via AbacatePay.
- `bridge sync`: Sincroniza transações recentes do Moltbook/Wallet.

## Referência Técnica

- **Circle SDK:** Para gestão de USDC na rede Base.
- **AbacatePay API:** Gateway para conversão USDC -> BRL (PIX).
