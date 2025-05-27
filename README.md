# ZTE Modem Info API

API e CLI para extração automatizada de informações de modems ZTE via interface web, utilizando Puppeteer.

## Objetivo

Automatizar a coleta de informações detalhadas de modems ZTE conectados à rede local, expondo esses dados via API REST e/ou CLI. Ideal para inventário, troubleshooting, monitoramento ou integração com sistemas de gestão.

## Funcionalidades
- Descoberta automática do IP do modem (varre uma lista de IPs configurável)
- Login automatizado na interface web do modem
- Coleta de informações detalhadas (IMEI, IMSI, sinal, firmware, SSID, IPs, status, etc)
- Logout seguro após a coleta
- Exposição dos dados via endpoint HTTP REST
- Possibilidade de rodar via CLI (ajuste o main.ts para uso direto)

## Tecnologias
- Node.js + TypeScript
- Puppeteer (browser headless)
- Express (API REST)
- Axios

## Instalação

```bash
git clone https://github.com/seu-usuario/zte-info.git
cd zte-info
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
# Lista de IPs possíveis do modem, separados por vírgula
MODEM_IPS=192.168.0.1,192.168.1.1,192.168.8.1

# Senha de acesso ao modem (padrão: vivo)
MODEM_PASSWORD=vivo

# Porta da API
APP_PORT=3000

# Executar Puppeteer em modo headless (true/false)
PUPPETEER_HEADLESS=true

# Timeout do Puppeteer (ms)
PUPPETEER_TIMEOUT=30000
```

## Uso

### API REST

Inicie a API:

```bash
npm start
```

Acesse:

```
GET http://localhost:3000/api/zte-info
```

Retorna um JSON com todas as informações extraídas do modem.

### CLI (opcional)

Descomente o bloco principal em `src/main.ts` para rodar via linha de comando:

```bash
npm run build
node dist/main.js
```

## Estrutura do Projeto

- `src/services/` — Serviços de browser (Puppeteer) e descoberta de IP
- `src/usecases/` — Lógica de extração de dados do modem
- `src/api/` — API Express
- `src/zte.ts` — Função principal de orquestração
- `src/main.ts` — Ponto de entrada (API e/ou CLI)

## Requisitos
- Node.js >= 18
- npm >= 9
- Dependências do Puppeteer (verifique se o ambiente suporta Chromium headless)

## Dicas e Observações
- O modem deve estar acessível na rede local e com a interface web habilitada
- O usuário/senha padrão pode variar conforme o provedor/modelo
- Para depuração, ajuste `PUPPETEER_HEADLESS=false` e veja o browser em ação
- O projeto pode ser facilmente adaptado para outros modelos de modem ZTE

## Licença

ISC. Veja LICENSE para detalhes.

---

Dúvidas, sugestões ou PRs são bem-vindos! 