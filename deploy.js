const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');
require('dotenv').config();

// const provider = new HDWalletProvider(
//   [process.env.PRIVATE_KEY],
//   `
// https://sepolia.infura.io/v3/${process.env.INFURA_ID}`
// );

const provider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY],
  providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_ID}`,
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy contract from ${accounts[0]}...`);
  //   console.log(account);

  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: ['Hi there!'],
    })
    .send({ from: accounts[0], gas: '1000000', gasPrice: '20000000000' });

  console.log(`Contract deployed to ${result.options.address}`);
  provider.engine.stop();
};
deploy();
