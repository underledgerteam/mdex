import { SwapRouteType } from "./contexts/swap.context";
export interface TransferRateCollapseInterface {
  className?: string,
  title?: string,
  fee?: string,
  recieve?: string,
  expect?: string,
  source?: TokenCardInterface,
  destination?: TokenCardInterface,
  children?: JSX.Element,
  route?: SwapRouteType[],
  amount?: string | string[],
};

export interface TokenCardInterface {
  chainName?: string,
  currencySymbol?: string,
  networkName?: string,
  value?: string,
  imageSrc?: string;
}
export interface TransferRoute {
  key: string,
  name: string,
  fee: string;
}