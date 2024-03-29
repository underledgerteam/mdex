export interface SWAP_CONTRACTS_INTERFACE {
  [key: number] : {
    DOMAIN_CHAIN?: number, 
    NETWORK_NAME: string,
    NETWORK_SHORT_NAME: string,
    SYMBOL: string,
    CHAIN_NAME: string,
    CURRENCY_SYMBOL: string,

    SWAP_ADDRESS?: string,
    SWAP_ABI?: Object[],

    CROSS_SWAP_ADDRESS?: string,
    CROSS_SWAP_ABI?: Object[],

    NATIVE_CURRENCY?: {
      NAME: string,
      SYMBOL: string,
      DECIMALS: number
    },
    RPC_URLS?: string[],
    BLOCK_EXPLORER_URLS?: string[],
  }
};