import { useState, useEffect, createContext, useContext } from "react";
import { useNotifier } from 'react-headless-notifier';
import { DangerNotification } from 'src/components/shared/Notification';
import { Web3Context } from "./web3.context";
import { SwapContextInterface, SwapProviderInterface, SwapType } from  "src/types/contexts/swap.context"
const defaultValue: SwapContextInterface = {
  reloadSwitch: false,
  swap: {
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined,value: undefined }
  },
  swapSwitch: ()=>{},
  updateSwap: ()=>{},
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain, currentNetwork } = useContext(Web3Context);
  const { notify } = useNotifier();
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [reloadSwitch, setReloadSwitch] = useState<boolean>(defaultValue.reloadSwitch);

  const updateSwap = async(selectionUpdate: string, keyUpdate: string, objSwap: SwapType) => {
    const beforeSwitchSwapObj = swap;
    try {
      if(selectionUpdate==="Source" && keyUpdate === "chain"){
        await walletSwitchChain(Number(objSwap.source.chain));
      }
      setSwap(objSwap);
    } catch (error: any) {
      console.error(error);
      setSwap(beforeSwitchSwapObj);
      setReloadSwitch(!reloadSwitch);
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    }
  };

  const swapSwitch = async() => {
    const beforeSwitchSwapObj = swap;
    let isSwitch = reloadSwitch;
    try {
      setSwap({
        source: {...swap.destination, token: undefined, value: undefined},
        destination: {...swap.source, token: undefined, value: undefined}
      })
      isSwitch = !isSwitch;
      setReloadSwitch(isSwitch);
      await walletSwitchChain(Number(swap.destination.chain));
    } catch (error: any) {
      console.error(error);
      setSwap(beforeSwitchSwapObj);
      setReloadSwitch(!isSwitch);
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    } 
  };

  useEffect(()=>{
    (async()=>{
      const currentChain = await currentNetwork();
      setSwap({
        source: { chain: currentChain.toString(), token: undefined, value: undefined },
        destination: { chain: undefined, token: undefined,value: undefined }
      });
      setReloadSwitch(!reloadSwitch);
    })();
  },[])
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
