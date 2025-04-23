const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const { protect } = require('../middleware/authMiddleware');

// Initialize web3
const web3 = new Web3(process.env.BLOCKCHAIN_NETWORK);

// Get contract ABI and address from environment variables
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('../../frontend/src/contracts/contract-abi.json').abi;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get file metadata from blockchain
router.get('/metadata/:fileHash', protect, async (req, res) => {
  try {
    const metadata = await contract.methods.getFileMetadata(req.params.fileHash).call();
    res.json(metadata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get access logs from blockchain
router.get('/logs/:fileHash', protect, async (req, res) => {
  try {
    const logs = await contract.methods.getAccessLogs(req.params.fileHash).call();
    res.json(logs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Grant access to a user
router.post('/grant-access', protect, async (req, res) => {
  try {
    const { userAddress } = req.body;
    const accounts = await web3.eth.getAccounts();
    
    await contract.methods.grantAccess(userAddress)
      .send({ from: accounts[0] });
    
    res.json({ message: 'Access granted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Revoke access from a user
router.post('/revoke-access', protect, async (req, res) => {
  try {
    const { userAddress } = req.body;
    const accounts = await web3.eth.getAccounts();
    
    await contract.methods.revokeAccess(userAddress)
      .send({ from: accounts[0] });
    
    res.json({ message: 'Access revoked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 