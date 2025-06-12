const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    // Blocks
    async getBlocks() {
        const response = await fetch(`${API_BASE_URL}/blocks`);
        if (!response.ok) throw new Error('Failed to fetch blocks');
        return response.json();
    },

    async getBlockByHash(hash) {
        const response = await fetch(`${API_BASE_URL}/blocks/${hash}`);
        if (!response.ok) throw new Error('Failed to fetch block');
        return response.json();
    },

    // Wallets
    async getWallets() {
        const response = await fetch(`${API_BASE_URL}/wallets`);
        if (!response.ok) throw new Error('Failed to fetch wallets');
        return response.json();
    },

    async createWallet() {
        const response = await fetch(`${API_BASE_URL}/wallets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to create wallet');
        return response.json();
    },

    // Transactions
    async getMempool() {
        const response = await fetch(`${API_BASE_URL}/mempool`);
        if (!response.ok) throw new Error('Failed to fetch mempool');
        return response.json();
    },

    async createTransaction(transaction) {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });
        if (!response.ok) throw new Error('Failed to create transaction');
        return response.json();
    }
}; 