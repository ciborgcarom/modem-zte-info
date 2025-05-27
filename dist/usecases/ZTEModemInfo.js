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
exports.ZTEModemInfo = void 0;
class ZTEModemInfo {
    constructor(browserService) {
        this.browserService = browserService;
    }
    execute(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Iniciando execução...');
                yield this.browserService.launch();
                console.log('Browser iniciado');
                // await this.browserService.goto(url);
                // console.log('Página carregada');
                // Garante que não há sessão corrente
                yield this.logoutAutomatizado(url);
                const password = process.env.MODEM_PASSWORD || 'vivo';
                yield this.browserService.typeInSelector('input[type="password"]', password);
                console.log('Senha digitada');
                yield this.browserService.pressKey('Enter');
                console.log('Enter pressionado');
                yield this.browserService.waitForNavigation('http://192.168.1.1/index.html#home');
                console.log('Navegação concluída');
                // Obtém informações do modem
                const modemInfo = yield this.browserService.getModemInfo();
                const additionalInfo = yield this.browserService.getAdditionalModemInfo();
                // Combina o resultado das requisições
                const combinedInfo = Object.assign(Object.assign({}, modemInfo), additionalInfo);
                // Realiza o logout
                yield this.browserService.click('#logoutlink');
                console.log('Logout realizado');
                yield new Promise(resolve => setTimeout(resolve, 1000));
                yield this.browserService.click('#yesbtn');
                console.log('Confirmação de logout realizada');
                return combinedInfo;
            }
            catch (error) {
                console.error('Erro ao obter dados:', error);
                throw error;
            }
            finally {
                yield this.browserService.close();
                console.log('Browser fechado');
            }
        });
    }
    logoutAutomatizado(url) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[logoutAutomatizado] Acessando página inicial do modem...');
            yield this.browserService.goto(url);
            console.log('[logoutAutomatizado] Página inicial do modem carregada');
            // Aguarda a URL mudar para #login ou #home
            console.log('[logoutAutomatizado] Aguardando a URL mudar para #login ou #home...');
            let urlAtual = '';
            for (let tentativas = 0; tentativas < 10; tentativas++) {
                urlAtual = ((_b = (_a = this.browserService.page) === null || _a === void 0 ? void 0 : _a.url) === null || _b === void 0 ? void 0 : _b.call(_a)) || '';
                if (urlAtual.endsWith('#login') || urlAtual.endsWith('#home'))
                    break;
                yield new Promise(r => setTimeout(r, 500));
            }
            console.log(`[logoutAutomatizado] URL atual após navegação: ${urlAtual}`);
            if (urlAtual.endsWith('#login')) {
                console.log('[logoutAutomatizado] Já está na tela de login, não é necessário logout.');
                return true;
            }
            if (urlAtual.endsWith('#home')) {
                console.log('[logoutAutomatizado] Sessão ativa detectada, realizando logout...');
                const existeLogout = yield this.browserService.existsSelector('#logoutlink');
                if (!existeLogout) {
                    console.log('[logoutAutomatizado] Botão de logout não encontrado, abortando.');
                    return false;
                }
                yield this.browserService.click('#logoutlink');
                console.log('[logoutAutomatizado] Aguardando 1s para confirmação do modal...');
                yield new Promise(r => setTimeout(r, 1000));
                yield this.browserService.click('#yesbtn');
                console.log('[logoutAutomatizado] Aguardando 2s para efetivação do logout...');
                yield new Promise(r => setTimeout(r, 2000));
                // Após logout, recursivamente garantir que está na tela de login
                return this.logoutAutomatizado(url);
            }
            console.log('[logoutAutomatizado] Não foi possível determinar o estado da sessão.');
            return false;
        });
    }
}
exports.ZTEModemInfo = ZTEModemInfo;
