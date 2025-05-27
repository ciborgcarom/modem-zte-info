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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModemIPService = void 0;
const axios_1 = __importDefault(require("axios"));
class ModemIPService {
    constructor() {
        var _a;
        const ips = ((_a = process.env.MODEM_IPS) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
        this.possibleIPs = ips.map(ip => ip.trim());
    }
    findWorkingIP() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ip of this.possibleIPs) {
                try {
                    const url = `http://${ip}`;
                    const response = yield axios_1.default.get(url, { timeout: 2000 });
                    if (response.status === 200) {
                        return ip;
                    }
                }
                catch (error) {
                    console.log(`IP ${ip} não respondeu`);
                    continue;
                }
            }
            return null;
        });
    }
    getTestedIPs() {
        return this.possibleIPs;
    }
}
exports.ModemIPService = ModemIPService;
