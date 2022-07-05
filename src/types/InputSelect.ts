type KeyUpdateType = "chain" | "value" | "token";

export type listOptionType = {
  value: string,
  label: string | JSX.Element
};
export interface InputSelectInterface {
  className?: string,
  listOption: listOptionType[],
  keyUpdate: KeyUpdateType,
  selectionUpdate: string,
  defaultValue?: string,
  selectLabel: string
};