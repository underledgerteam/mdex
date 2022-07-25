import { useState, useEffect, createContext, useContext } from "react";
import Decimal from 'decimal.js';
import { useNotifier } from 'react-headless-notifier';
import { Multicall, ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import ERC20_ABI from "src/utils/erc20.json";
import { ethers, utils } from "ethers";
import { DangerNotification, SuccessNotification } from 'src/components/shared/Notification';
import { Web3Context } from "./web3.context";
import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { SwapContextInterface, SwapProviderInterface, SwapType, SwapStatusType, SelectTokenType, InputCurrencyType } from  "src/types/contexts/swap.context";
import { SWAP_CONTRACTS } from "src/utils/constants";
import WHITE_LIST_TOKEN from "src/utils/whiteListToken.json";
const { ethereum } = window;

const defaultValue: SwapContextInterface = {
  controllerApiBestRate: new AbortController(),
  swap: {
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined,value: undefined },
    summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: false, route: undefined },
  },
  swapStatus: {
    isApprove: true,
    isSwitch: true,
    isSwap: false,
    isTokenPool: true,
    isSwitchLoading: false,
    isSummaryLoading: false,
    isApproveLoading: false,
    isSuccess: false,
    isLink: "#"
  },
  selectToken: {
    source: {symbol: "", name: "", decimals: 0, balanceOf: 0, img: ""},
    destination: {symbol: "", name: "", decimals: 0, balanceOf: 0, img: ""},
  },
  inputCurrency: {
    source: {isDisabled: true, value: ""},
    destination: {isDisabled: true, value: ""},
  },
  selectTokenList: {},
  getSummaryBestRateSwap: ()=>{},
  swapSwitch: ()=>{},
  isTokenApprove: ()=>{},
  updateSwap: ()=>{},
  openSelectToken: ()=>{},
  debounceSelectToken: async(selectionUpdate: string, address: string)=>{},
  swapConfirm: async()=>{},
  clearSwapStatus: ()=>{},
  clearSelectTokenList: ()=>{},
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

let controllerApiBestRate =  new AbortController();

export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain, currentNetwork, walletAddress, isConnected, isChainChangeReload } = useContext(Web3Context);
  const { notify } = useNotifier();
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [swapContract, setSwapContract] = useState<ethers.Contract|null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract|null>(null);
  const [swapStatus, setSwapStatus] = useState<SwapStatusType>(defaultValue.swapStatus);
  const [selectToken, setSelectToken] = useState<SelectTokenType>(defaultValue.selectToken);
  const [inputCurrency, setInputCurrency] = useState<InputCurrencyType>(defaultValue.inputCurrency);
  const [selectTokenList, setSelectTokenList] = useState<SelectTokenType>(defaultValue.selectTokenList);

  const contactSwapProviders = async(selectionUpdate: string) => {
    let provider: any = new ethers.providers.Web3Provider(ethereum);
    if(selectionUpdate === "Source"){
      const currentChain = await currentNetwork();
      const getContractSwap = new ethers.Contract(SWAP_CONTRACTS[currentChain].SWAP_ADDRESS || "", SWAP_CONTRACTS[currentChain].SWAP_ABI || [], provider.getSigner());
      setSwapContract(getContractSwap);
    }
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
    if(tokenContract){
      setSwapStatus({...swapStatus, isApprove: false, isApproveLoading: true});
      const currentChain = await currentNetwork();
      const tokenStatus = await tokenContract.allowance(walletAddress, SWAP_CONTRACTS[currentChain].SWAP_ADDRESS);
      setSwapStatus({...swapStatus, isApprove: Number(utils.formatEther(tokenStatus.toString())) >= Number(swap.source.value)? true: false, isApproveLoading: false});
    }
  };
  
  const isTokenPool = async (address: string) => {
    const isExits = WHITE_LIST_TOKEN.find(x => x.address.toLocaleLowerCase() === address.toLocaleLowerCase());
    return (isExits || address === "")? true: false;
  };

  const getSummaryBestRateSwap = async(selectionUpdate: string, objSwap: SwapType) => {
    let retries = 5, success = false, summary = defaultValue.swap.summary;
    setSwap({...objSwap, [selectionUpdate==="Source"?"destination":"source"]: {...objSwap[selectionUpdate==="Source"?"destination":"source"], value: objSwap[selectionUpdate.toLocaleLowerCase()].value}});
    while (retries > 0 && !success) {
      setSwapStatus({...swapStatus, isSwap: true, isSummaryLoading: true });
      try {
        if(controllerApiBestRate.signal.aborted){
          controllerApiBestRate = new AbortController();
        }
        const response = await fetch(`${process.env.REACT_APP_API_BAST_RATE}/api/rate?tokenIn=${objSwap.source.token}&tokenOut=${objSwap.destination.token}&amount=${utils.parseEther(objSwap[selectionUpdate.toLocaleLowerCase()].value || "0").toString()}&chainId=${objSwap.source.chain}`, {
          signal: controllerApiBestRate.signal
        });
        const data = await response.json();
        const toFee = toBigNumber(utils.formatEther((toBigNumber(data.fee || "").toString()))).toDP(10);
        summary = { 
          fee: toFee.toString(), 
          recieve: toBigNumber(objSwap[selectionUpdate.toLocaleLowerCase()].value || 0).minus(toFee).toDP(10).toString(), 
          route: data.route,
          isSplitSwap: Boolean(data.isSplitSwap)
        };
        if(data.isSplitSwap){
          const sumExpected = data.amount.reduce((previous: number, current: number)=>{ return  toBigNumber(previous).plus(toBigNumber((current))).toDP(10) }, 0);
          summary = { ...summary, expected: utils.formatEther(sumExpected.toString()), amount: data.amount };
        }else{
          summary = { ...summary, expected: toBigNumber(utils.formatEther(data.amount.toString())).toDP(10).toString() }
        }
        success = true;
        if(selectionUpdate !== ""){
          const keyUpdate = (selectionUpdate==="Source")? "destination": "source";
          objSwap = {...objSwap, [keyUpdate]: {...objSwap[keyUpdate], value: objSwap[selectionUpdate.toLocaleLowerCase()].value }};
        }
        setSwap({...objSwap, summary});
        setSwapStatus({
          ...swapStatus, 
          isSwap: true, 
          isSummaryLoading: false,
          isSwitch: (objSwap.source.chain === undefined || objSwap.destination.chain === undefined) 
        });
      } catch (error: any) {
        setSwapStatus({...swapStatus, isSummaryLoading: false });
        if(error.name === 'AbortError'){
          success = true;
        }else{
          console.error(`Retries ${retries} GetSummaryBestRateSwap`, error);
          --retries;
        }
      }
    }
  };
  
  const getBalanceOf = async(selectionUpdate: string, selectTokenKey: string) => {
    let retries = 5, success = false, balance = 0;
    while (retries > 0 && !success) {
      try {
        const provider = await contactSwapProviders(selectionUpdate);
        const contract = new ethers.Contract(selectTokenKey, ERC20_ABI, provider);
        balance = Number(toBigNumber(utils.formatEther(await contract.balanceOf(walletAddress))).toDP(10).toString());
        success = true;
      } catch (error) {
        console.error(`Retries ${retries} GetBalanceOf`, error);
        --retries;
      }
    }
    return balance;
  };

  const updateSwap = async(selectionUpdate: string, keyUpdate: string, objSwap: SwapType) => {
    const beforeSwitchSwapObj = {...swap};
    const beforeSwitchCurrency = {...inputCurrency};
    const beforeSwitchToken = {...selectToken};
    const beforeSwitchSwapStatus = {...swapStatus};
    const provider = new ethers.providers.Web3Provider(ethereum);
    let _rete = 1, _calCurrency: Decimal = toBigNumber(0), _selectToken = {...selectToken};
    try {
      if(selectionUpdate === "Source" && keyUpdate === "chain"){
        setSwap(objSwap);
        setInputCurrency(defaultValue.inputCurrency);
        setSelectToken(defaultValue.selectToken);
        setSwapStatus({...swapStatus, isSwap: false});
        await walletSwitchChain(Number(objSwap.source.chain));
      }
      if(keyUpdate === "token"){
        const selectTokenKey = Object.keys(selectTokenList).filter((key)=> key === objSwap[selectionUpdate.toLocaleLowerCase()].token)?.[0];
        _selectToken = {...selectToken, [selectionUpdate.toLocaleLowerCase()]: { ...selectTokenList[selectTokenKey] } };
        
        let tokenSaveList = Object.create(JSON.parse(localStorage.getItem("token") || "{}"));
        tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""] = {...tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""], [selectTokenKey]: selectTokenList[selectTokenKey]}
        const sortToken = Object.entries(tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""] || {}).sort((objA: any, objB: any) => {
          delete objA[1].balanceOf;
          delete objB[1].balanceOf;
          return objA[1].symbol.toLocaleLowerCase().localeCompare(objB[1].symbol.toLocaleLowerCase());
        });
        tokenSaveList[objSwap[selectionUpdate.toLocaleLowerCase()].chain || ""] = Object.fromEntries(sortToken);
        localStorage.setItem("token", JSON.stringify(tokenSaveList));

        if(selectionUpdate === "Source"){
          const getContractToken = new ethers.Contract(selectTokenKey, ERC20_ABI || [], provider.getSigner());
          setTokenContract(getContractToken);
        }
        setSelectToken(_selectToken);
        let newInputCurrency = {...inputCurrency, [selectionUpdate.toLocaleLowerCase()]: {...inputCurrency[selectionUpdate.toLocaleLowerCase()], isDisabled: false}};
        if(selectionUpdate === "Source"){
          selectionUpdate = "destination"
          if(objSwap.destination.value !== "" && objSwap.destination.value !== undefined){
            _calCurrency = toBigNumber(objSwap.destination.value || 0).mul(_rete);
            newInputCurrency = {...newInputCurrency, [selectionUpdate.toLocaleLowerCase()]: {...newInputCurrency[selectionUpdate.toLocaleLowerCase()], value: _calCurrency.toDP(10, Decimal.ROUND_UP).toString()}};
          }
        }else{
          if(objSwap.source.value !== "" && objSwap.source.value !== undefined){
            _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rete);
            newInputCurrency = {...newInputCurrency, [selectionUpdate.toLocaleLowerCase()]: {...newInputCurrency[selectionUpdate.toLocaleLowerCase()], value: _calCurrency.toDP(10, Decimal.ROUND_UP).toString()}};
          }
        }
        setInputCurrency(newInputCurrency);
        _calCurrency = toBigNumber(0);
      }

      if(keyUpdate === "value"){
        let newInputCurrency = {
          ...inputCurrency, 
          [selectionUpdate.toLocaleLowerCase()]: {...inputCurrency[selectionUpdate.toLocaleLowerCase()], value: objSwap[selectionUpdate.toLocaleLowerCase()].value || ""}
        };
        if(selectionUpdate === "Source"){
          selectionUpdate = "destination";
          _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rete);
        }else{
          selectionUpdate = "source";
          _calCurrency = toBigNumber(objSwap.destination.value || 0).div(_rete);
        }
        if(objSwap[selectionUpdate.toLowerCase()].token !== undefined && objSwap[selectionUpdate.toLowerCase()].token !== ""){
          newInputCurrency = {...newInputCurrency, [selectionUpdate]: {...newInputCurrency[selectionUpdate], value: _calCurrency.toDP(10, Decimal.ROUND_UP).toString()}}
        }
        setInputCurrency(newInputCurrency);
        _calCurrency = toBigNumber(0);
      }
      objSwap = {...objSwap, [selectionUpdate.toLocaleLowerCase()]: {...objSwap[selectionUpdate.toLocaleLowerCase()], value: (Number(_calCurrency) !== 0? _calCurrency.toDP(10, Decimal.ROUND_UP): "").toString()}};

      const checkSourceUndefined = Object.values(objSwap.source).every((value)=>{ return (value !== undefined && value !== "")? true: false });
      const checkDestinationUndefined = Object.values(objSwap.destination).every((value)=>{ return (value !== undefined && value !== "")? true: false });
      const isSourceTokenPool = await isTokenPool(objSwap.source.token || "");
      const isDestinationTokenPool = await isTokenPool(objSwap.destination.token || "");

      setSwapStatus({
        ...swapStatus, 
        isSummaryLoading: false,
        isSwap: (checkSourceUndefined && checkDestinationUndefined), 
        isTokenPool: isSourceTokenPool && isDestinationTokenPool,
        isSwitch: (objSwap.source.chain === undefined || objSwap.destination.chain === undefined) 
      });
      setSwap(objSwap);
    } catch (error: any) {
      console.log(error);
      setSwap(beforeSwitchSwapObj);
      setInputCurrency(beforeSwitchCurrency);
      setSelectToken(beforeSwitchToken);
      setSwapStatus(beforeSwitchSwapStatus);
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
    const beforeSwitchCurrencyObj = {...inputCurrency};
    try {
      setSwapStatus({...swapStatus, isSwitch: true, isSwitchLoading: true});
      setSelectToken({
        source: {...beforeSwitchTokenObj.destination, balanceOf: beforeSwitchSwapObj.destination.token !== undefined? await getBalanceOf("Destination", beforeSwitchSwapObj.destination.token || ""): undefined},
        destination: beforeSwitchTokenObj.source,
      });
      setInputCurrency({
        source: beforeSwitchCurrencyObj.destination,
        destination: beforeSwitchCurrencyObj.source,
      });
      const checkSourceUndefined = Object.values(swap.source).every((value)=>{ return (value !== undefined && value !== "")? true: false });
      const checkDestinationUndefined = Object.values(swap.destination).every((value)=>{ return (value !== undefined && value !== "")? true: false });
      const isSourceTokenPool = await isTokenPool(swap.destination.token || "");
      const isDestinationTokenPool = await isTokenPool(swap.destination.token || "");

      setSwapStatus({...swapStatus, isSummaryLoading: true });
      setSwap({...swap, source: {...swap.destination}, destination: {...swap.source}, summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: false, route: undefined }});
      if(checkSourceUndefined && checkDestinationUndefined && isSourceTokenPool && isDestinationTokenPool){
        await getSummaryBestRateSwap("Source", {...swap, source: {...swap.destination}, destination: {...swap.source}});
      }
      await walletSwitchChain(Number(swap.destination.chain));
      setSwapStatus({...swapStatus, isSwitch: false, isSwitchLoading: false});
    } catch (error: any) {
      setSwap(beforeSwitchSwapObj);
      setSelectToken(beforeSwitchTokenObj);
      setInputCurrency(beforeSwitchCurrencyObj);
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
        searchTokenList = Object.entries(searchTokenList[currentChain] || {}).filter((token: any)=> token[1].symbol.toLocaleLowerCase().includes(address.toLocaleLowerCase()) || token[1].name.toLocaleLowerCase().includes(address.toLocaleLowerCase()));
        searchTokenList = await Promise.all(Object.entries(searchTokenList).map(async(list: any)=>{
          return {...list[1], [1]: {...list[1][1], balanceOf: await getBalanceOf(selectionUpdate, list[1][0]) }};
        }));
        setSelectTokenList(Object.fromEntries(searchTokenList));
      }
    } catch (error) {
      console.error("Token No results found.", error);
      setSelectTokenList(defaultValue.selectTokenList);
    }
  };

  const swapConfirm = async(isApprove: boolean, handelSuccess: Function = ()=>{}, handelFail: Function = ()=>{}) => {
    try {
      setSwapStatus({...swapStatus, isApproveLoading: true});
      const currentChain = await currentNetwork();
      if(isApprove){
        if(swapContract){
          let resultSwap, params = [swap.source.token, swap.destination.token, utils.parseEther(swap.source.value || "0").toString()];
          if(swap.summary.isSplitSwap){
            const resultRouteIndex = swap.summary.route?.map(route => Number(route.index));
            resultSwap = await swapContract.splitSwap(...params, JSON.stringify(resultRouteIndex), JSON.stringify(swap.summary.amount));
          }else{
            resultSwap = await swapContract.swap(...params, swap.summary.route?.[0].index);
          }
          await resultSwap.wait();
          setSwapStatus({...swapStatus, isSuccess: true, isLink: `${SWAP_CONTRACTS[currentChain].BLOCK_EXPLORER_URLS?.[0]}/tx/${resultSwap.hash}`, isApproveLoading: false});
          setSelectToken({...selectToken, source: {...selectToken.source, balanceOf: toBigNumber(selectToken.source.balanceOf || "").minus(toBigNumber(swap.source.value || "")).toDP(10).toNumber() }});
          setSwap({
            ...swap,
            source: { ...swap.source, value: undefined },
            destination: { ...swap.destination, value: undefined },
            summary: { ...defaultValue.swap.summary }
          });
          handelSuccess("Swap Success");
        }else{
          handelFail("Can't Connect Swap Contract");
        }
      }else{
        if(tokenContract){
          const resultApprove = await tokenContract.approve(SWAP_CONTRACTS[currentChain].SWAP_ADDRESS, utils.parseEther(swap.source.value || "0").toString());
          await resultApprove.wait();
          setSwapStatus({...swapStatus, isApproveLoading: false, isApprove: true});
          handelSuccess("Approve Success");
        }else{
          handelFail("Can't Connect Token Contract");
        }
      }
    } catch (error: any) {
      setSwapStatus({...swapStatus, isApproveLoading: false});
      handelFail((isApprove)?"Can't Swap Fail": "Can't Approve Fail");
    }
  };

  const clearSelectTokenList = () => {
    setSelectTokenList(defaultValue.selectTokenList);
  };

  const clearSwapStatus = (objStatus: SwapStatusType = defaultValue.swapStatus) => {
    setSwapStatus(objStatus);
  };

  const clearSwap = (objSwap: SwapType = defaultValue.swap) => {
    setSwap(objSwap);
  };

  const openSelectToken = async(selectionUpdate: string) => {
    const defaultToken =  JSON.parse(localStorage.getItem("token") || "{}");
    let defaultTokenGetBalanceOf = await Promise.all(Object.entries(defaultToken[swap[selectionUpdate.toLocaleLowerCase()].chain || ""] || {}).map(async(list: any)=>{
      return [ list[0], {...list[1], balanceOf: (selectionUpdate==="Source")? await getBalanceOf(selectionUpdate, list[0]): undefined} ];
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
        destination: { chain: currentChain.toString(), token: undefined,value: undefined },
        summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: false, route: undefined },
      });
      setSelectTokenList(defaultValue.selectTokenList);
      setSwapStatus(defaultValue.swapStatus);
    })();
  },[walletAddress, isConnected, isChainChangeReload]);

  return (
    <SwapContext.Provider
      value={{
        controllerApiBestRate,
        swap,
        swapStatus,
        selectToken,
        inputCurrency,
        selectTokenList,
        getSummaryBestRateSwap,
        swapSwitch,
        isTokenApprove,
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
