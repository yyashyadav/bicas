const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const contractABI = require('./frontend/.env').REACT_APP_CONTRACT_ABI;

console.log('🔍 Checking BICAS setup...\n');

// Check required files
const requiredFiles = {
  '.env': true,
  'frontend/.env': true,
  'backend/server.js': true,
  'backend/config/db.js': true,
  'backend/config/cloudinary.js': true,
  'backend/middleware/authMiddleware.js': true,
  'backend/middleware/errorMiddleware.js': true,
  'backend/models/userModel.js': true,
  'backend/models/surveillanceModel.js': true,
  'backend/routes/userRoutes.js': true,
  'backend/routes/surveillanceRoutes.js': true,
  'backend/routes/blockchainRoutes.js': true,
  'contracts/SurveillanceSystem.sol': true,
  'frontend/src/contracts/contract-abi.json': true,
};

console.log('📁 Checking required files:');
Object.keys(requiredFiles).forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  requiredFiles[file] = exists;
});

// Check environment variables
console.log('\n🔐 Checking environment variables:');
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'BLOCKCHAIN_NETWORK',
  'CONTRACT_ADDRESS'
];

const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
requiredEnvVars.forEach(envVar => {
  const exists = envContent.includes(envVar);
  console.log(`${exists ? '✅' : '❌'} ${envVar}`);
});

// Check package.json dependencies
console.log('\n📦 Checking package.json dependencies:');
const requiredDependencies = [
  'express',
  'mongoose',
  'web3',
  'cloudinary',
  'dotenv',
  'cors',
  'jsonwebtoken',
  'bcryptjs',
  'multer'
];

const packageJson = require('./package.json');
requiredDependencies.forEach(dep => {
  const exists = packageJson.dependencies[dep];
  console.log(`${exists ? '✅' : '❌'} ${dep}`);
});

async function grantAccess() {
    try {
        if (typeof window.ethereum === 'undefined') {
            console.error('MetaMask not found');
            return;
        }

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        
        if (!accounts || accounts.length === 0) {
            console.error('No accounts found');
            return;
        }

        const currentAccount = accounts[0];
        console.log('Current account:', currentAccount);

        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(JSON.parse(contractABI), contractAddress);

        // Check if current account is authorized
        const isAuthorized = await contract.methods.authorizedUsers(currentAccount).call();
        console.log('Is authorized:', isAuthorized);

        if (!isAuthorized) {
            console.log('Account is not authorized. Please use the deployer account to grant access.');
            console.log('Steps:');
            console.log('1. Import the deployer account (first account from Ganache) into MetaMask');
            console.log('2. Switch to that account in MetaMask');
            console.log('3. Call the grantAccess function with your current account address');
        } else {
            console.log('Account is already authorized!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Export the function for use in browser console
window.grantAccess = grantAccess; 