import React, { useEffect, useState, useContext } from "react";
import { InputCurrencyInterface } from "src/types/InputCurrency";

import { SwapContext } from "src/contexts/swap.context";

const InputCurrency = ({className, selectionUpdate, delay = 0, maxLabel = "Max", maxCurrency = false}: InputCurrencyInterface): JSX.Element => { 
  const regexInputCurrency: RegExp = /^[0-9]{1,10}((\.)[0-9]{0,10}){0,1}$/g;
  const regexRemoveString: RegExp = /[^\d\.]/g; 

  const {updateSwap, swap } = useContext(SwapContext);
  const [number, setNumber] = useState<string>("");

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCurrency = e.target.value.replace(regexRemoveString, ''), validateNumber = inputCurrency.match(regexInputCurrency);
    if(validateNumber || !inputCurrency){
      const value = validateNumber?.[0] || "";
      updateSwap(selectionUpdate, "value", {...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], value: value}})
      setNumber(value);
    }
  };

  const setMaxCurrency = (number: string) => {
    setNumber(number.replace(regexRemoveString, ''));
  };

  useEffect(()=>{
    if(number){
      const delayInput = setTimeout(() => {
        // something code
        console.log("delay type, input=> ", selectionUpdate, number);
      }, delay);
      return () => { clearTimeout(delayInput) };
    }
  },[number]);

  return (
    <div className={`flex py-2 px-2 border border-black border-opacity-20 rounded-lg ${className}`}>
      <input type="text" placeholder="0.0" name={`input${selectionUpdate}`} className="input focus:outline-none w-full" onChange={onInput} value={number}/>
      { maxCurrency && <button className="btn" onClick={()=> setMaxCurrency("12345.7890")}>{maxLabel}</button> }
    </div>
  );
};

export default InputCurrency;