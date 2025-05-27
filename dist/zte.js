"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModemInfo = void 0;
const PuppeteerBrowserService_1 = require("./services/PuppeteerBrowserService");
const ZTEModemInfo_1 = require("./usecases/ZTEModemInfo");
const ModemIPService_1 = require("./services/ModemIPService");
function getModemInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const modemIPService = new ModemIPService_1.ModemIPService();
        const workingIP = yield modemIPService.findWorkingIP();
        if (!workingIP) {
            const testedIPs = yield modemIPService.getTestedIPs();
            console.error('Nenhum IP do modem respondeu');
            console.error('IPs testados:', testedIPs.join(', '));
            process.exit(1);
        }
        console.log(`Modem encontrado no IP: ${workingIP}`);
        const browserService = new PuppeteerBrowserService_1.PuppeteerBrowserService();
        const zteModemInfo = new ZTEModemInfo_1.ZTEModemInfo(browserService);
        const url = `http://${workingIP}/index.html`;
        return yield zteModemInfo.execute(url);
    });
}
exports.getModemInfo = getModemInfo;
