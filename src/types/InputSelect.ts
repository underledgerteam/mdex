type KeyUpdateType = "chain" | "token" | "value";

export type listOptionType = {
  chainId: string,
  symbol: string
  chainName: string;
};
export interface InputSelectInterface {
  className?: string,
  listOption?: listOptionType[],
  selectionUpdate: string,
  defaultValue?: string,
  selectLabel: string;
};

export interface InputTokenSelectInterface {
  className?: string,
  listOption?: listOptionType[],
  selectionUpdate: string,
  defaultValue?: string,
  selectLabel: string,
  onClickSelectToken: Function;
}