import { useState, useEffect, createContext } from "react";

import { SwapContextInterface, SwapProviderInterface, SwapType } from  "src/types/contexts/swap.context"

export const SwapContext = createContext<SwapContextInterface | undefined>(undefined);

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const [swap, setSwap] = useState<SwapType>({
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined,value: undefined }
  });
  const [reloadSwitch, setReloadSwitch] = useState(false);

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
        swapSwitch,
        updateSwap,
        reloadSwitch,
        swap
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
