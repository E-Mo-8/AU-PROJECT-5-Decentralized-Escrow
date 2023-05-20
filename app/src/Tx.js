const { Network, Alchemy } = require("alchemy-sdk");


const alchemy = new Alchemy({
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
});

//get deployed contracts
export async function findContractsDeployed(address) {
  const transfers = [];

  //get results 
  let response = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    fromAddress: address,
    excludeZeroValue: false,
    category: ["external"], // Filter results to only include external transfers
  });
  transfers.push(...response.transfers);

  // Continue  aggregating 
  while (response.pageKey) {
    let pageKey = response.pageKey;
    response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      fromAddress: address,
      excludeZeroValue: false,
      category: ["external"],
      pageKey: pageKey,
    });
    transfers.push(...response.transfers);
  }

  // Filter the transfers to only include contract deployments (where 'to' is null)
  const deployments = transfers.filter((transfer) => transfer.to === null);
  const txHashes = deployments.map((deployment) => deployment.hash);

  // Fetch the transaction receipts for each of the deployment transactions
  const promises = txHashes.map((hash) =>
    alchemy.core.getTransactionReceipt(hash)
  );

  // Wait for all the transaction receipts to be fetched
  const receipts = await Promise.all(promises);
  const contractAddresses = receipts.map((receipt) => receipt?.contractAddress);
  return contractAddresses;
}

// Define the main function that will execute the script
async function main() {
/*   const address = "0x5c00eb5De7DCDd852d4BBf2A2e5BC64034CBDd3c"; // Replace with the address you want to query the deployed contracts for - can be ENS name or address hash

  // Call the findContractsDeployed function to retrieve the array of deployed contracts
  const contractAddresses = await findContractsDeployed(address);

  // Log the contract addresses in a readable format by looping through the array
  console.log(`The following contracts were deployed by ${address}:`);
  for (let i = 0; i < contractAddresses.length; i++) {
    console.log(`${i + 1}. ${contractAddresses[i]}`);
  } */
}

// Call the main function to start the script
//export default findContractsDeployed;