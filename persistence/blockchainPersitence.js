const fs = require("fs")
const path = require("path")
const BLOCKCHAIN_FILE = path.join(__dirname, "..", "database/blockchain.json")

const saveBlockchain = async (blockchain) => {
    const { name, difficulty, miningInterval,
        blockReward, denom, head } = blockchain

    if (head != null) {
        head = head.hash
    }
    try {
        await fs.promises.writeFile(BLOCKCHAIN_FILE, JSON.stringify(
            {
                name, difficulty, miningInterval, blockReward, denom, head
            }, null, 3
        ))
        return true;
    }
    catch (e) {
        console.error("Error saving blockchain:", e)
        throw new Error("Failed to save blockchain configuration")
    }
}

const loadBlockchain = async () => {
    try {
        // Check if blockchain.json exists
        if (!fs.existsSync(BLOCKCHAIN_FILE)) {
            // Initialize with default values if file doesn't exist
            const initialBlockchain = {
                difficulty: 4,
                blockReward: 50,
                lastBlock: null
            };
            await fs.promises.writeFile(BLOCKCHAIN_FILE, JSON.stringify(initialBlockchain, null, 2));
            return initialBlockchain;
        }

        // Read and parse the blockchain file
        const data = await fs.promises.readFile(BLOCKCHAIN_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading blockchain:", error);
        throw new Error("Failed to load blockchain configuration");
    }
}

module.exports = {
    loadBlockchain,
    saveBlockchain
}