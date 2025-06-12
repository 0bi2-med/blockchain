// UI State Management
let currentSection = 'blocks';
let allWallets = []; // Store all wallets for search functionality

// Navigation
function showSection(sectionId) {
    currentSection = sectionId;
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Block Display
function displayBlocks(blocks) {
    const blocksList = document.getElementById('blocks-list');
    if (!blocksList) return;
    
    if (!Array.isArray(blocks)) {
        blocksList.innerHTML = '<p class="error">Error loading blocks. Please try again.</p>';
        return;
    }
    if (blocks.length === 0) {
        blocksList.innerHTML = '<p>No blocks found in the blockchain.</p>';
        return;
    }
    blocksList.innerHTML = blocks.map(block => `
        <div class="block-card" onclick="displayBlockDetails('${block.hash}')">
            <h3>Block #${block.height}</h3>
            <p>Hash: ${block.hash.substring(0, 16)}...</p>
            <p>Previous: ${block.previousHash.substring(0, 16)}...</p>
            <p>Timestamp: ${new Date(block.timestamp).toLocaleString()}</p>
        </div>
    `).join('');
}

function displayBlockDetails(hash) {
    const blockDetails = document.getElementById('block-details');
    if (!blockDetails) return;

    api.getBlockByHash(hash)
        .then(block => {
            if (!block) {
                blockDetails.innerHTML = '<p class="error">Block not found</p>';
                return;
            }
            blockDetails.innerHTML = `
                <h2>Block Details</h2>
                <div class="block-details">
                    <p><strong>Height:</strong> ${block.height}</p>
                    <p><strong>Hash:</strong> ${block.hash}</p>
                    <p><strong>Previous Hash:</strong> ${block.previousHash}</p>
                    <p><strong>Timestamp:</strong> ${new Date(block.timestamp).toLocaleString()}</p>
                    <p><strong>Difficulty:</strong> ${block.difficulty}</p>
                    <p><strong>Nonce:</strong> ${block.nonce}</p>
                    <p><strong>Miner:</strong> ${block.miner || 'Unknown'}</p>
                    <h3>Transactions (${block.transactions?.length || 0})</h3>
                    <div class="transactions-list">
                        ${(block.transactions || []).map(tx => `
                            <div class="transaction-item">
                                <p><strong>From:</strong> ${tx.Sender.substring(0, 16)}...</p>
                                <p><strong>To:</strong> ${tx.Receiver.substring(0, 16)}...</p>
                                <p><strong>Amount:</strong> ${tx.amount}</p>
                                <p><strong>Fees:</strong> ${tx.feesAmount}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        })
        .catch(error => {
            blockDetails.innerHTML = `<p class="error">${error.message}</p>`;
        });
}

// Wallet Display and Search
function displayWallets(wallets) {
    const walletsList = document.getElementById('wallets-list');
    if (!walletsList) return;

    if (!Array.isArray(wallets)) {
        walletsList.innerHTML = '<p class="error">Error loading wallets. Please try again.</p>';
        return;
    }

    // Store all wallets for search functionality
    allWallets = wallets;

    if (wallets.length === 0) {
        walletsList.innerHTML = '<p>No wallets found. Create one to get started!</p>';
        return;
    }

    renderWallets(wallets);
}

function renderWallets(wallets) {
    const walletsList = document.getElementById('wallets-list');
    if (!walletsList) return;

    walletsList.innerHTML = wallets.map(wallet => `
        <div class="wallet-card">
            <h3>Wallet</h3>
            <p><strong>Public Key:</strong> ${wallet.pkey.substring(0, 50)}...</p>
            <p><strong>Balance:</strong> ${wallet.solde} coins</p>
            <p><strong>Sent Transactions:</strong> ${wallet.SendTransaction?.length || 0}</p>
            <p><strong>Received Transactions:</strong> ${wallet.ReceiveTransaction?.length || 0}</p>
        </div>
    `).join('');
}

function searchWallets(searchTerm) {
    if (!searchTerm) {
        renderWallets(allWallets);
        return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filteredWallets = allWallets.filter(wallet => 
        wallet.pkey.toLowerCase().includes(searchTermLower)
    );

    if (filteredWallets.length === 0) {
        document.getElementById('wallets-list').innerHTML = 
            '<p class="info">No wallets found matching your search.</p>';
        return;
    }

    renderWallets(filteredWallets);
}

// Transaction Display
function displayMempool(transactions) {
    const mempoolList = document.getElementById('mempool-list');
    if (!mempoolList) return;

    if (!Array.isArray(transactions)) {
        mempoolList.innerHTML = '<p class="error">Error loading mempool. Please try again.</p>';
        return;
    }
    if (transactions.length === 0) {
        mempoolList.innerHTML = '<p>No transactions in the mempool.</p>';
        return;
    }
    mempoolList.innerHTML = transactions.map(tx => `
        <div class="transaction-card">
            <h3>Transaction</h3>
            <p><strong>From:</strong> ${tx.Sender.substring(0, 16)}...</p>
            <p><strong>To:</strong> ${tx.Receiver.substring(0, 16)}...</p>
            <p><strong>Amount:</strong> ${tx.amount}</p>
            <p><strong>Fees:</strong> ${tx.feesAmount}</p>
            <p><strong>Timestamp:</strong> ${new Date(tx.timestamp).toLocaleString()}</p>
        </div>
    `).join('');
}

// Form Handling
function handleWalletSubmit(event) {
    event.preventDefault();
    createWallet(); // Use the function from app.js
}

function handleTransactionSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const transaction = {
        Sender: formData.get('sender'),
        Receiver: formData.get('receiver'),
        amount: parseFloat(formData.get('amount')),
        feesAmount: parseFloat(formData.get('fees'))
    };
    
    api.createTransaction(transaction)
        .then(tx => {
            alert('Transaction created successfully!');
            event.target.reset();
            loadMempool();
        })
        .catch(error => {
            alert(`Error creating transaction: ${error.message}`);
        });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('href').substring(1);
            showSection(section);
        });
    });

    // Form submissions
    const walletForm = document.getElementById('create-wallet-form');
    if (walletForm) {
        walletForm.addEventListener('submit', handleWalletSubmit);
    }

    const transactionForm = document.getElementById('create-transaction-form');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
    }

    // Wallet search
    const searchInput = document.getElementById('wallet-search');
    const searchButton = document.getElementById('search-wallet-btn');
    const clearButton = document.getElementById('clear-search-btn');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            searchWallets(searchTerm);
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            renderWallets(allWallets);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = searchInput.value.trim();
                searchWallets(searchTerm);
            }
        });
    }

    // Initial load
    showSection('blocks');
    loadBlocks();
    loadWallets();
    loadMempool();
}); 