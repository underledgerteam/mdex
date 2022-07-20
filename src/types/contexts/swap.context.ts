// value & function in Context
export interface SwapContextInterface {
  swap: SwapType,
  swapStatus: SwapStatusType,
  selectToken: SelectTokenType,
  selectTokenList: SelectTokenType,
  swapSwitch: ()=> void,
  isTokenApprove: ()=> void,
  openSelectToken: (selectionUpdate: string)=> void,
  updateSwap: (selectionUpdate: string, keyUpdate: string, objSwap: SwapType)=> void,
  debounceSelectToken: (selectionUpdate: string, address: string)=> void,
  swapConfirm: (isApprove: boolean, handelSuccess: Function, handelFail: Function)=> void,
  clearSwapStatus: ()=> void,
  clearSelectTokenList: ()=> void
};

export interface SwapProviderInterface {
  children: JSX.Element
};

export type SwapType = {
  [key: string]: {
    chain?: string,
    token?: string,
    value?: string,
    
    fee?: string,
    recieve?: string,
    expected?: string,
    amount?: string | string[],
    route?: string | string[],
    isSplitSwap?: boolean
  }
};

export type SwapStatusType = {
  isApprove: boolean,
  isSwap: boolean,
  isSwitch: boolean,
  isTokenPool: boolean,
  isSwitchLoading: boolean,
  isSummaryLoading: boolean,
  isApproveLoading: boolean,
  isSuccess: boolean,
  isLink: string
}

export type SelectTokenType = {
  [key: string]: SelectTokenList
}

export type SelectTokenList = {
  symbol: string,
  name: string,
  decimals: number,
  balanceOf?: number,
  img?: string,
}