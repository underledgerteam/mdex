export interface SWAP_CONTRACTS_INTERFACE {
  [key: number] : {
    NETWORK_NAME: string,
    NETWORK_SHORT_NAME: string,
    SYMBOL: string,
    CHAIN_NAME: string,
    CURRENCY_SYMBOL: string,

    NATIVE_CURRENCY?: {
      NAME: string,
      SYMBOL: string,
      DECIMALS: number
    },
    RPC_URLS?: string[],
    BLOCK_EXPLORER_URLS?: string[],
  }
};