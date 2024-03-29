import React, { useEffect, useState, useContext } from "react";
import { InputCurrencyInterface } from "src/types/InputCurrency";
import Decimal from 'decimal.js';
import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { SwapContext } from "src/contexts/swap.context";

const InputCurrency = ({ className, selectionUpdate, delay = 0, maxLabel = "Max", maxCurrency = false }: InputCurrencyInterface): JSX.Element => {
  const regexInputCurrency: RegExp = /^[0-9]{1,10}((\.)[0-9]{0,10}){0,1}$/g;
  const regexRemoveString: RegExp = /[^\d\.]/g;
  const [onClickMaxCurrency, setOnClickMaxCurrency] = useState(false);
  const { updateInputValue, getSummaryBestRateSwap, controllerApiBestRate, swap, selectToken, swapStatus, inputCurrency } = useContext(SwapContext);
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getValue = e.target.value.replace(regexRemoveString, ''), validateNumber = getValue.match(regexInputCurrency);
    if (validateNumber || !getValue) {
      const value = validateNumber?.[0] || "";
      controllerApiBestRate?.abort("Cancelled Call Api Get Best Rate");
      const newObj = { ...swap, [selectionUpdate.toLowerCase()]: { ...swap[selectionUpdate.toLowerCase()], value: value } };
      updateInputValue(selectionUpdate, newObj);
    }
  };

  const setMaxCurrency = (number: string) => {
    const newObj = { ...swap, [selectionUpdate.toLowerCase()]: { ...swap[selectionUpdate.toLowerCase()], value: number.replace(regexRemoveString, '') } };
    updateInputValue(selectionUpdate, newObj);
    setOnClickMaxCurrency(!onClickMaxCurrency);
  };

  useEffect(() => {
    let debounceCurrency: NodeJS.Timeout;
    if (inputCurrency[selectionUpdate.toLocaleLowerCase()].value !== "" && inputCurrency[selectionUpdate.toLocaleLowerCase()].value !== "0" && swapStatus.isTokenPool && (swap[selectionUpdate === "Source" ? "destination" : "source"].value === "") && (swap.source.token !== "" && swap.destination.token !== "" && swap.source.token !== undefined && swap.destination.token !== undefined)) {
      debounceCurrency = setTimeout(() => {
        getSummaryBestRateSwap(selectionUpdate, { ...swap, [selectionUpdate.toLowerCase()]: { ...swap[selectionUpdate.toLowerCase()], value: inputCurrency[selectionUpdate.toLocaleLowerCase()].value } });
      }, 1500);
    }
    return () => { clearTimeout(debounceCurrency); };
  }, [onClickMaxCurrency, inputCurrency[selectionUpdate.toLocaleLowerCase()].value, swap[selectionUpdate.toLocaleLowerCase()].value, swap.source.token, swap.destination.token]);

  return (
    <div className={`flex items-center py-2 px-2 border border-black border-opacity-20 rounded-lg ${className} ${inputCurrency[selectionUpdate.toLocaleLowerCase()].isDisabled || swapStatus.isSwitchLoading ? "bg-slate-300" : "bg-white"}`}>
      <input
        type="text"
        placeholder="0.0"
        name={`input${selectionUpdate}`}
        className={`input focus:outline-none w-full disabled:border-opacity-0 disabled:bg-transparent`}
        disabled={inputCurrency[selectionUpdate.toLocaleLowerCase()].isDisabled || swapStatus.isSwitchLoading}
        onChange={onInput}
        value={inputCurrency[selectionUpdate.toLocaleLowerCase()].value}
      />
      {maxCurrency && <button className="btn btn-outline  btn-ghost" disabled={inputCurrency[selectionUpdate.toLocaleLowerCase()].isDisabled || swapStatus.isSummaryLoading || swapStatus.isSwitchLoading} onClick={() => setMaxCurrency(toBigNumber(selectToken.source.balanceOf || "").toDP(10, Decimal.ROUND_DOWN).toString() || "")}>{maxLabel}</button>}
    </div>
  );
};

export default InputCurrency;