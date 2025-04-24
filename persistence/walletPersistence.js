const fs = require("fs")
const pathDB = "../database/wallets.json"

const getAllWallets = async () => {
    try {
        let wallets = JSON.parse(await fs.promises.readFile(pathDB))
        return wallets
    } catch (e) {
        throw e
    }
}

const addWallet = async (wallet) => {
    try {
        let wallets = await getAllWallets()
        wallets.push(wallet)
        await saveWallets(wallets)
        return true
    } catch (e) {
        throw e
    }
}

const updateWallet = async (pKey, updatedWallet) => {
    try {
        let wallets = await getAllWallets()
        wallets = wallets.map(wallet => 
            wallet.pKey === pKey ? updatedWallet : wallet
        )
        await saveWallets(wallets)
        return true
    } catch (e) {
        throw e
    }
}

const saveWallets = async (wallets) => {
    try {
        await fs.promises.writeFile(pathDB, JSON.stringify(wallets, null, 2))
        return true
    } catch (e) {
        throw e
    }
}

module.exports = {
    getAllWallets,
    addWallet,
    updateWallet,
    saveWallets
}