require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: process.env.REACT_APP_GOERLI_URL,
    },
  },
  paths: {
    artifacts: "./app/src/artifacts",
  },
};
