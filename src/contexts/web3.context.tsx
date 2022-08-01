import { useState, useEffect, createContext } from "react";
import { ethers, ContractInterface, Contract } from "ethers";
import { SUPPORT_CHAIN } from "src/utils/constants";

import { SWAP_CONTRACTS } from "src/utils/constants";
export interface Web3ContextInterface {
  walletAddress: string;
  isConnected: boolean;
  isSupported: boolean;
  isChainChangeReload: boolean;
  currentNetwork: () => Promise<number>;
  handleConnectWallet: Function;
  walletSwitchChain: (chainId: number) => void;
}

const defaultValue: Web3ContextInterface = {
  walletAddress: "",
  isConnected: false,
  isSupported: false,
  isChainChangeReload: false,
  currentNetwork: async() => { return 0; },
  handleConnectWallet: () => { },
  walletSwitchChain: () => { },
};

const { ethereum } = window;

export const Web3Context = createContext<Web3ContextInterface>(defaultValue);

export const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // user
  let isChainChange = false;
  const [walletAddress, setWalletAddresss] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [contractToken, setContractToken] = useState<Contract | null>(null);
  const [isChainChangeReload, setIsChainChangeReload] = useState(isChainChange);
  const createContract = async() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract("address", "abi", provider);
  };

  const createTokenContract = async(address: string, abi: ContractInterface) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const getContractToken = new ethers.Contract(address, abi, provider);
    setContractToken(getContractToken);
  };

  const checkWalletIsConnected = async (): Promise<void> => {
    try {
      if (!ethereum) {
        alert('Please install Metamask!');
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork();

      setWalletAddresss(await signer.getAddress());
      setIsConnected(true);
      setIsSupported(SUPPORT_CHAIN.includes(chainId));
    } catch (e) {
      console.error(e);
    }
  };
  const walletAddChain = async (chainId: number): Promise<void> => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("wallet_addEthereumChain", [{
        chainId: ethers.utils.hexValue(Number(chainId)),
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
  const currentNetwork = async() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const { chainId } = await provider.getNetwork();
    return chainId;
  };
  const walletSwitchChain = async (chainId: number): Promise<void> => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const currentChain = await currentNetwork();
      if (chainId !== currentChain) {
        await provider.send("wallet_switchEthereumChain", [{ chainId: ethers.utils.hexValue(chainId) }]);
      }
    } catch (error: any) {
      if (error.code === 4902) {
        await walletAddChain(chainId);
      }
      throw new Error("Can't Switch Chain");
    }
  };
  const handleConnectWallet = async (): Promise<void> => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
    } catch (e) {
      console.error(e);
    }
  };
  const handleAccountChange = (accounts: Array<string>): void => {
    if (accounts.length > 0) {
      setWalletAddresss(accounts[0]);
    } else {
      window.location.reload();
    }
  };
  const handleChainChange = (chainId: string): void => {
    // window.location.reload();
    isChainChange = !isChainChange;
    setIsChainChangeReload(isChainChange);
  };

  useEffect(() => {
    const init = async () => {
      await checkWalletIsConnected();
      ethereum?.on("accountsChanged", handleAccountChange);
      ethereum?.on("chainChanged", handleChainChange);
    };
    init();
    return () => {
      ethereum?.removeListener("accountsChanged", handleAccountChange);
      ethereum?.removeListener("chainChanged", handleChainChange);
    };
  }, [walletAddress]);

  return (
    <Web3Context.Provider value={{
      walletAddress,
      isConnected,
      isSupported,
      isChainChangeReload,
      currentNetwork,
      handleConnectWallet,
      walletSwitchChain,
    }}>
      {children}
    </Web3Context.Provider>
  );
};