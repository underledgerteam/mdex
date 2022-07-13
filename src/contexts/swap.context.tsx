import { useState, useEffect, createContext, useContext } from "react";
import Decimal from 'decimal.js';
import { useNotifier } from 'react-headless-notifier';
import { Multicall, ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import ERC20_ABI from "src/utils/erc20.json";
import { ethers, utils } from "ethers";
import { DangerNotification, SuccessNotification } from 'src/components/shared/Notification';
import { Web3Context } from "./web3.context";
import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { SwapContextInterface, SwapProviderInterface, SwapType, SwapStatusType, SelectTokenList, SelectTokenType } from  "src/types/contexts/swap.context"

const { ethereum } = window;

const defaultValue: SwapContextInterface = {
  swap: {
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined,value: undefined },
    summary: { fee: undefined, recieve: undefined, expected: undefined },
  },
  swapStatus: {
    isApprove: true,
    isSwitch: true,
    isSwap: false,
    isTokenPool: true,
    isLoading: false,
    isSuccess: false,
    isLink: "#"
  },
  selectToken: {
    source: {label: "", tokenName: "", subLabel: "", value: "", img: "", maxAmount: 0, rate: 0},
    destination: {label: "", tokenName: "", subLabel: "", value: "", img: "", maxAmount: 0, rate: 0},
  },
  selectTokenList: [],
  swapSwitch: ()=>{},
  updateSwap: ()=>{},
  debounceSelectToken: async(value: string)=>{},
  swapConfirm: async()=>{},
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain, currentNetwork, walletAddress, isConnected, isChainChangeReload } = useContext(Web3Context);
  const { notify } = useNotifier();
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [swapStatus, setSwapStatus] = useState<SwapStatusType>(defaultValue.swapStatus);
  const [selectToken, setSelectToken] = useState<SelectTokenType>(defaultValue.selectToken);
  const [selectTokenList, setSelectTokenList] = useState<SelectTokenList[]>(defaultValue.selectTokenList);

  const updateSwap = async(selectionUpdate: string, keyUpdate: string, objSwap: SwapType) => {
    const beforeSwitchSwapObj = {...swap};
    let _rete = 0, _fixFee = 2.5, _calCurrency: Decimal = toBigNumber(0), _selectToken = {...selectToken};
    try {
      if(selectionUpdate === "Source" && keyUpdate === "chain"){
        await walletSwitchChain(Number(objSwap.source.chain));
      }
      if(keyUpdate === "token"){
        const select = selectTokenList.filter((x)=> x.value === objSwap[selectionUpdate.toLocaleLowerCase()].token)?.[0];
        _selectToken = {...selectToken, [selectionUpdate.toLocaleLowerCase()]: {...select, label: <div className="flex items-center"><img className="mask mask-squircle mr-1" src={select.img} width={30} /> <p className="text-ellipsis-1">{select.label}</p></div>} }
        setSelectToken(_selectToken);
        
        if(selectionUpdate === "Source"){
          selectionUpdate = "destination"
          if(objSwap.destination.value !== "" && objSwap.destination.value !== undefined){
            _calCurrency = toBigNumber(0);
          }
        }else{
          if(objSwap.source.value !== "" && objSwap.source.value !== undefined){
            _rete = _selectToken.destination.rate;
            _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rete);
          }
        }
      }

      if(keyUpdate === "value"){
        _rete = _selectToken.destination.rate;
        if(selectionUpdate === "Source"){
          selectionUpdate = "destination";
          _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rete);
        }else{
          selectionUpdate = "source";
          _calCurrency = toBigNumber(objSwap.destination.value || 0).div(_rete);
        }
      }
      
      objSwap = {...objSwap, [selectionUpdate.toLocaleLowerCase()]: {...objSwap[selectionUpdate.toLocaleLowerCase()], value: (Number(_calCurrency) !== 0? _calCurrency.toDP(10, Decimal.ROUND_UP): "").toString()}};
      
      // start calculator fee / recieve / expected
      let reteSource = _selectToken.source.rate, reteDestination = _selectToken.destination.rate;
      const sourceValue = toBigNumber(objSwap.source.value || 0);
      const fee = (sourceValue.mul(_fixFee)).div(100);
      const recieve = sourceValue.minus(fee);
      const expected = (recieve.mul(reteDestination)).div(reteSource);
      objSwap = {...objSwap, summary: { fee: fee.toDP(10, Decimal.ROUND_UP).toString(), recieve: recieve.toDP(10, Decimal.ROUND_UP).toString(), expected: expected.toDP(10, Decimal.ROUND_UP).toString() } };
      // end calculator fee / recieve / expected
      
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
    const beforeSwitchTokenObj = {...selectToken};
    const _fixFee = 2.5;
    try {
      setSwapStatus({...swapStatus, isSwitch: true});
      
      // start calculator fee / recieve / expected
      let reteSource = selectToken.destination.rate, reteDestination = selectToken.source.rate;
      const sourceValue = toBigNumber(swap.destination.value || 0);
      const fee = (sourceValue.mul(_fixFee)).div(100);
      const recieve = sourceValue.minus(fee);
      const expected = (recieve.mul(reteDestination)).div(reteSource);
      // end calculator fee / recieve / expected

      setSwap({
        source: {...swap.destination},
        destination: {...swap.source},
        summary: { fee: fee.toDP(10, Decimal.ROUND_UP).toString(), recieve: recieve.toDP(10, Decimal.ROUND_UP).toString(), expected: expected.toDP(10, Decimal.ROUND_UP).toString() },
      });
      setSelectToken({
        source: beforeSwitchTokenObj.destination,
        destination: beforeSwitchTokenObj.source,
      });
      await walletSwitchChain(Number(swap.destination.chain));
      setSwapStatus({...swapStatus, isSwitch: false});
    } catch (error: any) {
      setSwap({
        source: {...beforeSwitchSwapObj.source},
        destination: {...beforeSwitchSwapObj.destination},
        summary: {...beforeSwitchSwapObj.summary},
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
    try {
      if(value.indexOf("0x") !== -1){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const multicall = new Multicall({ ethersProvider: provider, tryAggregate: false });
        const contractCallContext: ContractCallContext[] = [{
          reference: 'selectToken',
          contractAddress: value,
          abi: ERC20_ABI,
          calls: [
            { reference: 'getName', methodName: 'name', methodParameters: [] },
            { reference: 'getSymbol', methodName: 'symbol', methodParameters: [] },
            { reference: 'getDecimals', methodName: 'decimals', methodParameters: [] },
            { reference: 'getBalanceOf', methodName: 'balanceOf', methodParameters: [walletAddress] },
          ]
        }];
    
        const results: ContractCallResults = await multicall.call(contractCallContext);
        setSelectTokenList([{
          label: results.results.selectToken.callsReturnContext[1].returnValues[0], 
          tokenName: results.results.selectToken.callsReturnContext[1].returnValues[0], 
          subLabel: results.results.selectToken.callsReturnContext[0].returnValues[0], 
          value: "1", 
          address: value,
          img: "https://placeimg.com/160/160/arch", 
          maxAmount: Number(toBigNumber(utils.formatEther(results.results.selectToken.callsReturnContext[3].returnValues[0].hex)).toDP(10).toString()), rate: 1.5
        }]);
      }else{
        const mockData = [{
          label: "ETH (Rate 1.5)", tokenName: "ETH", subLabel: "Ether (Fix Rate 1.5)", value: "1", img: "https://placeimg.com/160/160/arch", maxAmount: 1000, rate: 1.5
        },{
          label: "BNB (Rate 0.7)", tokenName: "BNB", subLabel: "Binance Coin (Fix Rate 0.7)", value: "2", img: "https://placeimg.com/160/160/arch", maxAmount: 500, rate: 0.7
        },{
          label: "AVAX (Rate 1.75)", tokenName: "AVAX", subLabel: "Avalance (Fix Rate 1.75)", value: "3", img: "https://placeimg.com/160/160/arch", maxAmount: 1235, rate: 1.75
        },{
          label: "BTC (Rate 3)", tokenName: "BTC", subLabel: "BitCoin (Fix Rate 3)", value: "4", img: "https://placeimg.com/160/160/arch", maxAmount: 48, rate: 3
        }];
        setSelectTokenList(mockData.filter((x)=> x.tokenName.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1));
      }
    } catch (error) {
      console.log("Token No results found.");
      setSelectTokenList([]);
    }
  };

  const swapConfirm = async(isApprove: boolean, handelSuccess: Function = ()=>{}, handelFail: Function = ()=>{}) => {
    try {
      setSwapStatus({...swapStatus, isLoading: true});
      if(isApprove){
        setTimeout(()=>{
          setSwapStatus({...swapStatus, isSuccess: true, isLink: "https://mumbai.polygonscan.com/", isLoading: false});
          handelSuccess();
          notify(
            <SuccessNotification 
              message="Swap Success"
            />
          );
        }, 1500);
      }else{
        setTimeout(()=>{
          setSwapStatus({...swapStatus, isLoading: false});
          handelSuccess();
          notify(
            <SuccessNotification 
              message="Approve Success"
            />
          );
        }, 1500);
      }
    } catch (error: any) {
      setSwapStatus({...swapStatus, isLoading: false});
      handelFail();
      throw new Error("Can't Swap Token");
    }
  };

  useEffect(()=>{
    (async()=>{
      const currentChain = (isConnected || walletAddress !== "")? await currentNetwork(): "";
      setSwap({
        source: { chain: currentChain.toString(), token: undefined, value: undefined },
        destination: { chain: undefined, token: undefined,value: undefined },
        summary: { fee: undefined, recieve: undefined, expected: undefined },
      });
      setSelectTokenList(defaultValue.selectTokenList);
      setSwapStatus(defaultValue.swapStatus);
    })();
  },[walletAddress, isConnected, isChainChangeReload]);

  return (
    <SwapContext.Provider
      value={{
        swap,
        swapStatus,
        selectToken,
        selectTokenList,
        swapSwitch,
        updateSwap,
        debounceSelectToken,
        swapConfirm
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
