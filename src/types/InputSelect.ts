type KeyUpdateType = "chain" | "value" | "token";
export interface InputSelectInterface {
  className?: string,
  keyUpdate: KeyUpdateType,
  selectionUpdate: string,
  defaultValue?: string,
  selectLabel: string
};