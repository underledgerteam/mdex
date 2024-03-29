import { SWAP_CONTRACTS_INTERFACE } from "src/types/constants";
import swapAbi from "./swapAbi.json";
import crossSwapAbi from "./crossSwapAbi.json";

export const SWAP_CONTRACTS: SWAP_CONTRACTS_INTERFACE = {
  // 4: {
  //   DOMAIN_CHAIN: 1111,
  //   NETWORK_NAME: "Rinkeby Testnet Network",
  //   NETWORK_SHORT_NAME: "Rinkeby",
  //   SYMBOL: "chian/ethereum.png",
  //   CHAIN_NAME: "Ethereum",
  //   CURRENCY_SYMBOL: "ETH",
  //   SWAP_ADDRESS: "0x165834eDd4A46B2Bc343f5Be824B403849728E95",
  //   SWAP_ABI: swapAbi,

  //   CROSS_SWAP_ADDRESS: "0xB5c1737663bc4f5D23E4d0c0971e3C275E1aa736",
  //   CROSS_SWAP_ABI: crossSwapAbi,

  //   BLOCK_EXPLORER_URLS: ["https://rinkeby.etherscan.io"],
  // },
  5: {
    DOMAIN_CHAIN: 1735353714,
    NETWORK_NAME: "Goerli Testnet Network",
    NETWORK_SHORT_NAME: "Goerli",
    SYMBOL: "chian/ethereum.png",
    CHAIN_NAME: "Ethereum",
    CURRENCY_SYMBOL: "ETH",
    SWAP_ADDRESS: "0xe2e0DfA2dC80d847F6B6B9D67FE0fDa07B10EE5a",
    SWAP_ABI: swapAbi,

    CROSS_SWAP_ADDRESS: "0x9b2080309298d60884a05a1d6cc4a0cf1379375e",
    CROSS_SWAP_ABI: crossSwapAbi,

    BLOCK_EXPLORER_URLS: ["https://goerli.etherscan.io"],
  },
  420: {
    DOMAIN_CHAIN: 1735356532,
    NETWORK_NAME: "Optimism Goerli Testnet Network",
    NETWORK_SHORT_NAME: "Optimism Goerli",
    SYMBOL: "chian/ethereum.png",
    CHAIN_NAME: "Ethereum",
    CURRENCY_SYMBOL: "ETH",
    SWAP_ADDRESS: "0x93C2DCE0cc0B9aFA001834c76d26180CE6FC367d",
    SWAP_ABI: swapAbi,

    CROSS_SWAP_ADDRESS: "0x817F5b1eE8a26C80Fab7E74E58AE88e5b4DaB615",
    CROSS_SWAP_ABI: crossSwapAbi,
    NATIVE_CURRENCY: {
      NAME: "Ethereum",
      SYMBOL: "ETH",
      DECIMALS: 18
    },
    RPC_URLS: ["https://opt-goerli.g.alchemy.com/v2/urWmxbQMmnpzgfaleRxohQrcRF8RnHkf"],
    BLOCK_EXPLORER_URLS: ["https://blockscout.com/optimism/goerli"],
  },
  // 421611: {
  //   NETWORK_NAME: "Arbitrum Testnet",
  //   NETWORK_SHORT_NAME: "Arbitrum",
  //   SYMBOL: "chian/arbitrum.svg",
  //   CHAIN_NAME: "Ethereum",
  //   CURRENCY_SYMBOL: "ETH",

  //   NATIVE_CURRENCY: {
  //     NAME: "Avalanche",
  //     SYMBOL: "ARETH",
  //     DECIMALS: 18
  //   },
  //   RPC_URLS: ["https://rinkeby.arbitrum.io/rpc"],
  //   BLOCK_EXPLORER_URLS: ["https://rinkeby-explorer.arbitrum.io"],
  // },
  // 43113: {
  //   NETWORK_NAME: "AVAX Testnet Network",
  //   NETWORK_SHORT_NAME: "Avalanche",
  //   SYMBOL: "chian/avalanche.png",
  //   CHAIN_NAME: "Avalanche",
  //   CURRENCY_SYMBOL: "AVAX",

  //   NATIVE_CURRENCY: {
  //     NAME: "Avalanche",
  //     SYMBOL: "AVAX",
  //     DECIMALS: 18
  //   },
  //   RPC_URLS: ["https://api.avax-test.network/ext/bc/C/rpc"],
  //   BLOCK_EXPLORER_URLS: ["https://testnet.snowtrace.io"],
  // },
  // 80001: {
  //   NETWORK_NAME: "Polygon Testnet Network",
  //   NETWORK_SHORT_NAME: "Polygon",
  //   SYMBOL: "chian/polygon.png",
  //   CHAIN_NAME: "Polygon",
  //   CURRENCY_SYMBOL: "MATIC",

  //   NATIVE_CURRENCY: {
  //     NAME: "MATIC Token",
  //     SYMBOL: "MATIC",
  //     DECIMALS: 18
  //   },
  //   RPC_URLS: ["https://matic-mumbai.chainstacklabs.com/"],
  //   BLOCK_EXPLORER_URLS: ["https://mumbai.polygonscan.com"],
  // },
  // 97: {
  //   NETWORK_NAME: "Binance Smart Chain Testnet",
  //   NETWORK_SHORT_NAME: "BSC",
  //   SYMBOL: "chian/binance.png",
  //   CHAIN_NAME: "Binance",
  //   CURRENCY_SYMBOL: "BNB",

  //   NATIVE_CURRENCY: {
  //     NAME: "Binance Coin",
  //     SYMBOL: "BNB",
  //     DECIMALS: 18
  //   },
  //   RPC_URLS: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
  //   BLOCK_EXPLORER_URLS: ["https://testnet.bscscan.com"],
  // },
};

export const ROPSTEN: number = 3;
export const RINKEBY: number = 4;
export const GOERLI: number = 5;
export const OPTIMISM_GOERLI: number = 420;
export const KOVAN: number = 42;
export const BSC_CHAPEL: number = 97;
export const POLYGON_MUMBAI: number = 80001;
export const ARBITRUM_RINKEBY: number = 421611;
export const AVALANCHE_FUJI: number = 43113;

export const SUPPORT_CHAIN: number[] = [
  // RINKEBY,
  GOERLI,
  OPTIMISM_GOERLI,
  // BSC_CHAPEL,
  // POLYGON_MUMBAI,
  // ARBITRUM_RINKEBY,
  // AVALANCHE_FUJI,
];

export const DEFAULT_CHAIN: number = GOERLI;
export const GAS_LIMIT: number = 3000000;