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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const zte_1 = require("../zte");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.APP_PORT || 3000;
app.use(express_1.default.json());
app.get('/api/zte-info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modemInfo = yield (0, zte_1.getModemInfo)();
        res.json(modemInfo);
    }
    catch (error) {
        console.error('Erro ao obter informações do modem:', error);
        res.status(500).json({ error: 'Erro ao obter informações do modem' });
    }
}));
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Para obter as informações do modem, faça uma requisição GET em: http://localhost:${port}/api/zte-info`);
});
