import { useState, useEffect, createContext, useContext } from "react";
import Decimal from 'decimal.js';
import { useNotifier } from 'react-headless-notifier';
import { Multicall, ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import ERC20_ABI from "src/utils/erc20.json";
import { ethers, utils } from "ethers";
import { DangerNotification, SuccessNotification } from 'src/components/shared/Notification';
import { Web3Context } from "./web3.context";
import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { SwapContextInterface, SwapProviderInterface, SwapType, SwapStatusType, SelectTokenType } from  "src/types/contexts/swap.context";
import { SWAP_CONTRACTS } from "src/utils/constants";

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
    source: {symbol: "", name: "", decimals: 0, balanceOf: 0, img: ""},
    destination: {symbol: "", name: "", decimals: 0, balanceOf: 0, img: ""},
  },
  selectTokenList: {},
  swapSwitch: ()=>{},
  updateSwap: ()=>{},
  openSelectToken: ()=>{},
  debounceSelectToken: async(selectionUpdate: string, address: string)=>{},
  swapConfirm: async()=>{},
  clearSwapStatus: ()=>{},
  clearSelectTokenList: ()=>{},
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain, currentNetwork, walletAddress, isConnected, isChainChangeReload } = useContext(Web3Context);
  const { notify } = useNotifier();
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [swapStatus, setSwapStatus] = useState<SwapStatusType>(defaultValue.swapStatus);
  const [selectToken, setSelectToken] = useState<SelectTokenType>(defaultValue.selectToken);
  const [selectTokenList, setSelectTokenList] = useState<SelectTokenType>(defaultValue.selectTokenList);

  const contactSwapProviders = async(selectionUpdate: string) => {
    let provider: any = new ethers.providers.Web3Provider(ethereum);
    if(selectionUpdate === "Destination"){
      const currentChain = Number(swap[selectionUpdate.toLocaleLowerCase()].chain);
      if(SWAP_CONTRACTS[currentChain]?.RPC_URLS?.[0]){
        provider = new ethers.providers.JsonRpcProvider(SWAP_CONTRACTS[currentChain]?.RPC_URLS?.[0]);
      }else{
        provider = ethers.getDefaultProvider(SWAP_CONTRACTS[currentChain]?.NETWORK_SHORT_NAME?.toLocaleLowerCase());
      }
    }
    return provider;
  };

  const isTokenApprove = async() => {

  };
  
  const summarySwap = () => {

  };
  
  const getBalanceOf = async(selectionUpdate: string, selectTokenKey: string) => {
    try {
      const provider = await contactSwapProviders(selectionUpdate);
      const contract = new ethers.Contract(selectTokenKey, ERC20_ABI, provider);
      return Number(toBigNumber(utils.formatEther(await contract.balanceOf(walletAddress))).toDP(10).toString());
    } catch (error) {
      console.error("GetBalanceOf", error);
      return 0;
    }
  };

  const updateSwap = async(selectionUpdate: string, keyUpdate: string, objSwap: SwapType) => {
    const beforeSwitchSwapObj = {...swap};
    let _rete = 0, _fixFee = 2.5, _calCurrency: Decimal = toBigNumber(0), _selectToken = {...selectToken};
    try {
      if(selectionUpdate === "Source" && keyUpdate === "chain"){
        await walletSwitchChain(Number(objSwap.source.chain));
      }
      if(keyUpdate === "token"){
        const selectTokenKey = Object.keys(selectTokenList).filter((key)=> key === objSwap[selectionUpdate.toLocaleLowerCase()].token)?.[0];
        _selectToken = {...selectToken, [selectionUpdate.toLocaleLowerCase()]: { ...selectTokenList[selectTokenKey] } };

        let tokenSaveList = JSON.parse(localStorage.getItem("token") || "{}");
        // if(!tokenSaveList){
        //   const tokenListLimit = Object.fromEntries(Object.entries(tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""]).slice(-1));
        // }
        // tokenSaveList = {
        //   ...tokenSaveList, 
        //   [objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""]: {
        //     ...tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""],
        //     [selectTokenKey]: _selectToken[selectionUpdate.toLocaleLowerCase()]
        //   }
        // }; 
        tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""] = {...tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""], [selectTokenKey]: _selectToken[selectionUpdate.toLocaleLowerCase()]}
        const sortToken = Object.entries(tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""] || {}).sort((objA: any, objB: any) => {
          return objA[1].symbol.toLocaleLowerCase().localeCompare(objB[1].symbol.toLocaleLowerCase());
        });
        tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""] = Object.fromEntries(sortToken);
        localStorage.setItem("token", JSON.stringify(tokenSaveList));

        if(selectionUpdate === "Source"){
          _selectToken = {..._selectToken, [selectionUpdate.toLocaleLowerCase()]: { ..._selectToken[selectionUpdate.toLocaleLowerCase()], balanceOf: await getBalanceOf(selectionUpdate, selectTokenKey) }}
        }
        setSelectToken(_selectToken);

        if(selectionUpdate === "Source"){
          selectionUpdate = "destination"
          if(objSwap.destination.value !== "" && objSwap.destination.value !== undefined){
            _calCurrency = toBigNumber(0);
          }
        }else{
          if(objSwap.source.value !== "" && objSwap.source.value !== undefined){
            // _rete = _selectToken.destination.rate;
            _rete = 0;
            _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rete);
          }
        }
      }

      if(keyUpdate === "value"){
        // _rete = _selectToken.destination.rate;
        _rete = 1;
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
      // let reteSource = _selectToken.source.rate, reteDestination = _selectToken.destination.rate;
      let reteSource = 1, reteDestination = 1;
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
      console.log(error);
      
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
      // let reteSource = selectToken.destination.rate, reteDestination = selectToken.source.rate;
      let reteSource = 0, reteDestination = 0;
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
      setSwap(beforeSwitchSwapObj);
      setSelectToken(beforeSwitchTokenObj);
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
      setSwapStatus({...swapStatus, isSwitch: false});
    } 
  };


  const debounceSelectToken = async(selectionUpdate: string, address: string) => {
    try {
      const currentChain = (isConnected || walletAddress !== "")? await currentNetwork(): "";
      if(address.indexOf("0x") !== -1){
        const provider = await contactSwapProviders(selectionUpdate);
        const multicall = new Multicall({ ethersProvider: provider, tryAggregate: false });
        const contractCallContext: ContractCallContext[] = [{
          reference: 'selectToken',
          contractAddress: address,
          abi: ERC20_ABI,
          calls: [
            { reference: 'getName', methodName: 'name', methodParameters: [] },
            { reference: 'getSymbol', methodName: 'symbol', methodParameters: [] },
            { reference: 'getDecimals', methodName: 'decimals', methodParameters: [] },
            { reference: 'getBalanceOf', methodName: 'balanceOf', methodParameters: [walletAddress] },
          ]
        }];
        const results: ContractCallResults = await multicall.call(contractCallContext);
        setSelectTokenList({
          [address]: {
            symbol: results.results.selectToken.callsReturnContext[1].returnValues[0], 
            name: results.results.selectToken.callsReturnContext[0].returnValues[0], 
            decimals: results.results.selectToken.callsReturnContext[2].returnValues[0] 
          }
        });
      }else{
        let searchTokenList = JSON.parse(localStorage.getItem("token") || "{}");
        searchTokenList = Object.fromEntries(Object.entries(searchTokenList[currentChain] || {}).filter((token: any)=> token[1].symbol.toLocaleLowerCase().includes(address.toLocaleLowerCase()) || token[1].name.toLocaleLowerCase().includes(address.toLocaleLowerCase())));
        setSelectTokenList(searchTokenList);
      }
    } catch (error) {
      console.error("Token No results found.", error);
      setSelectTokenList(defaultValue.selectTokenList);
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

  const clearSelectTokenList = () => {
    setSelectTokenList(defaultValue.selectTokenList);
  };

  const clearSwapStatus = (objStatus: SwapStatusType = defaultValue.swapStatus) => {
    setSwapStatus(objStatus);
  };

  const openSelectToken = async(selectionUpdate: string) => {
    const defaultToken =  JSON.parse(localStorage.getItem("token") || "{}");
    let defaultTokenGetBalanceOf = await Promise.all(Object.entries(defaultToken[swap[selectionUpdate.toLocaleLowerCase()].chain || ""] || {}).map(async(list: any)=>{
      return [ list[0], {...list[1], balanceOf: await getBalanceOf(selectionUpdate, list[0])} ];
    }));
    if(defaultTokenGetBalanceOf.length > 0){
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setSelectTokenList(Object.fromEntries(defaultTokenGetBalanceOf));
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
        openSelectToken,
        debounceSelectToken,
        swapConfirm,
        clearSwapStatus,
        clearSelectTokenList,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
