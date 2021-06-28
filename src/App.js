//jshint esversion:6
import React, { Component } from 'react';
import Web3 from 'web3';
import Color from "../src/abis/Color.json";
import './App.css';

class App extends Component {


  constructor(props){
    super(props);
    this.state = {
      account : '',
      contract : null,
      totalSupply : 0,
      colors : []
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log(this.state.account);

    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if(networkData){
      const abi = Color.abi;
      const address = networkData.address;
      var contract = new web3.eth.Contract(abi , address);
      this.setState({contract : contract});
      const totalSupply = await contract.methods.totalSupply().call();
      this.setState({totalSupply : totalSupply});
      for (var i = 1; i <= totalSupply; i++) {
        var color = await contract.methods.colors(i - 1).call();
        this.setState({
          colors : [...this.state.colors , color]
        });
      }
      console.log(this.state.colors);
    }
    else{
      window.alert('Smart Contracts not deployed');
    }


  }

  mint = (color) => {
    console.log(color);
    this.state.contract.methods.mint(color).send({from : this.state.account})
    .once('recipt',(recipt)=>{
      this.setState({
        colors : [...this.state.colors , color]
      });
    })
  }

  



  render() {
    return (
      <div className = "App">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://iamhardikagarwal.netlify.app/"
           
          >
            Dtech Presents - Color Tokens NFT
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">METAMASK ACCOUNT : {this.state.account}</a>
        </li>
        </ul>
        </div> 
        </nav>
        <br></br>
      <div className="container" >
        <h4>ISSUE TOKENS</h4>
        <form class="mx-auto" style={{width:"250px",maxWidth:"250px",minWidth:"100px"}} onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
                  <button
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  >MINT</button>
                </form>
      </div>
        <hr></hr>
    <div className = "x container-fluid">
      <h4>Color Tokens - NFT</h4>
      <div className= "row text-center">
      {this.state.colors.map((color,key)=>{
        return(
          <div key={key} className="col-md-3 mb-3">
          <div className="token" style={{ backgroundColor: color }}></div>
          <div>{color}</div>
        </div>
        );
      })}
      </div>
    </div>
    </div>
    );
  }
}

export default App;
