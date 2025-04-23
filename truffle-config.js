module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,  // This is the default port for Ganache
      network_id: "*"
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './build/contracts/',
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
}; 