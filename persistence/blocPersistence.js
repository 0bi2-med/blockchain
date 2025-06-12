const pathFolder = "database/blocks"
const fs = require("fs");
const path = require("path");
const { loadBlockchain } = require("./blockchainPersitence");
const Block = require("../models/Block");

const loadBlocks = async () => {
    try {
        let blocks = [];
        // Ensure the blocks directory exists
        if (!fs.existsSync(pathFolder)) {
            await fs.promises.mkdir(pathFolder, { recursive: true });
            return blocks; // Return empty array if directory is newly created
        }

        let listFiles = await fs.promises.readdir(pathFolder);
        if (listFiles.length === 0) {
            return blocks; // Return empty array if no blocks exist
        }

        let sortedFiles = listFiles.sort((file1, file2) => {
            let numeroFile1 = file1.slice(6, -5)
            let numeroFile2 = file2.slice(6, -5)
            return numeroFile1 - numeroFile2
        });

        let blockchain = await loadBlockchain();
        for (let i = 0; i < sortedFiles.length; i++) {
            let dataFile = await fs.promises.readFile(path.join(pathFolder, sortedFiles[i]), 'utf8');
            dataFile = JSON.parse(dataFile);
            
            if (dataFile.height != i) {
                throw new Error("blockchain is broken");
            }

            let block = new Block(
                dataFile.height,
                dataFile.hash,
                dataFile.previousHash,
                dataFile.timestamp,
                dataFile.difficulty,
                dataFile.blockReward,
                dataFile.nonce,
                dataFile.miner
            );

            blocks.push(block);
            block.blockchain = blockchain;
            
            if (block.height != 0) {
                block.previousBlock = blocks[i - 1];
            }
            
            block.transactions = dataFile.transactions || [];
        }
        return blocks;
    } catch (error) {
        console.error('Error in loadBlocks:', error);
        return []; // Return empty array on error instead of throwing
    }
}

const saveBlocks = async (blocks) => {
    try {
        // Ensure the blocks directory exists
        if (!fs.existsSync(pathFolder)) {
            await fs.promises.mkdir(pathFolder, { recursive: true });
        }

        // Save each block to its own file
        for (const block of blocks) {
            const fileName = `block_${block.height}.json`;
            const filePath = path.join(pathFolder, fileName);
            await fs.promises.writeFile(filePath, JSON.stringify(block, null, 2));
        }
        return true;
    } catch (error) {
        console.error('Error saving blocks:', error);
        return false;
    }
}

const saveBlock = async (block) => {
    try {
        // Ensure the blocks directory exists
        if (!fs.existsSync(pathFolder)) {
            await fs.promises.mkdir(pathFolder, { recursive: true });
        }

        // Save single block to file
        const fileName = `block_${block.height}.json`;
        const filePath = path.join(pathFolder, fileName);
        await fs.promises.writeFile(filePath, JSON.stringify(block, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving block:', error);
        return false;
    }
}

const getBlock = async (hash) => {
    try {
        // Get all files in the blocks directory
        const files = await fs.promises.readdir(pathFolder);
        
        // Search through each file for the block with matching hash
        for (const file of files) {
            const filePath = path.join(pathFolder, file);
            const blockData = await fs.promises.readFile(filePath, 'utf8');
            const block = JSON.parse(blockData);
            
            if (block.hash === hash) {
                return block;
            }
        }
        
        return null; // Return null if block not found
    } catch (error) {
        console.error('Error getting block by hash:', error);
        return null;
    }
}

const getBlockByHeight = async (height) => {
    try {
        const fileName = `block_${height}.json`;
        const filePath = path.join(pathFolder, fileName);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return null;
        }
        
        // Read and parse the block file
        const blockData = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(blockData);
    } catch (error) {
        console.error('Error getting block by height:', error);
        return null;
    }
}

module.exports = {
    loadBlocks,
    saveBlocks,
    saveBlock,
    getBlock,
    getBlockByHeight
}