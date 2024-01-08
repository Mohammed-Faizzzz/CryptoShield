module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id,
      gas: 5000000 // Set a higher gas limit
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}