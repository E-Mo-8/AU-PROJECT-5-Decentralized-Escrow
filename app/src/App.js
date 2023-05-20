import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
import { Alchemy, Network, Utils} from 'alchemy-sdk';
import {findContractsDeployed} from "./Tx"
import Refund from "./Refund";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export async function refund(escrowContract, signer) {
  const refundTxn = await escrowContract.connect(signer).refund();
  await refundTxn.wait();
  //setRefunded("Refund succefuly");
}

const settings = {
  apiKey:  process.env.REACT_APP_ALCHEMY_API_KEY, // Replace with your Alchemy API key.
  network: Network.ETH_GOERLI // Replace with your network.
};

const alchemy = new Alchemy(settings);

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [contracts, setContracts] = useState([]);
  const [refunded, setRefunded] = useState(false);
  const [escrowsAddress, setEscrowsAddress] = useState();
  let  escrowContract = null;
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.BigNumber.from(Utils.parseEther(document.getElementById("ethtowei").value));
    
    //const value = ethers.BigNumber.from(Utils.parseEther(document.getElementById("ethtowei").value)); // convert it to Ether
    console.log(`${value} ETH to wei`); 

    escrowContract = await deploy(signer, arbiter, beneficiary, value);
    console.log( "newContract escrowContract: " +  escrowContract.address);
    setEscrowsAddress(escrowContract.address);
    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            
            "✓ It's been approved!";

        });

      await approve(escrowContract, signer);
      setRefunded(true);
      },
      handleRefund: async () => {
        escrowContract.on("Refunded", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            
            "✓ It's been refunded!";

        });

      await refund(escrowContract, signer);
      setRefunded(false);
      },

    };

    setEscrows([...escrows, escrow]);
  }

  
  async function contractList() {
    const tx = await findContractsDeployed(account);
    console.log(tx);
    setContracts(tx);    
  }

  return (
    <>
<div className="wrapper">
  <div className="box header" style={{textAlign: "center"}}>AU Escrow</div>
  <div className="box sidebar">
  <h1> New Contract </h1>
       
          <div >
          <input type="text" id="arbiter" placeholder="Arbiter Address"  className="inpt" style={{width: "91%"}}/>
          </div>

       
          <div>
          <input type="text" id="beneficiary" placeholder="Beneficiary Address" className="inpt" style={{width: "91%"}}/>
      </div>

      
          <div>
          <input type="text" id="ethtowei"   placeholder="Deposit Amount (in Eth)"  className="inpt" style={{width: "91%"}}/>
     
          </div>
        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
  </div>
  <div className="box sidebar2">
  <div
          className="button"
          id="contractList"
          onClick={(e) => {
            e.preventDefault();

            contractList();
          }}
        >
          Show deployer contracts
        </div>
<div>
<p>Current contract:</p>
                <p>&#8226;&nbsp;<span style={{fontSize: "12px"}}>{escrowsAddress}</span></p>
                <p>Previous contract:</p>
</div>
        <div>
          {
            contracts.length>0 ? (contracts.map((ctr, i) => {
              return (
                <div>

               
              <div key={ctr}>
                	&#8226;&nbsp;<span style={{fontSize: "12px"}}>{ctr}</span>
              </div>
              </div>
              );
            })):(<div></div>)
          }
        </div>
        <div>
         
        </div>
  </div>
  <div className="box content">
    
  <h1> Existing Contracts </h1>

<div id="container">
  {escrows.map((escrow) => {
    return <div><Escrow key={escrow.address} {...escrow} />
    <br></br>
    <Refund key={escrow.address} {...escrow} /></div>
  })}
</div>
  </div>
  <div className="box footer" style={{textAlign: "center"}}></div>
</div>
    </>
  );
}

export default App;
