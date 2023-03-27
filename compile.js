// compile code will go here
const fs = require('fs');
const solc = require('solc');

// const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs
  .readFileSync(`${__dirname}/contracts/Inbox.sol`, 'utf8')
  .toString();

input = {
  language: 'Solidity',
  sources: { 'Inbox.sol': { content: source } },
  settings: { outputSelection: { '*': { '*': ['*'] } } },
};
const comp = JSON.parse(solc.compile(JSON.stringify(input, 1))).contracts[
  'Inbox.sol'
].Inbox;

// console.log(comp.evm.bytecode);
module.exports = comp;
