const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { loadBlocks } = require('../persistence/blocPersistence');
const { getAllWallets, addWallet } = require('../persistence/walletPersistence');
const { getAllTransactionsMempool, addTransactionMempool } = require('../persistence/mempoolPersistence');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure database directories exist
const dirs = ['database', 'database/blocks', 'database/wallets', 'database/mempool'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Initialize blockchain.json if it doesn't exist
const blockchainFile = path.join(__dirname, '..', 'database/blockchain.json');
if (!fs.existsSync(blockchainFile)) {
    fs.writeFileSync(blockchainFile, JSON.stringify({
        name: "uemfBlockchain",
        difficulty: 4,
        miningInterval: 600,
        blockReward: 50,
        denom: "uemfCoin",
        head: null
    }, null, 2));
}

// API Routes
app.get('/api/blocks', async (req, res) => {
    try {
        const blocks = await loadBlocks();
        res.json(blocks);
    } catch (error) {
        console.error('Error loading blocks:', error);
        res.status(500).json({ error: 'Failed to load blocks' });
    }
});

app.get('/api/blocks/:hash', async (req, res) => {
    try {
        const blocks = await loadBlocks();
        const block = blocks.find(b => b.hash === req.params.hash);
        if (block) {
            res.json(block);
        } else {
            res.status(404).json({ error: 'Block not found' });
        }
    } catch (error) {
        console.error('Error loading block:', error);
        res.status(500).json({ error: 'Failed to load block' });
    }
});

// Wallet routes
app.get('/api/wallets', async (req, res) => {
    try {
        const wallets = await getAllWallets();
        res.json(wallets);
    } catch (error) {
        console.error('Error loading wallets:', error);
        res.status(500).json({ error: 'Failed to load wallets' });
    }
});

app.post('/api/wallets', async (req, res) => {
    try {
        const wallet = await addWallet();
        res.json(wallet);
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});

// Transaction routes
app.get('/api/mempool', async (req, res) => {
    try {
        const transactions = await getAllTransactionsMempool();
        res.json(transactions);
    } catch (error) {
        console.error('Error loading mempool:', error);
        res.status(500).json({ error: 'Failed to load mempool' });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const transaction = await addTransactionMempool(req.body);
        res.json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 