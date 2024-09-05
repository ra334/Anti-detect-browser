import { Builder } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import proxy from 'selenium-webdriver/proxy.js'
import checkPort from './utils/checkPort.js'
import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

import proxyChain from 'proxy-chain'

const CHROME_PATH = '../drivers/Chrome/chrome.exe'
const CHROMIUM_PATH = '../drivers/Chromium/chrome.exe'

async function getPort(profileID) {
    let port = 922 + profileID
    
    while (true) {
        if (await checkPort(port)) {
            return port
        }

        port += 1
    }
}

async function isProxyWorking(proxyHost, proxyPort, proxyUser, proxyPass) {
    try {
        const proxyUrl = `socks5://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`;
        const agent = new SocksProxyAgent(proxyUrl);

        const response = await axios.get('https://api.ipify.org?format=json', {
            httpsAgent: agent,
            timeout: 5000
        });

        if (response.status === 200) {
            return `socks5://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}

async function createNewProxy(proxyUrl) {
    const anonymizedProxy = await proxyChain.anonymizeProxy(proxyUrl);
    const parsedUrl = new URL(anonymizedProxy);
    const proxyHost = parsedUrl.hostname;
    const proxyPort = parsedUrl.port;
    const newProxyString = `${proxyHost}:${proxyPort}`;

    return newProxyString
}

async function createBrowser(browserType, profileName, profileID, proxyHost, proxyPort, proxyUser, proxyPass) {

    let browserPath = browserType === 'chrome' ? CHROME_PATH : CHROMIUM_PATH
    let port = await getPort(profileID)

    let options = new chrome.Options();
    options.addArguments(`user-data-dir=./profile/${profileName}`)
    options.addArguments('--no-sandbox')
    options.addArguments('--disable-dev-shm-usage')
    options.addArguments('--restore-last-session')
    options.addArguments(`--remote-debugging-port=${port}`)
    options.addArguments('--disable-blink-features=AutomationControlled')
    options.addArguments('--disable-infobars')

    const proxyUrl = await isProxyWorking(proxyHost, proxyPort, proxyUser, proxyPass)

    const newProxyString = await createNewProxy(proxyUrl)

    options.setChromeBinaryPath(browserPath)

    let driver = await new Builder()
        .forBrowser('chrome')
        .setProxy(proxy.manual({
            http: newProxyString,
            https: newProxyString,
        }))
        .setChromeOptions(options)
        .build()

    return driver
}

export default createBrowser;
