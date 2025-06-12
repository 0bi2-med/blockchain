const Blockchain = require("./models/blockchain");
const { saveBlockchain, loadBlockchain } = require("./persistence/blockchainPersitence");
const { saveBlocks, saveBlock, loadBlocks, getBlock, getBlockByHeight } = require("./persistence/blocPersistence");

const testSave = () => {
    const blockchain = new Blockchain("Uemf", 6, 300, 50, "uemfCoin")
    saveBlockchain(blockchain)
        .then(() => console.log("blockchain saved with success"))
        .catch(e =>
            console.log("error on saving blockchain")
        )
}

const testLoad = async () => {
    try {
        const blockchain = await loadBlockchain()
        console.log(blockchain)
    }
    catch (e) {
        console.log(e)
    }
}

const testSaveBlocks = async () => {
    try {
        // Create test blocks
        const blocks = [
            {
                height: 3,
                hash: "block3_hash",
                previousHash: "0",
                timestamp: Date.now(),
                difficulty: 6,
                blockReward: 50,
                nonce: 0,
                miner: "system",
                transactions: []
            },
            {
                height: 4,
                hash: "block_hash",
                previousHash: "block3_hash",
                timestamp: Date.now(),
                difficulty: 6,
                blockReward: 50,
                nonce: 1,
                miner: "miner1",
                transactions: []
            }
        ]

        // Test saving multiple blocks
        const result = await saveBlocks(blocks)
        if (result) {
            console.log("Multiple blocks saved successfully")
        } else {
            console.log("Error saving multiple blocks")
        }

        // Test saving single block
        const singleBlock = {
            height: 2,
            hash: "block2_hash",
            previousHash: "block1_hash",
            timestamp: Date.now(),
            difficulty: 6,
            blockReward: 50,
            nonce: 2,
            miner: "miner2",
            transactions: []
        }

        const singleResult = await saveBlock(singleBlock)
        if (singleResult) {
            console.log("Single block saved successfully")
        } else {
            console.log("Error saving single block")
        }
    } catch (e) {
        console.log("Error in testSaveBlocks:", e)
    }
}

const testGetBlock = async () => {
    try {
        console.log("\nTesting getBlock by hash:")
        // Test getting block by hash
        const block = await getBlock("block3_hash")
        if (block) {
            console.log("Found block with hash 'block3_hash':")
            console.log("Height:", block.height)
            console.log("Hash:", block.hash)
            console.log("Previous Hash:", block.previousHash)
        } else {
            console.log("No block found with hash 'block3_hash'")
        }

        console.log("\nTesting getBlockByHeight:")
        // Test getting block by height
        const blockByHeight = await getBlockByHeight(3)
        if (blockByHeight) {
            console.log("Found block at height 3:")
            console.log("Height:", blockByHeight.height)
            console.log("Hash:", blockByHeight.hash)
            console.log("Previous Hash:", blockByHeight.previousHash)
        } else {
            console.log("No block found at height 3")
        }

        // Test getting non-existent block
        console.log("\nTesting getBlockByHeight with non-existent height:")
        const nonExistentBlock = await getBlockByHeight(999)
        if (nonExistentBlock) {
            console.log("Found block at height 999")
        } else {
            console.log("No block found at height 999 (expected result)")
        }
    } catch (e) {
        console.log("Error in testGetBlock:", e)
    }
}

// Run the tests
console.log("Testing blockchain save...")
testSave()

console.log("\nTesting blockchain load...")
testLoad()

console.log("\nTesting blocks save...")
testSaveBlocks()

console.log("\nTesting block retrieval...")
testGetBlock()