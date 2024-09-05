import createBrowser from "./createBrowser.js";
import readProxyFromFile from "./utils/readProxy.js";

for (let i = 1; i <= 3; i++) {
    const proxy = readProxyFromFile(i)

    const proxyHost = proxy.host
    const proxyPort = proxy.port
    const proxyUser = proxy.login
    const proxyPass = proxy.password

    createBrowser('chrome', 'profile_' + i, i, proxyHost, proxyPort, proxyUser, proxyPass)
}