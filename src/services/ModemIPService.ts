import axios from 'axios';

export class ModemIPService {
    private readonly possibleIPs: string[];

    constructor() {
        const ips = process.env.MODEM_IPS?.split(',') || [];
        this.possibleIPs = ips.map(ip => ip.trim());
    }

    async findWorkingIP(): Promise<string | null> {
        for (const ip of this.possibleIPs) {
            try {
                const url = `http://${ip}`;
                const response = await axios.get(url, { timeout: 2000 });
                if (response.status === 200) {
                    return ip;
                }
            } catch (error) {
                console.log(`IP ${ip} não respondeu`);
                continue;
            }
        }
        return null;
    }

    getTestedIPs(): string[] {
        return this.possibleIPs;
    }
} 