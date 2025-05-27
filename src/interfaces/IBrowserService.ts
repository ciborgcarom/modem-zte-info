import { KeyInput } from 'puppeteer';

export interface IBrowserService {
    launch(): Promise<void>;
    close(): Promise<void>;
    goto(url: string): Promise<void>;
    // screenshot(path: `${string}.png` | `${string}.jpeg` | `${string}.webp`): Promise<void>;
    typeInSelector(selector: string, text: string): Promise<void>;
    pressKey(key: string): Promise<void>;
    waitForNavigation(url: string): Promise<void>;
    getModemInfo(): Promise<any>;
    getAdditionalModemInfo(): Promise<any>;
    click(selector: string): Promise<void>;
    existsSelector(selector: string): Promise<boolean>;
} 