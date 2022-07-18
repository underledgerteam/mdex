type KeyUpdateType = "chain" | "token" | "value";

export type listOptionType = {
  value: string,
  label: string | JSX.Element;
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