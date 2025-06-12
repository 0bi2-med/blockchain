// Load section data
async function loadSection(section) {
    switch (section) {
        case 'blocks':
            await loadBlocks();
            break;
        case 'wallets':
            await loadWallets();
            break;
        case 'transactions':
            await loadMempool();
            break;
    }
}

// Load blocks
async function loadBlocks() {
    try {
        const blocks = await api.getBlocks();
        displayBlocks(blocks);
    } catch (error) {
        console.error('Error loading blocks:', error);
        document.getElementById('blocks-list').innerHTML = '<p class="error">Error loading blocks. Please try again.</p>';
    }
}

// Show block details
async function showBlockDetails(hash) {
    try {
        const block = await api.getBlockByHash(hash);
        displayBlockDetails(block);
        showSection('blockDetails');
    } catch (error) {
        console.error('Error loading block details:', error);
        alert('Error loading block details. Please try again.');
    }
}

// Load wallets
async function loadWallets() {
    try {
        const wallets = await api.getWallets();
        displayWallets(wallets);
    } catch (error) {
        console.error('Error loading wallets:', error);
        document.getElementById('wallets-list').innerHTML = '<p class="error">Error loading wallets. Please try again.</p>';
    }
}

// Create wallet
async function createWallet() {
    try {
        const wallet = await api.createWallet();
        alert(`New wallet created!\nPublic Key: ${wallet.pkey.substring(0, 50)}...\nPrivate Key: ${wallet.privateKey.substring(0, 50)}...`);
        await loadWallets();
    } catch (error) {
        console.error('Error creating wallet:', error);
        alert('Error creating wallet. Please try again.');
    }
}

// Load mempool
async function loadMempool() {
    try {
        const transactions = await api.getMempool();
        displayMempool(transactions);
    } catch (error) {
        console.error('Error loading mempool:', error);
        document.getElementById('mempool-list').innerHTML = '<p class="error">Error loading mempool. Please try again.</p>';
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadBlocks();
    loadWallets();
    loadMempool();

    // Set up periodic refresh for mempool
    setInterval(() => {
        if (currentSection === 'transactions') {
            loadMempool();
        }
    }, 10000); // Refresh every 10 seconds
}); 