import { useState, useEffect, createContext } from "react";

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
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [reloadSwitch, setReloadSwitch] = useState<boolean>(defaultValue.reloadSwitch);

  const updateSwap = (objSwap: SwapType) => {
    setSwap(objSwap);
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
