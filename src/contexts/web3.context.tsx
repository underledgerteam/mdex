import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";

export interface Web3ContextInterface {
  walletAddress: string;
  signer: object,
  smartContractAddress: string;
  abi: object;
  smartContractSigner: object;
  handleConnectWallet: Function;
}

const defaultValue: Web3ContextInterface = {
  walletAddress: "",
  signer: {},
  smartContractAddress: "",
  abi: {},
  smartContractSigner: {},
  handleConnectWallet: () => { }
};

const { ethereum } = window;

export const Web3Context = createContext<Web3ContextInterface>(defaultValue);

export const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // user
  const [walletAddress, setWalletAddresss] = useState("");
  const [signer, setSigner] = useState({});
  // smart contract
  const [smartContractAddress, setSmartContractAddress] = useState("");
  const [abi, setAbi] = useState({});
  const [smartContractSigner, setSmartContractSigner] = useState({});


  const checkWalletIsConnected = async (): Promise<void> => {
    try {
      if (!ethereum) {
        alert('Please install Metamask!');
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setWalletAddresss(await signer.getAddress());
      setSigner(signer);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnectWallet = async (): Promise<void> => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setWalletAddresss(await signer.getAddress());
      setSigner(signer);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <Web3Context.Provider value={{
      walletAddress,
      signer,
      smartContractAddress,
      abi,
      smartContractSigner,
      handleConnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};