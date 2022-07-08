// value & function in Context
export interface SwapContextInterface {
  swap: SwapType,
  swapStatus: SwapStatusType,
  selectToken: SelectTokenType,
  selectTokenList: SelectTokenList[],
  swapSwitch: ()=> void,
  updateSwap: (selectionUpdate: string, keyUpdate: string, objSwap: SwapType)=> void,
  debounceSelectToken: (value: string)=> void,
  swapConfirm: (isApprove: boolean, handelSuccess: Function, handelFail: Function)=> void
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
    expected?: string
  }
};

export type SwapStatusType = {
  isApprove: boolean,
  isSwap: boolean,
  isSwitch: boolean,
  isTokenPool: boolean,
  isLoading: boolean,
  isSuccess: boolean,
  isLink: string
}

export type SelectTokenType = {
  [key: string]: SelectTokenList
}

export type SelectTokenList = {
  label: JSX.Element | string,
  subLabel: string,
  tokenName: string,
  value: string,
  img: string,
  maxAmount: number,
  rate: number
}