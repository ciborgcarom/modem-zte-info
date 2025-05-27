"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./api/server");
require("dotenv/config");
// Função principal assíncrona que executa o fluxo de obtenção de informações do modem
// (async () => {
//     // Inicializa o serviço responsável por encontrar o IP do modem
//     // Busca um IP funcional do modem na rede
//     const modemIPService = new ModemIPService();
//     const workingIP = await modemIPService.findWorkingIP();
//     // Verifica se foi encontrado algum IP válido
//     if (!workingIP) {
//         const testedIPs = await modemIPService.getTestedIPs();
//         console.error('Nenhum IP do modem respondeu');
//         console.error('IPs testados:', testedIPs.join(', '));
//         process.exit(1);
//     }
//     console.log(`Modem encontrado no IP: ${workingIP}`);
//     // Inicializa o serviço do navegador Puppeteer e o caso de uso para obter informações do modem
//     const browserService = new PuppeteerBrowserService();
//     const zteModemInfo = new ZTEModemInfo(browserService);
//     // Constrói a URL de acesso à interface do modem
//     const url = `http://${workingIP}/index.html#login`;
//     // Executa a obtenção das informações do modem e exibe os resultados
//     const zte_info = await zteModemInfo.execute(url);
//     console.log('::: ZTE Modem Info :::', zte_info);
// })();
