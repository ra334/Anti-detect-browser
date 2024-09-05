import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url';

import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILEPATH = path.resolve(__dirname, '../proxy.txt');


function getNumberOfLines() {
    const data = fs.readFileSync(FILEPATH, 'utf8');
    const lines = data.split('\n');
    return lines.length;
}


function readProxyFromFile(lineNumber) {
    const data = fs.readFileSync(FILEPATH, 'utf8');

    const lines = data.split('\n');

    const proxyLine = lines[lineNumber - 1].trim();

    const [host, port, login, password] = proxyLine.split(':');

    return {
        host,
        port,
        login,
        password
    };
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
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}


;(async function main() {
    let valid = 0
    let invalid = 0

    for (let i = 1; i <= getNumberOfLines(); i++) {
        const proxy = readProxyFromFile(i)
    
        const isProxyValid = await isProxyWorking(proxy.host, proxy.port, proxy.login, proxy.password)

        if (isProxyValid) {
            valid += 1
        } else {
            invalid += 1
        }
    }

    console.log(`Valid proxies: ${valid}`)
    console.log(`Invalid proxies: ${invalid}`)
})()