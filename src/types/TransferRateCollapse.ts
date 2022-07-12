export interface TransferRateCollapseInterface {
  className?: string,
  title?: string,
  fee?: string,
  recieve?: string,
  expect?: string,
  source?: TokenCardInterface,
  destination?: TokenCardInterface,
  children?: JSX.Element;
};

export interface TokenCardInterface {
  chainName?: string,
  currencySymbol?: string,
  networkName?: string,
  value?: string,
  imageSrc?: string;
}