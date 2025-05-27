import { IBrowserService } from '../interfaces/IBrowserService';

export class ZTEModemInfo {
  constructor(private browserService: IBrowserService) {}

  async execute(url: string): Promise<any> {
    try {
      console.log('Iniciando execução...');
      await this.browserService.launch();
      console.log('Browser iniciado');
      
      // await this.browserService.goto(url);
      // console.log('Página carregada');
      
      // Garante que não há sessão corrente
      await this.logoutAutomatizado(url);
      
      const password = process.env.MODEM_PASSWORD || 'vivo';
      await this.browserService.typeInSelector('input[type="password"]', password);
      console.log('Senha digitada');
      
      await this.browserService.pressKey('Enter');
      console.log('Enter pressionado');
      
      await this.browserService.waitForNavigation('http://192.168.1.1/index.html#home');
      console.log('Navegação concluída');
      
      // Obtém informações do modem
      const modemInfo       = await this.browserService.getModemInfo();
      const additionalInfo  = await this.browserService.getAdditionalModemInfo();
      
      // Combina o resultado das requisições
      const combinedInfo = {...modemInfo, ...additionalInfo};
      
      // Realiza o logout
      await this.browserService.click('#logoutlink');
      console.log('Logout realizado');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.browserService.click('#yesbtn');
      console.log('Confirmação de logout realizada');
      
      return combinedInfo;
      
    } catch (error) {
      console.error('Erro ao obter dados:', error);
      throw error;
    } finally {
      await this.browserService.close();
      console.log('Browser fechado');
    }
  }

  private async logoutAutomatizado(url: string): Promise<boolean> {
    console.log('[logoutAutomatizado] Acessando página inicial do modem...');

    await this.browserService.goto(url);
    console.log('[logoutAutomatizado] Página inicial do modem carregada');

    // Aguarda a URL mudar para #login ou #home
    console.log('[logoutAutomatizado] Aguardando a URL mudar para #login ou #home...');
    let urlAtual = '';
    for (let tentativas = 0; tentativas < 10; tentativas++) {
      urlAtual = (this.browserService as any).page?.url?.() || '';
      if (urlAtual.endsWith('#login') || urlAtual.endsWith('#home')) break;
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`[logoutAutomatizado] URL atual após navegação: ${urlAtual}`);
    if (urlAtual.endsWith('#login')) {
      console.log('[logoutAutomatizado] Já está na tela de login, não é necessário logout.');
      return true;
    }

    if (urlAtual.endsWith('#home')) {
      console.log('[logoutAutomatizado] Sessão ativa detectada, realizando logout...');
      const existeLogout = await this.browserService.existsSelector('#logoutlink');
      if (!existeLogout) {
        console.log('[logoutAutomatizado] Botão de logout não encontrado, abortando.');
        return false;
      }
      await this.browserService.click('#logoutlink');
      console.log('[logoutAutomatizado] Aguardando 1s para confirmação do modal...');
      await new Promise(r => setTimeout(r, 1000));
      await this.browserService.click('#yesbtn');
      console.log('[logoutAutomatizado] Aguardando 2s para efetivação do logout...');
      await new Promise(r => setTimeout(r, 2000));

      // Após logout, recursivamente garantir que está na tela de login
      return this.logoutAutomatizado(url);
    }

    console.log('[logoutAutomatizado] Não foi possível determinar o estado da sessão.');
    return false;
  }

  
} 