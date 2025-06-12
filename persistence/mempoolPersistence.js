// addTransactionMempool
// removeTransactionMempool
// getAllTransactionsMempool
// saveMempool
const fs = require("fs");
const path = require("path");

const MEMPOOL_FILE = "database/mempool.json";

const getAllTransactionsMempool = async () => {
    try {
        // Check if file exists, if not create it with empty array
        if (!fs.existsSync(MEMPOOL_FILE)) {
            await fs.promises.writeFile(MEMPOOL_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const data = await fs.promises.readFile(MEMPOOL_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading mempool:', e);
        return [];
    }
}

const saveMempool = async (mempool) => {
    try {
        await fs.promises.writeFile(MEMPOOL_FILE, JSON.stringify(mempool, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving mempool:', error);
        throw new Error('Failed to save mempool');
    }
}

const addTransactionMempool = async (transaction) => {
    try {
        const mempool = await getAllTransactionsMempool();
        // Add timestamp if not present
        if (!transaction.timestamp) {
            transaction.timestamp = Date.now();
        }
        // Add signature if not present
        if (!transaction.signature) {
            transaction.signature = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        mempool.push(transaction);
        await saveMempool(mempool);
        return transaction;
    } catch (error) {
        console.error('Error adding transaction to mempool:', error);
        throw new Error('Failed to add transaction to mempool');
    }
}

/*
const user = {name:"mehdi",age:32}
undefined
const hello = ({name})=>console.log(name)
undefined
hello(user)
VM1046:1 mehdi
 */
const removeTransactionMempool = async ({ signature }) => {
    try {
        let mempool = await getAllTransactionsMempool();
        mempool = mempool.filter(tx => tx.signature !== signature);
        await saveMempool(mempool);
        return true;
    } catch (error) {
        console.error('Error removing transaction from mempool:', error);
        throw new Error('Failed to remove transaction from mempool');
    }
}

module.exports = {
    addTransactionMempool,
    getAllTransactionsMempool,
    removeTransactionMempool,
    saveMempool
}