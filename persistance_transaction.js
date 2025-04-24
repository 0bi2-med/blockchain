const fs = require('fs');
const path = require('path');

class TransactionPersistence {
    constructor(filePath = 'database/mempool.json') {
        this.filePath = path.resolve(filePath);
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify({
                transactions: []
            }, null, 2));
        }
    }

    saveTransactions(transactions) {
        try {
            const data = {
                transactions: transactions || []
            };
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving transactions:', error);
            return false;
        }
    }

    getAll() {
        try {
            const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            return data.transactions;
        } catch (error) {
            console.error('Error loading transactions:', error);
            return [];
        }
    }
}

module.exports = TransactionPersistence; 