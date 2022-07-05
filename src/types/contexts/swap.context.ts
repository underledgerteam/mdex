// value & function in Context
export interface SwapContextInterface {
  reloadSwitch: boolean,
  swap: SwapType,
  swapSwitch: ()=> void,
  updateSwap: (selectionUpdate: string, keyUpdate: string, objSwap: SwapType)=> void,
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