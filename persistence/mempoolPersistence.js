const fs = require("fs")
const pathDB = "../database/mempool.json"

const getAllTransactionMempool = async  () => {
    try{
        let transactions =  JSON.parse( await fs.promises.readFile("pathDB"))
        return transactions
    }
    catch(e){
        throw e 
    }
}

const addTransactionMempool = async (transaction) => {
    try {
        let transactions = await getAllTransactionMempool();
        transactions.push(transaction);
        await saveMempool(transactions);
        return true;
    } catch (e) {
        throw e;
    }
}

const removeTransactionMempool = async (signature) => {
    try {
        let transactions = await getAllTransactionMempool();
        transactions = transactions.filter(tx => tx.signature !== signature);
        await saveMempool(transactions);
        return true;
    } catch (e) {
        throw e;
    }
}

const saveMempool = async (transactions) => {
    try {
        await fs.promises.writeFile(pathDB, JSON.stringify(transactions, null, 2));
        return true;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    getAllTransactionMempool,
    addTransactionMempool,
    removeTransactionMempool,
    saveMempool
}