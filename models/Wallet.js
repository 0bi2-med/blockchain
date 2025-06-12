const crypto = require('crypto');

class Wallet {
    constructor() {
        // Generate a random key pair
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        this.pkey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
        this.solde = 0;
        this.ReceiveTransaction = [];
        this.SendTransaction = [];
    }
}

module.exports = Wallet;

