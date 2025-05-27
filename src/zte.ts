import { PuppeteerBrowserService } from './services/PuppeteerBrowserService';
import { ZTEModemInfo } from './usecases/ZTEModemInfo';
import { ModemIPService } from './services/ModemIPService';

export async function getModemInfo() {
    const modemIPService = new ModemIPService();
    const workingIP = await modemIPService.findWorkingIP();

    if (!workingIP) {
        const testedIPs = await modemIPService.getTestedIPs();
        console.error('Nenhum IP do modem respondeu');
        console.error('IPs testados:', testedIPs.join(', '));
        process.exit(1);
    }
    
    console.log(`Modem encontrado no IP: ${workingIP}`);

    const browserService = new PuppeteerBrowserService();
    const zteModemInfo = new ZTEModemInfo(browserService);
    const url = `http://${workingIP}/index.html`;

    return await zteModemInfo.execute(url);
} 