const CryptoJS = require('crypto-js');

global.decrypt = async function decrypt(data, key) {
    const decryptedBytes = CryptoJS.AES.decrypt(data, key);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
};
