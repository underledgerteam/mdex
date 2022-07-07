// value & function in Context
export interface SwapContextInterface {
  swap: SwapType,
  swapStatus: SwapStatusType,
  selectToken: SelectTokenType,
  selectTokenList: SelectTokenList[],
  swapSwitch: ()=> void,
  updateSwap: (selectionUpdate: string, keyUpdate: string, objSwap: SwapType)=> void,
  debounceSelectToken: (value: string)=> void
};

export interface SwapProviderInterface {
  children: JSX.Element
};

export type SwapType = {
  [key: string]: {
    chain?: string,
    token?: string,
    value?: string
  }
};

export type SwapStatusType = {
  isApprove: boolean,
  isSwap: boolean,
  isSwitch: boolean,
  isTokenPool: boolean,
  isLoading: boolean
}

export type SelectTokenType = {
  [key: string]: SelectTokenList
}

export type SelectTokenList = {
  label: JSX.Element | string,
  subLabel: string,
  value: string,
  img: string,
  maxAmount: number,
  rate: number
}