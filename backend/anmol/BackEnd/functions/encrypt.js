const CryptoJS = require('crypto-js');

global.encrypt =async(data, key) =>{
    try {
        if (!data || !key) {
            throw new Error('Data and key are required for encryption');
        }
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        return encryptedData;
    } catch (error) {
        console.error("Error encrypting data:", error);
        throw error;
    }
}

