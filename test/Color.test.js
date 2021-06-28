const { assert } = require('chai');

const Color = artifacts.require('./Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) => {
  let contract;

  before(async () => {
    contract = await Color.deployed();
  });

  //DEPLOYMENT TESTS

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await contract.address;
      console.log(address);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, undefined);
    });

    it('has a name', async () => {
      const name = await contract.name();
      assert.equal(name, 'Color');
    });

    it('has a Symbol', async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, 'COLOR');
    });
  });

  //MINTING TESTS

  describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.mint('#FFFFFF')
      const totalSupply = await contract.totalSupply()
      // SUCCESS
      assert.equal(totalSupply, 1)
     console.log(result);

     const event = result.logs[0].args;
     console.log(event);
     assert.equal(event.tokenId.toNumber(), 0, 'id is correct')
     assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
     assert.equal(event.to, accounts[0], 'to is correct')

     //FALIURE : Cannot mint a same color twice
     await contract.mint('#FFFFFF').should.be.rejected;
    });

  });

  //INDEXING

  describe('indexing' , async()=>{

    it('list of colors', async()=>{

      await contract.mint("#000000")
      await contract.mint("#010200")
      await contract.mint("#102100")

      const totalSupply = await contract.totalSupply()

      let color
      let result = []

      for (var i = 1; i <= totalSupply; i++) {
        color = await contract.colors(i - 1)
        result.push(color)
      }

      let expected = ["#FFFFFF","#000000" ,"#010200", "#102100" ]
      assert.equal(result.join(','), expected.join(','))
      
    })
  })

  


  });

