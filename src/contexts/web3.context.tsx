import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";

import { SWAP_CONTRACTS } from "src/utils/constants";
export interface Web3ContextInterface {
  walletAddress: string;
  isConnected: boolean;
  walletSwitchChain: (chainId: number) => void,
  handleConnectWallet: Function;
}

const defaultValue: Web3ContextInterface = {
  walletAddress: "",
  isConnected: false,
  walletSwitchChain: () => { },
  handleConnectWallet: () => { }
};

const { ethereum } = window;

export const Web3Context = createContext<Web3ContextInterface>(defaultValue);

export const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // user
  const [walletAddress, setWalletAddresss] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const checkWalletIsConnected = async (): Promise<void> => {
    try {
      if (!ethereum) {
        alert('Please install Metamask!');
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setWalletAddresss(await signer.getAddress());
      setIsConnected(true);
    } catch (e) {
      console.error(e);
    }
  };
  const walletAddChain = async (chainId: number) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("wallet_addEthereumChain", [{
        chainId: ethers.utils.hexlify(Number(chainId))?.replace("0x0", "0x"),
        chainName: SWAP_CONTRACTS[chainId].NETWORK_NAME,
        nativeCurrency: {
          name: SWAP_CONTRACTS[chainId].NATIVE_CURRENCY!.NAME,
          symbol: SWAP_CONTRACTS[chainId].NATIVE_CURRENCY!.SYMBOL,
          decimals: SWAP_CONTRACTS[chainId].NATIVE_CURRENCY!.DECIMALS,
        },
        rpcUrls: SWAP_CONTRACTS[chainId].RPC_URLS,
        blockExplorerUrls: SWAP_CONTRACTS[chainId].BLOCK_EXPLORER_URLS,
      }]);
    } catch (error) {
      throw new Error(`Can't Add ${SWAP_CONTRACTS[chainId].NETWORK_NAME} to Wallet`);
    }
  };
  const walletSwitchChain = async (chainId: number) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId: currentChain } = await provider.getNetwork();
      if(chainId !== currentChain){
        await provider.send("wallet_switchEthereumChain", [{ chainId: ethers.utils.hexlify(chainId)?.replace("0x0", "0x") }]);
      }
    } catch (error: any) {
      if(error.code === 4902){
        await walletAddChain(chainId);
      }
      throw new Error("Can't Switch Chain");
    }
  };
  const handleConnectWallet = async (): Promise<void> => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setWalletAddresss(await signer.getAddress());
      setIsConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (walletAddress === "" && !isConnected) {
      checkWalletIsConnected();
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      walletAddress,
      isConnected,
      walletSwitchChain,
      handleConnectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};