// compile code will go here
const fs = require('fs');
const solc = require('solc');

const source = fs
  .readFileSync(`${__dirname}/contracts/Lottery.sol`, 'utf8')
  .toString();

input = {
  language: 'Solidity',
  sources: { 'Lottery.sol': { content: source } },
  settings: { outputSelection: { '*': { '*': ['*'] } } },
};
const comp = JSON.parse(solc.compile(JSON.stringify(input, 1))).contracts[
  'Lottery.sol'
].Lottery;

// console.log(comp.evm.bytecode);
module.exports = comp;
