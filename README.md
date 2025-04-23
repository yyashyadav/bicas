# BICASS - Blockchain-based Intelligent CCTV Access Surveillance System

A decentralized surveillance system that uses blockchain technology to manage and secure CCTV footage access.

## Features

- Secure video upload and storage using Cloudinary
- Blockchain-based access control
- User authentication and authorization
- Access log tracking
- Video metadata management

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Blockchain: Ethereum (Ganache), Web3.js
- Cloud Storage: Cloudinary
- Smart Contracts: Solidity

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Ganache
- MetaMask
- Cloudinary account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BICASS.git
cd BICASS
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Configure environment variables:
- Create `.env` file in root directory
- Create `.env` file in frontend directory
- Add required environment variables (see .env.example files)

4. Start Ganache:
- Run Ganache on port 7545
- Deploy the smart contract

5. Start the servers:
```bash
# Start backend server
npm start

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## Usage

1. Connect MetaMask to Ganache network
2. Register/Login to the application
3. Upload surveillance videos
4. Manage access permissions
5. View access logs

## Project Structure

```
BICASS/
├── backend/           # Backend server code
├── frontend/          # React frontend code
├── contracts/         # Smart contracts
├── migrations/        # Contract deployment scripts
└── .env              # Environment variables
```

## License

MIT

## Contact

Your Name - your.email@example.com

Project Link: https://github.com/yourusername/BICASS 