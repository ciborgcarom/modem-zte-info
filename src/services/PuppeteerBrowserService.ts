import puppeteer, { Browser, Page, KeyInput } from 'puppeteer';
import { IBrowserService } from '../interfaces/IBrowserService';

export class PuppeteerBrowserService implements IBrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async launch(): Promise<void> {
    const headless = process.env.PUPPETEER_HEADLESS === 'true';
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    this.browser = await puppeteer.launch({ 
      headless,
      ...(executablePath ? { executablePath } : {}),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
        '--disable-dev-shm-usage'
      ]
    });
    this.page = await this.browser.newPage();
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async goto(url: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');
    await this.page.goto(url, { waitUntil: 'networkidle0' });
  }

  // async screenshot(path: `${string}.png` | `${string}.jpeg` | `${string}.webp`): Promise<void> {
  //   if (!this.page) throw new Error('Browser not launched');
  //   await this.page.screenshot({ path });
  // }

  private async waitForSelector(selector: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');
    const timeout = parseInt(process.env.PUPPETEER_TIMEOUT || '30000');
    await this.page.waitForSelector(selector, { timeout });
  }

  async typeInSelector(selector: string, text: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');
    await this.waitForSelector(selector);
    await this.page.type(selector, text);
  }

  async pressKey(key: KeyInput): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');
    await this.page.keyboard.press(key);
  }

  async waitForNavigation(url: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');
    await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    const currentUrl = this.page.url();
    if (!currentUrl.includes(url)) {
      throw new Error(`Expected to be redirected to ${url}, but got ${currentUrl}`);
    }
  }

  async click(selector: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');
    await this.waitForSelector(selector);
    await this.page.click(selector);
  }

  async getModemInfo(): Promise<any> {
    if (!this.page) throw new Error('Browser not launched');
    
    // Aguarda 5 segundos após a autenticação
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const response = await this.page.evaluate(() => {
      return new Promise((resolve, reject) => {
        fetch('/goform/goform_get_cmd_process?isTest=false&cmd=wifi_coverage%2Cm_ssid_enable%2Cimei%2Cnetwork_type%2Crssi%2Crscp%2Clte_rsrp%2Cimsi%2Csim_imsi%2Ccr_version%2Cwa_version%2Chardware_version%2Cweb_version%2Cwa_inner_version%2CMAX_Access_num%2CSSID1%2CAuthMode%2CWPAPSK1_encode%2Cm_SSID%2Cm_AuthMode%2Cm_HideSSID%2Cm_WPAPSK1_encode%2Cm_MAX_Access_num%2Clan_ipaddr%2Cmac_address%2Cmsisdn%2CLocalDomain%2Cwan_ipaddr%2Cstatic_wan_ipaddr%2Cipv6_wan_ipaddr%2Cipv6_pdp_type%2Cpdp_type%2Copms_wan_mode%2Cppp_status&multi_data=1', {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'X-Requested-With': 'XMLHttpRequest',
            'Pragma': 'no-cache'
          }
        })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
      });
    });

    // console.log('Informações do modem:', JSON.stringify(response, null, 2));
    return response;
  }

  async getAdditionalModemInfo(): Promise<any> {
    if (!this.page) throw new Error('Browser not launched');
    
    const response = await this.page.evaluate(() => {
      return new Promise((resolve, reject) => {
        fetch('/goform/goform_get_cmd_process?multi_data=1&isTest=false&sms_received_flag_flag=0&sts_received_flag_flag=0&cmd=modem_main_state%2Cpin_status%2Copms_wan_mode%2Cloginfo%2Cnew_version_state%2Ccurrent_upgrade_state%2Cis_mandatory%2Cwifi_dfs_status%2Cbattery_value%2Csignalbar%2Cnetwork_type%2Cnetwork_provider%2Cppp_status%2CEX_SSID1%2Csta_ip_status%2CEX_wifi_profile%2Cm_ssid_enable%2CRadioOff%2CSSID1%2Csimcard_roam%2Clan_ipaddr%2Cstation_mac%2Cbattery_charging%2Cbattery_vol_percent%2Cbattery_pers%2Cspn_name_data%2Cspn_b1_flag%2Cspn_b2_flag%2Crealtime_tx_bytes%2Crealtime_rx_bytes%2Crealtime_time%2Crealtime_tx_thrpt%2Crealtime_rx_thrpt%2Cmonthly_rx_bytes%2Cmonthly_tx_bytes%2Cmonthly_time%2Cdate_month%2Cdata_volume_limit_switch%2Cdata_volume_limit_size%2Cdata_volume_alert_percent%2Cdata_volume_limit_unit%2Croam_setting_option%2Cupg_roam_switch%2Cssid%2Cwifi_enable%2Cwifi_5g_enable%2Ccheck_web_conflict%2Cdial_mode%2Clac_code%2Csms_received_flag%2Csts_received_flag%2Csms_unread_num&_=1748353009137', {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'keep-alive',
            'Referer': window.location.origin + '/index.html'
          }
        })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
      });
    });

    // console.log('Informações adicionais do modem:', JSON.stringify(response, null, 2));
    return response;
  }

  async existsSelector(selector: string): Promise<boolean> {
    if (!this.page) throw new Error('Browser not launched');
    return await this.page.$(selector) !== null;
  }
} 