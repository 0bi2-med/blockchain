const fs = require("fs")
const path = require("path")
const Wallet = require("../models/Wallet")

const WALLET_FILE = "database/wallet.json"

const getAllWallets = async () => {
    try {
        // Check if file exists, if not create it with empty array
        if (!fs.existsSync(WALLET_FILE)) {
            await fs.promises.writeFile(WALLET_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const data = await fs.promises.readFile(WALLET_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading wallets:', e);
        return [];
    }
}

const saveAllWallets = async (wallets) => {
    try {
        await fs.promises.writeFile(WALLET_FILE, JSON.stringify(wallets, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving wallets:', e);
        throw new Error('Failed to save wallets');
    }
}

const updateWallet = async (wallet) => {
    try {
        let wallets = await getAllWallets();
        let wallet_to_update = wallets.find(ele => ele.pkey === wallet.pkey);
        if (wallet_to_update) {
            wallet_to_update.solde = wallet.solde;
            wallet_to_update.sentTransactions = wallet.sentTransactions;
            wallet_to_update.receivedTransactions = wallet.receivedTransactions;
            wallet_to_update.minedTransactions = wallet.minedTransactions;
            await saveAllWallets(wallets);
            return wallet_to_update;
        } else {
            throw new Error("Wallet not found");
        }
    } catch (e) {
        console.error('Error updating wallet:', e);
        throw new Error('Failed to update wallet');
    }
}

const addWallet = async () => {
    try {
        const wallet = new Wallet();
        let wallets = await getAllWallets();
        let found = wallets.find(ele => ele.pkey === wallet.pkey);
        if (!found) {
            wallets.push(wallet);
            await saveAllWallets(wallets);
            return wallet;
        } else {
            throw new Error("Wallet already exists");
        }
    } catch (e) {
        console.error('Error creating wallet:', e);
        throw new Error('Failed to create wallet');
    }
}

module.exports = {
    getAllWallets,
    saveAllWallets,
    updateWallet,
    addWallet
}