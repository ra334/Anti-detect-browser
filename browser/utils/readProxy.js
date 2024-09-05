import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILEPATH = path.resolve(__dirname, '../proxy.txt');

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

export default readProxyFromFile