import { listOptionType } from "./InputSelect";

export interface SelectionSwapInterface {
  title: string,
  listOptionNetwork?: listOptionType[],
  maxCurrency?: boolean,
  onClickSelectToken: Function;
};