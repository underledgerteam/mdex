// value & function in Context
export interface SwapContextInterface {
  swapSwitch: ()=> void,
  updateSwap: (objSwap: SwapType)=> void,
  reloadSwitch: boolean,
  swap: SwapType
}

export interface SwapProviderInterface {
  children: JSX.Element
}

export type SwapType = {
  [key: string]: {
    chain?: string,
    token?: string,
    value?: number
  }
}