import { useState, useEffect, createContext, useContext } from "react";
import Decimal from 'decimal.js';
import { useNotifier } from 'react-headless-notifier';
import { Multicall, ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import ERC20_ABI from "src/utils/erc20.json";
import { ethers, utils } from "ethers";
import { DangerNotification } from 'src/components/shared/Notification';
import { Web3Context } from "./web3.context";
import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { SwapContextInterface, SwapProviderInterface, SwapType, SwapStatusType, SelectTokenType, InputCurrencyType } from "src/types/contexts/swap.context";
import { SWAP_CONTRACTS, GAS_LIMIT } from "src/utils/constants";
import WHITE_LIST_TOKEN from "src/utils/whiteListToken.json";
const { ethereum } = window;

const defaultValue: SwapContextInterface = {
  controllerApiBestRate: new AbortController(),
  swap: {
    source: { chain: undefined, token: undefined, value: undefined },
    destination: { chain: undefined, token: undefined, value: undefined },
    summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: undefined, route: undefined },
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
    source: { symbol: "", name: "", decimals: 0, balanceOf: 0, img: "" },
    destination: { symbol: "", name: "", decimals: 0, balanceOf: 0, img: "" },
  },
  inputCurrency: {
    source: { isDisabled: true, value: "" },
    destination: { isDisabled: true, value: "" },
  },
  selectTokenList: {},
  getSummaryBestRateSwap: () => { },
  swapSwitch: () => { },
  isTokenApprove: () => { },
  updateSwap: () => { },
  openSelectToken: () => { },
  debounceSelectToken: async (selectionUpdate: string, address: string) => { },
  swapConfirm: async () => { },
  clearSwapStatus: (objStatus: SwapStatusType) => { },
  clearSelectTokenList: () => { },
  updateChain: () => { },
  updateToken: () => { },
  updateInputValue: () => { },
};
export const SwapContext = createContext<SwapContextInterface>(defaultValue);

let controllerApiBestRate = new AbortController();

// refac : แยก data ของ source กับ destination ออกจากกันไม่เก็บรวม แยก function ที่เกี่ยวข้อง
// refac : เปลี่ยนไปใช้ useReducer ในการจัดการ state
// refac : แยกส่วนที่เป็นการคำนวณออกไปเป็น function
export const SwapProvider = ({ children }: SwapProviderInterface) => {
  const { walletSwitchChain, currentNetwork, walletAddress, isConnected, isChainChangeReload } = useContext(Web3Context);
  const { notify } = useNotifier();
  const [swap, setSwap] = useState<SwapType>(defaultValue.swap);
  const [swapContract, setSwapContract] = useState<ethers.Contract | null>(null);
  const [crossSwapContract, setCrossSwapContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [swapStatus, setSwapStatus] = useState<SwapStatusType>(defaultValue.swapStatus);
  const [selectToken, setSelectToken] = useState<SelectTokenType>(defaultValue.selectToken);
  const [inputCurrency, setInputCurrency] = useState<InputCurrencyType>(defaultValue.inputCurrency);
  const [selectTokenList, setSelectTokenList] = useState<SelectTokenType>(defaultValue.selectTokenList);
  const [loadDefaultChain, setLoadDefaultChain] = useState(true);
  const [crossRate, getCrossRate] = useState<any>({});

  const contactSwapProviders = async (selectionUpdate: string) => {
    let provider: any = new ethers.providers.Web3Provider(ethereum);
    if (selectionUpdate === "Source") {
      const currentChain = await currentNetwork();
      const getContractSwap = new ethers.Contract(SWAP_CONTRACTS[currentChain].SWAP_ADDRESS || "", SWAP_CONTRACTS[currentChain].SWAP_ABI || [], provider.getSigner());
      const getContractCrossSwap = new ethers.Contract(SWAP_CONTRACTS[currentChain].CROSS_SWAP_ADDRESS || "", SWAP_CONTRACTS[currentChain].CROSS_SWAP_ABI || [], provider.getSigner());
      setSwapContract(getContractSwap);
      setCrossSwapContract(getContractCrossSwap);
    }
    if (selectionUpdate === "Destination") {
      const currentChain = Number(swap[selectionUpdate.toLocaleLowerCase()].chain);
      if (SWAP_CONTRACTS[currentChain]?.RPC_URLS?.[0]) {
        provider = new ethers.providers.JsonRpcProvider(SWAP_CONTRACTS[currentChain]?.RPC_URLS?.[0]);
      } else {
        provider = ethers.getDefaultProvider(SWAP_CONTRACTS[currentChain]?.NETWORK_SHORT_NAME?.toLocaleLowerCase());
      }
    }
    return provider;
  };

  const isTokenApprove = async () => {
    if (tokenContract) {
      setSwapStatus({ ...swapStatus, isApprove: false, isApproveLoading: true });
      const currentChain = await currentNetwork();
      let params = SWAP_CONTRACTS[currentChain].SWAP_ADDRESS;
      if (swap.source.chain !== swap.destination.chain) {
        params = SWAP_CONTRACTS[currentChain].CROSS_SWAP_ADDRESS;
      }
      const tokenStatus = await tokenContract.allowance(walletAddress, params);
      setSwapStatus({ ...swapStatus, isApprove: Number(utils.formatEther(tokenStatus.toString())) >= Number(inputCurrency.source.value) ? true : false, isApproveLoading: false });
    }
  };

  const isTokenPool = async (address: string) => {
    const isExits = WHITE_LIST_TOKEN.find(x => x.address.toLocaleLowerCase() === address.toLocaleLowerCase());
    return (isExits || address === "") ? true : false;
  };

  const getSummaryBestRateSwap = async (selectionUpdate: string, objSwap: SwapType) => {
    let retries = 5, success = false, summary = defaultValue.swap.summary;
    setSwap({ ...objSwap, [selectionUpdate === "Source" ? "destination" : "source"]: { ...objSwap[selectionUpdate === "Source" ? "destination" : "source"], value: objSwap[selectionUpdate.toLocaleLowerCase()].value } });
    setSwapStatus({ ...swapStatus, isSwap: true, isSummaryLoading: true });
    if (controllerApiBestRate.signal.aborted) {
      controllerApiBestRate = new AbortController();
    }
    while (retries > 0 && !success) {
      setSwapStatus({ ...swapStatus, isSwap: true, isSummaryLoading: true });
      try {
        let mergeRoute = [], toFee: Decimal, sumExpected: Decimal, mergeAmount, data, fee;
        if (objSwap.source.chain === objSwap.destination.chain) {
          const response = await fetch(`${process.env.REACT_APP_API_BEST_RATE}/rate?tokenIn=${objSwap.source.token}&tokenOut=${objSwap.destination.token}&amount=${utils.parseEther(objSwap[selectionUpdate.toLocaleLowerCase()].value || "0").toString()}&chainId=${objSwap.source.chain}`, {
            signal: controllerApiBestRate.signal
          });
          const { success, data } = await response.json();
          if (success) {
            mergeRoute = data.route;
            mergeAmount = Array.isArray(data.amount) ? data.amount : [data.amount];
            summary = { ...summary, isSplitSwap: Boolean(data.isSplitSwap) };
            fee = data.fee;
            getCrossRate(data);
            if (data.isSplitSwap) {
              summary = { ...summary, amount: data.amount };
            }
          } else {
            notify(
              <DangerNotification message={`Error ${data.code} ${data.message}`} />
            );
          }
        } else {
          const response = await fetch(`${process.env.REACT_APP_API_BEST_RATE}/cross-rate?tokenIn=${objSwap.source.token}&tokenOut=${objSwap.destination.token}&amount=${utils.parseEther(objSwap[selectionUpdate.toLocaleLowerCase()].value || "0").toString()}&sourceChainId=${objSwap.source.chain}&destinationChainId=${objSwap.destination.chain}`, {
            signal: controllerApiBestRate.signal
          });
          const { success, data } = await response.json();
          if (success) {
            mergeRoute = [...data.source.route, { index: "0", name: "Cross Chain Swap", fee: "0" }, ...data.destination.route];
            mergeAmount = [...data.destination.amount];
            summary = { ...summary, isSplitSwap: false };
            fee = data.fee;
            getCrossRate(data);
          } else {
            notify(
              <DangerNotification message={`Error ${data.code} ${data.message}`} />
            );
          }
        }

        const route = mergeRoute.map((list: any) => {
          return { ...list, fee: toBigNumber(utils.formatEther(toBigNumber(list.fee).toString())).toString() };
        });

        toFee = toBigNumber(utils.formatEther(toBigNumber(fee).toString()));
        sumExpected = mergeAmount.reduce((previous: number, current: number) => { return toBigNumber(previous).plus(toBigNumber((current))); }, 0);

        summary = {
          ...summary,
          fee: toFee.toString(),
          recieve: toBigNumber(objSwap[selectionUpdate.toLocaleLowerCase()].value || 0).minus(toFee).toString(),
          expected: utils.formatEther(sumExpected.toString()),
          isSplitSwap: false,
          route: route
        };
        success = true;
        if (selectionUpdate !== "") {
          const keyUpdate = (selectionUpdate === "Source") ? "destination" : "source";
          objSwap = { ...objSwap, [keyUpdate]: { ...objSwap[keyUpdate], value: objSwap[selectionUpdate.toLocaleLowerCase()].value } };

          setInputCurrency({
            ...inputCurrency,
            [keyUpdate]: {
              isDisabled: false,
              value: utils.formatEther(sumExpected.toString())
            }
          });
        }
        setSwap({ ...objSwap, summary });

        setSwapStatus({
          ...swapStatus,
          isSwap: true,
          isSummaryLoading: false,
          isSwitch: (objSwap.source.chain === undefined || objSwap.destination.chain === undefined)
        });
      } catch (error: any) {
        setSwapStatus({ ...swapStatus, isSummaryLoading: false });
        if (error.name === 'AbortError') {
          success = true;
        } else {
          console.error(error);
          --retries;
        }
      }
    }
  };

  const getBalanceOf = async (selectionUpdate: string, selectTokenKey: string) => {
    let retries = 5, success = false, balance = 0;
    while (retries > 0 && !success) {
      try {
        const provider = await contactSwapProviders(selectionUpdate);
        const contract = new ethers.Contract(selectTokenKey, ERC20_ABI, provider);
        balance = Number(toBigNumber(utils.formatEther(await contract.balanceOf(walletAddress))).toString());
        success = true;
      } catch (error) {
        console.error(error);
        --retries;
      }
    }
    return balance;
  };

  const updateSwap = () => { };

  const swapSwitch = async () => {
    const beforeSwitchSwapObj = { ...swap };
    const beforeSwitchTokenObj = { ...selectToken };
    const beforeSwitchCurrencyObj = { ...inputCurrency };
    try {
      setSwapStatus({ ...swapStatus, isSwitch: true, isSwitchLoading: true, isSummaryLoading: true });
      setSelectToken({
        source: { ...beforeSwitchTokenObj.destination, balanceOf: beforeSwitchSwapObj.destination.token !== undefined ? await getBalanceOf("Destination", beforeSwitchSwapObj.destination.token || "") : undefined },
        destination: beforeSwitchTokenObj.source,
      });
      setInputCurrency({
        source: beforeSwitchCurrencyObj.destination,
        destination: beforeSwitchCurrencyObj.source,
      });
      const checkSourceUndefined = Object.values(swap.source).every((value) => { return (value !== undefined && value !== "") ? true : false; });
      const checkDestinationUndefined = Object.values(swap.destination).every((value) => { return (value !== undefined && value !== "") ? true : false; });
      const isSourceTokenPool = await isTokenPool(swap.destination.token || "");
      const isDestinationTokenPool = await isTokenPool(swap.destination.token || "");

      setSwap({ ...swap, source: { ...swap.destination }, destination: { ...swap.source }, summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: false, route: undefined } });
      if (checkSourceUndefined && checkDestinationUndefined && isSourceTokenPool && isDestinationTokenPool) {
        await getSummaryBestRateSwap("Source", { ...swap, source: { ...swap.destination }, destination: { ...swap.source } });
      }
      walletSwitchChain(Number(swap.destination.chain), 
      async()=>{ 
        // handelSuccess
        const provider = new ethers.providers.Web3Provider(ethereum);
        const getContractToken = new ethers.Contract(beforeSwitchSwapObj?.destination?.token || "", ERC20_ABI || [], provider.getSigner());
        setTokenContract(getContractToken);
        await contactSwapProviders("Source");
      }, 
      ()=>{
        // handelFail
        setSwap(beforeSwitchSwapObj);
        setSelectToken(beforeSwitchTokenObj);
        setInputCurrency(beforeSwitchCurrencyObj);
        setSwapStatus({ ...swapStatus, isSwitch: false, isSwitchLoading: false });
      });
      setSwapStatus({ ...swapStatus, isSwitchLoading: true, isSwitch: false });
    } catch (error: any) {
      setSwap(beforeSwitchSwapObj);
      setSelectToken(beforeSwitchTokenObj);
      setInputCurrency(beforeSwitchCurrencyObj);
      setSwapStatus({ ...swapStatus, isSwitch: false, isSwitchLoading: false });
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    }
  };

  const debounceSelectToken = async (selectionUpdate: string, address: string) => {
    try {
      const currentChain = (isConnected || walletAddress !== "") ? await currentNetwork() : "";
      if (address.indexOf("0x") !== -1) {
        const provider = await contactSwapProviders(selectionUpdate);
        const contract = new ethers.Contract(address, ERC20_ABI, provider);
        const [symbol, name, decimals, balanceOf] = await Promise.all([
          contract.symbol(),
          contract.name(),
          contract.decimals(),
          contract.balanceOf(walletAddress)
        ])
        setSelectTokenList({
          [address]: {
            symbol: symbol, 
            name: name, 
            decimals: decimals,
            balanceOf:  Number(toBigNumber(utils.formatEther(balanceOf)).toString())
          }
        });
      } else {
        let searchTokenList = JSON.parse(localStorage.getItem("token") || "{}");
        searchTokenList = Object.entries(searchTokenList[currentChain] || {}).filter((token: any) => token[1].symbol.toLocaleLowerCase().includes(address.toLocaleLowerCase()) || token[1].name.toLocaleLowerCase().includes(address.toLocaleLowerCase()));
        searchTokenList = await Promise.all(Object.entries(searchTokenList).map(async (list: any) => {
          return { ...list[1], [1]: { ...list[1][1], balanceOf: await getBalanceOf(selectionUpdate, list[1][0]) } };
        }));
        setSelectTokenList(Object.fromEntries(searchTokenList));
      }
    } catch (error) {
      console.error(error);
      setSelectTokenList(defaultValue.selectTokenList);
    }
  };

  // refac split approve function
  /*
    apiPayload = isSplitSwap, routeIndex, routeIndex[], splitAmount[]
          type = bool, uint, uint[], uint[]
    case 1: source.isSplitSwap === true
            => use crossSwapContract.splitSwap => apiPayload = true, 0, routeIndex, splitAmount
    case 2: source.isSplitSwap === false
            => use crossSwapContract.swap => apiPayload = false, routeIndex, [], []
    case 3: source.isSplitSwap === false && destination.isSplitSwap === true
            => use crossSwapContract.swap => apiPayload = true, 0, routeIndex, splitAmount
  */
  const swapConfirm = async (isApprove: boolean, handelSuccess: Function = () => { }, handelFail: Function = () => { }) => {
    try {
      setSwapStatus({ ...swapStatus, isApproveLoading: true });
      const currentChain = await currentNetwork();
      if (isApprove) {
        if (swapContract && crossSwapContract) {
          let resultSwap, params = [swap.source.token, utils.parseEther(inputCurrency.source.value || "0").toString()], apiPayload: string = "";
          if (swap.source.chain !== swap.destination.chain) {
            const payload = utils.defaultAbiCoder.encode(
              ["address", "address", "uint", "uint"],
              [walletAddress, swap.destination.token, SWAP_CONTRACTS[Number(swap.source.chain || "")].DOMAIN_CHAIN, SWAP_CONTRACTS[Number(swap.destination.chain || "")].DOMAIN_CHAIN]
            );
            const routeIndexDestination = crossRate.destination.route.map((list: any) => {
              return list.index;
            });

            if (crossRate.source.isSplitSwap === false) {
              /* routeIndex = destination.route.index[0] -> data destination from api BestRateSwap */
              apiPayload = utils.defaultAbiCoder.encode(
                ["bool", "uint", "uint[]", "uint[]"],
                [false, crossRate.destination.route[0].index, [], []]
              );
            }
            if (crossRate.source.isSplitSwap || crossRate.destination.isSplitSwap) {
              /*  data destination from api BestRateSwap 
                routeIndex = [destination.route.index ทั้งหมด], splitAmount = destination.amount
              */
              apiPayload = utils.defaultAbiCoder.encode(
                ["bool", "uint", "uint[]", "uint[]"],
                [true, 0, routeIndexDestination, crossRate.destination.amount]
              );
            }
            if (crossRate.source.isSplitSwap) {
              const routeIndexSource = crossRate.source.route.map((list: any) => { return list.index; });
              /* comment: routes[uint] = source.route.index ทั้งหมด, srcAmounts[uint] = source.route.amount ทั้งหมด -> data from api object source*/
              resultSwap = await crossSwapContract.spiltSwap(...params, routeIndexSource, crossRate.source.amount, payload, apiPayload);
            } else {
              /* comment: route (type uint) = source.route[0] -> data from api object source */
              resultSwap = await crossSwapContract.swap(...params, crossRate.source.route[0].index, payload, apiPayload);
            }
          } else {
            params = [swap.source.token, swap.destination.token, utils.parseEther(inputCurrency.source.value || "0").toString()];
            if (swap.summary.isSplitSwap) {
              const resultRouteIndex = swap.summary.route?.map(route => Number(route.index));
              resultSwap = await swapContract.spiltSwap(
                ...params,
                JSON.stringify(resultRouteIndex),
                JSON.stringify(swap.summary.amount),
                { gasLimit: GAS_LIMIT }
              );
            } else {
              resultSwap = await swapContract.swap(
                ...params,
                swap.summary.route?.[0].index,
                { gasLimit: GAS_LIMIT }
              );
            }
          }

          await resultSwap.wait();
          setSwapStatus({ ...swapStatus, isSuccess: true, isLink: `${SWAP_CONTRACTS[currentChain].BLOCK_EXPLORER_URLS?.[0]}/tx/${resultSwap.hash}`, isApproveLoading: false, isSwap: false });
          setSelectToken({ ...selectToken, source: { ...selectToken.source, balanceOf: toBigNumber(selectToken.source.balanceOf || "").minus(toBigNumber(inputCurrency.source.value || "")).toNumber() } });
          setInputCurrency({ source: { isDisabled: false, value: "" }, destination: { isDisabled: false, value: "" } });
          setSwap({
            ...swap,
            source: { ...swap.source, value: undefined },
            destination: { ...swap.destination, value: undefined },
            summary: { ...defaultValue.swap.summary }
          });
          handelSuccess("Swap Success");
        } else {
          handelFail("Can't Connect Swap Contract");
        }
      } else {
        if (tokenContract) {
          let params = SWAP_CONTRACTS[currentChain].SWAP_ADDRESS;
          if (swap.source.chain !== swap.destination.chain) {
            params = SWAP_CONTRACTS[currentChain].CROSS_SWAP_ADDRESS;
          }
          const resultApprove = await tokenContract.approve(
            params,
            utils.parseEther(inputCurrency.source.value || "0").toString(),
            { gasLimit: GAS_LIMIT }
          );
          await resultApprove.wait();
          setSwapStatus({ ...swapStatus, isApproveLoading: false, isApprove: true });
          handelSuccess("Approve Success");
        } else {
          handelFail("Can't Connect Token Contract");
        }
      }
    } catch (error: any) {
      console.log(error);
      setSwapStatus({ ...swapStatus, isApproveLoading: false });
      handelFail((isApprove) ? "Can't Swap Fail" : "Can't Approve Fail");
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

  const openSelectToken = async (selectionUpdate: string) => {
    const defaultToken = JSON.parse(localStorage.getItem("token") || "{}");
    let defaultTokenGetBalanceOf = await Promise.all(Object.entries(defaultToken[swap[selectionUpdate.toLocaleLowerCase()].chain || ""] || {}).map(async (list: any) => {
      return [list[0], { ...list[1], balanceOf: await getBalanceOf(selectionUpdate, list[0]) }];
    }));
    if (defaultTokenGetBalanceOf.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setSelectTokenList(Object.fromEntries(defaultTokenGetBalanceOf));
  };

  // ref updateSwap
  // when change network will reset token value and input value
  const updateChain = (selectionUpdate: string, objSwap: SwapType) => {
    try {
      let _calCurrency: Decimal = toBigNumber(0);
      setLoadDefaultChain(false);
      const selector = selectionUpdate.toLocaleLowerCase();
      const currentChain = swap[selector].chain;
      const selectedChain = objSwap[selector].chain;
      if (selectedChain !== currentChain) {
        setSelectToken({ ...selectToken, [selector]: { ...selectToken[selector], ...defaultValue.selectToken.source } });
        setInputCurrency({ ...inputCurrency, [selector]: { ...inputCurrency[selector], ...defaultValue.inputCurrency.source } });
        setSwapStatus({ ...swapStatus, isSwap: false, isSwitch: (objSwap.source.chain === undefined || objSwap.destination.chain === undefined) });
        if (selectionUpdate === "Source") {
          if (objSwap.source.chain === objSwap.destination.chain) {
            objSwap = { ...objSwap, ["destination"]: defaultValue.swap.source, summary: defaultValue.swap.summary };
            setInputCurrency(defaultValue.inputCurrency);
            setSelectToken(defaultValue.selectToken);
          }
          walletSwitchChain(Number(objSwap.source.chain),
          ()=>{ },
          ()=>{
            setSwap(swap);
            notify(
              <DangerNotification
                message="Can't Switch Chain"
              />
            );
          });
        }
      }
      let newSwapObj = { ...objSwap, [selector]: { ...objSwap[selector], value: (Number(_calCurrency) !== 0 ? _calCurrency : "").toString() } };
      setSwap(newSwapObj);
    } catch (error: any) {
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    }
  };

  // when update
  const updateToken = async (selectionUpdate: string, objSwap: SwapType) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let _rete = 1, _calCurrency: Decimal = toBigNumber(0), _selectToken = { ...selectToken };
      const selector = selectionUpdate.toLocaleLowerCase();
      const selectedChain = objSwap[selector].chain;

      const selectTokenKey = Object.keys(selectTokenList).filter((key) => key === objSwap[selector].token)?.[0];
      _selectToken = { ...selectToken, [selector]: { ...selectTokenList[selectTokenKey] } };

      let tokenSaveList = JSON.parse(localStorage.getItem("token") || "{}");
      tokenSaveList[selectedChain || ""] = { ...tokenSaveList[selectedChain || ""], [selectTokenKey]: selectTokenList[selectTokenKey] };
      const sortToken = Object.entries(tokenSaveList[selectedChain || ""] || {}).sort((objA: any, objB: any) => {
        delete objA[1].balanceOf;
        delete objB[1].balanceOf;
        return objA[1].symbol.toLocaleLowerCase().localeCompare(objB[1].symbol.toLocaleLowerCase());
      });
      tokenSaveList[selectedChain || ""] = Object.fromEntries(sortToken);
      localStorage.setItem("token", JSON.stringify(tokenSaveList));

      let newInputCurrency = { ...inputCurrency, [selector]: { ...inputCurrency[selector], isDisabled: false } };
      if (selectionUpdate === "Source") {
        const key = "destination";
        const getContractToken = new ethers.Contract(selectTokenKey, ERC20_ABI || [], provider.getSigner());
        setTokenContract(getContractToken);
        if (objSwap.destination.value !== "" && objSwap.destination.value !== undefined) {
          _calCurrency = toBigNumber(objSwap.destination.value || 0).mul(_rete);
          newInputCurrency = { ...newInputCurrency, [key]: { ...newInputCurrency[key], value: _calCurrency.toString() } };
        }
      } else {
        if (objSwap.source.value !== "" && objSwap.source.value !== undefined) {
          _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rete);
          newInputCurrency = { ...newInputCurrency, [selector]: { ...newInputCurrency[selector], value: _calCurrency.toString() } };
        }
      }
      _calCurrency = toBigNumber(0);

      objSwap = { ...objSwap, [selector]: { ...objSwap[selector], value: (Number(_calCurrency) !== 0 ? _calCurrency : "").toString() } };

      const checkSourceUndefined = Object.values(objSwap.source).every((value) => { return (value !== undefined && value !== "") ? true : false; });
      const checkDestinationUndefined = Object.values(objSwap.destination).every((value) => { return (value !== undefined && value !== "") ? true : false; });
      const isSourceTokenPool = await isTokenPool(objSwap.source.token || "");
      const isDestinationTokenPool = await isTokenPool(objSwap.destination.token || "");

      setSelectToken(_selectToken);
      setInputCurrency(newInputCurrency);
      setSwapStatus({
        ...swapStatus,
        isSummaryLoading: false,
        isSwap: (checkSourceUndefined && checkDestinationUndefined),
        isTokenPool: isSourceTokenPool && isDestinationTokenPool,
        isSwitch: (objSwap.source.chain === undefined || objSwap.destination.chain === undefined)
      });
      setSwap(objSwap);
    } catch (error: any) {
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    }
  };

  // clear other input when got new value
  const updateInputValue = async (selectionUpdate: string, objSwap: SwapType) => {
    const beforeSwitchSwapObj = { ...swap };
    const beforeSwitchCurrency = { ...inputCurrency };
    const beforeSwitchToken = { ...selectToken };
    const beforeSwitchSwapStatus = { ...swapStatus };
    try {
      let _calCurrency: Decimal = toBigNumber(0), _rate: number = 1;
      let newInputCurrency = {
        ...inputCurrency,
        [selectionUpdate.toLocaleLowerCase()]: { ...inputCurrency[selectionUpdate.toLocaleLowerCase()], value: objSwap[selectionUpdate.toLocaleLowerCase()].value || "" }
      };
      if (selectionUpdate === "Source") {
        selectionUpdate = "destination";
        _calCurrency = toBigNumber(objSwap.source.value || 0).mul(_rate);
      } else {
        selectionUpdate = "source";
        _calCurrency = toBigNumber(objSwap.destination.value || 0).div(_rate);
      }
      if (objSwap[selectionUpdate.toLowerCase()].token !== undefined && objSwap[selectionUpdate.toLowerCase()].token !== "") {
        newInputCurrency = { ...newInputCurrency, [selectionUpdate]: { ...newInputCurrency[selectionUpdate], value: "" } };
      }
      setInputCurrency(newInputCurrency);
      _calCurrency = toBigNumber(0);

      objSwap = { ...objSwap, [selectionUpdate.toLocaleLowerCase()]: { ...objSwap[selectionUpdate.toLocaleLowerCase()], value: (Number(_calCurrency) !== 0 ? _calCurrency : "").toString() } };

      const checkSourceUndefined = Object.values(objSwap.source).every((value) => { return (value !== undefined && value !== "") ? true : false; });
      const checkDestinationUndefined = Object.values(objSwap.destination).every((value) => { return (value !== undefined && value !== "") ? true : false; });
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
      setSwap(beforeSwitchSwapObj);
      setSelectToken(beforeSwitchToken);
      setInputCurrency(beforeSwitchCurrency);
      setSwapStatus(beforeSwitchSwapStatus);
      notify(
        <DangerNotification
          message={error.toString()}
        />
      );
    }
  };

  useEffect(() => {
    (async () => {
      if (loadDefaultChain) {
        // if user click btn change or switch chain, this condition is not required.
        const currentChain = (isConnected || walletAddress !== "") ? await currentNetwork() : "";
        setSwap({
          source: { chain: currentChain.toString(), token: undefined, value: undefined },
          destination: { chain: undefined, token: undefined, value: undefined },
          summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: false, route: undefined },
        });
        setSelectTokenList(defaultValue.selectTokenList);
        setSwapStatus(defaultValue.swapStatus);
      }
      // Every time the chain changes including change ro switch chain, this useEffect is running. because onListener chainChanged
      setSwapStatus({ ...swapStatus, isSwitchLoading: false });
    })();
  }, [walletAddress, isConnected, isChainChangeReload]);

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
        updateChain,
        updateToken,
        updateInputValue
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
