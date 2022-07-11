import { TransferRateCollapseInterface, TokenCardInterface } from "src/types/TransferRateCollapse";
import { SWAP_CONTRACTS } from "src/utils/constants";

const mockSrctoken: TokenCardInterface = {
  chainName: SWAP_CONTRACTS[Number(4)].CHAIN_NAME,
  networkName: SWAP_CONTRACTS[Number(4)].NETWORK_NAME,
  imageSrc: SWAP_CONTRACTS[Number(4)].SYMBOL,
  value: "1",
  currencySymbol: SWAP_CONTRACTS[Number(4)].CURRENCY_SYMBOL,
};
const mockDestinateToken: TokenCardInterface = {
  chainName: SWAP_CONTRACTS[Number(97)].CHAIN_NAME,
  networkName: SWAP_CONTRACTS[Number(97)].NETWORK_NAME,
  imageSrc: SWAP_CONTRACTS[Number(97)].SYMBOL,
  value: "0.09971",
  currencySymbol: SWAP_CONTRACTS[Number(97)].CURRENCY_SYMBOL,
};
export const mockData: TransferRateCollapseInterface = {
  title: "1 ETH = 300 BNB",
  source: mockSrctoken,
  destination: mockDestinateToken,
  fee: "0.075",
  recieve: "29.925",
  expect: "0.09971",
};