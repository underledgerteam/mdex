import { useState, useEffect, createContext, useContext } from "react";
import { useNotifier } from 'react-headless-notifier';
import { DangerNotification } from 'src/components/shared/Notification';
import { Web3Context } from "./web3.context";
import { SwapContextInterface, SwapProviderInterface, SwapType, SwapStatusType, SelectTokenList, SelectTokenType } from  "src/types/contexts/swap.context"
const defaultValue: SwapContextInterface = {
  swap: {
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined,value: undefined },
  },
  swapStatus: {
    isApprove: false,
    isSwitch: true,
    isSwap: false,
    isTokenPool: true,
    isLoading: false
  },
  selectToken: {
    source: {label: "", subLabel: "", value: "", img: "", maxAmount: 0, rate: 0},
    destination: {label: "", subLabel: "", value: "", img: "", maxAmount: 0, rate: 0},
  },
  selectTokenList: [],
  swapSwitch: ()=>{},
  updateSwap: ()=>{},
  debounceSelectToken: async(value: string)=>{}
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain, currentNetwork, walletAddress, isConnected } = useContext(Web3Context);
  const { notify } = useNotifier();
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [swapStatus, setSwapStatus] = useState<SwapStatusType>(defaultValue.swapStatus);
  const [selectToken, setSelectToken] = useState<SelectTokenType>(defaultValue.selectToken);
  const [selectTokenList, setSelectTokenList] = useState<SelectTokenList[]>(defaultValue.selectTokenList);

  const updateSwap = async(selectionUpdate: string, keyUpdate: string, objSwap: SwapType) => {
    const beforeSwitchSwapObj = {...swap};
    try {
      if(selectionUpdate === "Source" && keyUpdate === "chain"){
        await walletSwitchChain(Number(objSwap.source.chain));
      }
      let rete = 0, calCurrency = 0;

      if(keyUpdate === "token"){
        const select = selectTokenList.filter((x)=> x.value === objSwap[selectionUpdate.toLocaleLowerCase()].token)?.[0];
        setSelectToken({...selectToken, [selectionUpdate.toLocaleLowerCase()]: {...select, label: <div className="flex items-center"><img className="mask mask-squircle mr-1" src={select.img} width={30} /> {select.label}</div>} });
        
        if(selectionUpdate === "Source"){
          selectionUpdate = "destination"
          if(objSwap.destination.value !== "" && objSwap.destination.value !== undefined){
            calCurrency = 0;
          }
        }else{
          if(objSwap.source.value !== "" && objSwap.source.value !== undefined){
            rete = select.rate;
            calCurrency = Number(objSwap.source.value || 0) * rete;
          }
        }
      }

      if(keyUpdate === "value"){
        rete = selectToken.destination.rate;
        if(selectionUpdate === "Source"){
          selectionUpdate = "destination";
          calCurrency = Number(objSwap.source.value || 0) * rete;
        }else{
          selectionUpdate = "source";
          calCurrency = Number(objSwap.destination.value || 0) / rete;
        }
      }
      
      objSwap = {...objSwap, [selectionUpdate.toLocaleLowerCase()]: {...objSwap[selectionUpdate.toLocaleLowerCase()], value: (calCurrency !== 0? calCurrency: "").toString()}};
      const checkSwapUndefined = Object.values({...objSwap.source, ...objSwap.destination}).every((value)=>{ return (value !== undefined && value !== "")? true: false });
      setSwapStatus({
        ...swapStatus, 
        isSwap: checkSwapUndefined, 
        isTokenPool: objSwap.source.token !== objSwap.destination.token, // Mock Not Token Pool in Pool
        isSwitch: (objSwap.source.chain === undefined || objSwap.destination.chain === undefined) 
      });
      setSwap(objSwap);
    } catch (error: any) {
      setSwap(beforeSwitchSwapObj);
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    }
  };

  const swapSwitch = async() => {
    const beforeSwitchSwapObj = {...swap};
    try {
      setSwapStatus({...swapStatus, isSwitch: true});
      setSwap({
        source: {...swap.destination, token: undefined, value: undefined},
        destination: {...swap.source, token: undefined, value: undefined}
      });
      setSelectToken({
        source: {label: "", subLabel: "", value: "", img: "", maxAmount: 0, rate: 0},
        destination: {label: "", subLabel: "", value: "", img: "", maxAmount: 0, rate: 0}
      });
      await walletSwitchChain(Number(swap.destination.chain));
      setSwapStatus({...swapStatus, isSwitch: false});
    } catch (error: any) {
      setSwap({
        source: {...beforeSwitchSwapObj.source, token: undefined, value: undefined},
        destination: {...beforeSwitchSwapObj.destination, token: undefined, value: undefined}
      });
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
      setSwapStatus({...swapStatus, isSwitch: false});
    } 
  };

  const debounceSelectToken = async(value: string) => {
    if(value === "0x0"){
      setSelectTokenList([]);
    }else{
      setSelectTokenList([{
        label: "ETH (Rate 1.5)", subLabel: "Ether (Fix Rate 1.5)", value: "1", img: "https://placeimg.com/160/160/arch", maxAmount: 1000, rate: 1.5
      },{
        label: "BNB (Rate 0.7)", subLabel: "Binance Coin (Fix Rate 0.7)", value: "2", img: "https://placeimg.com/160/160/arch", maxAmount: 500, rate: 0.7
      },{
        label: "AVAX (Rate 1.75)", subLabel: "Avalance (Fix Rate 1.75)", value: "3", img: "https://placeimg.com/160/160/arch", maxAmount: 1235, rate: 1.75
      }]);
    }
  };

  useEffect(()=>{
    (async()=>{
      const currentChain = (isConnected || walletAddress !== "")? await currentNetwork(): "";
      setSwap({
        source: { chain: currentChain.toString(), token: undefined, value: undefined },
        destination: { chain: undefined, token: undefined,value: undefined }
      });
    })();
  },[walletAddress, isConnected]);

  return (
    <SwapContext.Provider
      value={{
        swap,
        swapStatus,
        selectToken,
        selectTokenList,
        swapSwitch,
        updateSwap,
        debounceSelectToken
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
