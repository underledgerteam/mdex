import React, { useEffect, useState, useContext } from "react";
import { InputCurrencyInterface } from "src/types/InputCurrency";

import { SwapContext } from "src/contexts/swap.context";
import { SwapContextInterface } from "src/types/contexts/swap.context";

const InputCurrency = ({className, selectionUpdate, delay = 0, maxLabel = "Max", maxCurrency = false}: InputCurrencyInterface): JSX.Element => {  
  const {updateSwap, swap } = useContext(SwapContext);
  
  const regexInputCurrency: RegExp = /^[0-9]{1,10}((\.)[0-9]{0,10}){0,1}$/g;

  const [number, setNumber] = useState<number | undefined>(undefined);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCurrency = e.target.value, validateNumber = inputCurrency.match(regexInputCurrency) || undefined;
    if(validateNumber || !inputCurrency){
      const value = Number(validateNumber?.[0]) || undefined;
      updateSwap({...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], value}})
      setNumber(value);
    }
  };

  const setMaxCurrency = (number: number) => {
    setNumber(Number(String(number).replace(/\D/g, '')));
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
    <div className={`flex py-2 px-2 border-2 border-blue-300 rounded-lg ${className}`}>
      <input type="text" placeholder="0.0" name={`input${selectionUpdate}`} className="input focus:outline-none w-full" onInput={onInput} value={number}/>
      { maxCurrency && <button className="btn" onClick={()=> setMaxCurrency(123)}>{maxLabel}</button> }
    </div>
  );
};

export default InputCurrency;