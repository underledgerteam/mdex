import { useState, useEffect, createContext, useContext } from "react";
import { Web3Context } from "./web3.context";
import { SwapContextInterface, SwapProviderInterface, SwapType } from  "src/types/contexts/swap.context"
const defaultValue: SwapContextInterface = {
  reloadSwitch: false,
  swap:{
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined,value: undefined }
  },
  swapSwitch: ()=>{},
  updateSwap: ()=>{},
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain } = useContext(Web3Context);
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [reloadSwitch, setReloadSwitch] = useState<boolean>(defaultValue.reloadSwitch);

  const updateSwap = async(objSwap: SwapType) => {
    const beforeSwitchSwapObj = swap;
    try {
      await walletSwitchChain(Number(objSwap.source.chain));
      setSwap(objSwap);
    } catch (error: any) {
      console.error(error);
      setSwap(beforeSwitchSwapObj);
      setReloadSwitch(!reloadSwitch);
    }
  };

  const swapSwitch = () => {
    setSwap({
      source: {...swap.destination, token: undefined, value: undefined},
      destination: {...swap.source, token: undefined, value: undefined}
    })
    setReloadSwitch(!reloadSwitch);
  };

  return (
    <SwapContext.Provider
      value={{
        reloadSwitch,
        swap,
        swapSwitch,
        updateSwap,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
