const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
  //get a list of accounts provider by ganache
  accounts = await web3.eth.getAccounts();

  //Use of the account to deploy the contract in the ganache test network
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: '1000000', gasPrice: '2000000000' });
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(players.length, 1);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether'),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether'),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: '1000',
      });

      //will faill test if the above code passes
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can call pick winner', async () => {
    try {
      await lottery.methods.pickWinner().call({
        from: accounts[2],
      });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    // console.log(difference);
    assert(difference > web3.utils.toWei('1.9', 'ether'));
  });

  it('empties the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('2', 'ether'),
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('2', 'ether'),
    });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const playersArr = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(playersArr, '');
  });
});
