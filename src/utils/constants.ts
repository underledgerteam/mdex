import { SWAP_CONTRACTS_INTERFACE } from "src/types/constants";

export const SWAP_CONTRACTS: SWAP_CONTRACTS_INTERFACE = {
  4: {
    NETWORK_NAME: "Rinkeby Testnet Network",
    NETWORK_SHORT_NAME: "Rinkeby",
    SYMBOL: "Ethereum",
    CHAIN_NAME: "Ethereum",
    CURRENCY_SYMBOL: "ETH",
  },
  421611: {
    NETWORK_NAME: "Arbitrum Testnet",
    NETWORK_SHORT_NAME: "Arbitrum",
    SYMBOL: "Ethereum",
    CHAIN_NAME: "Ethereum",
    CURRENCY_SYMBOL: "ETH",

    NATIVE_CURRENCY: {
      NAME: "Avalanche",
      SYMBOL: "ARETH",
      DECIMALS: 18
    },
    RPC_URLS: ["https://rinkeby.arbitrum.io/rpc"],
    BLOCK_EXPLORER_URLS: ["https://rinkeby-explorer.arbitrum.io/#/"],
  },
  43113: {
    NETWORK_NAME: "AVAX Testnet Network",
    NETWORK_SHORT_NAME: "Avalanche",
    SYMBOL: "Avalanche",
    CHAIN_NAME: "Avalanche",
    CURRENCY_SYMBOL: "AVAX",

    NATIVE_CURRENCY: {
      NAME: "Avalanche",
      SYMBOL: "AVAX",
      DECIMALS: 18
    },
    RPC_URLS: ["https://api.avax-test.network/ext/bc/C/rpc"],
    BLOCK_EXPLORER_URLS: ["https://testnet.snowtrace.io/"],
  },
  80001: {
    NETWORK_NAME: "Polygon Testnet Network",
    NETWORK_SHORT_NAME: "Polygon",
    SYMBOL: "Polygon",
    CHAIN_NAME: "Polygon",
    CURRENCY_SYMBOL: "MATIC",

    NATIVE_CURRENCY: {
      NAME: "MATIC Token",
      SYMBOL: "MATIC",
      DECIMALS: 18
    },
    RPC_URLS: ["https://matic-mumbai.chainstacklabs.com/"],
    BLOCK_EXPLORER_URLS: ["https://mumbai.polygonscan.com/"],
  },
  97: {
    NETWORK_NAME: "Binance Smart Chain Testnet",
    NETWORK_SHORT_NAME: "BSC",
    SYMBOL: "Binance",
    CHAIN_NAME: "Binance",
    CURRENCY_SYMBOL: "BNB",

    NATIVE_CURRENCY: {
      NAME: "Binance Coin",
      SYMBOL: "BNB",
      DECIMALS: 18
    },
    RPC_URLS: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    BLOCK_EXPLORER_URLS: ["https://explorer.binance.org/smart-testnet"],
  },
};
