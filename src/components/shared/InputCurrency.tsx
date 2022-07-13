import React, { useEffect, useState, useContext } from "react";
import { InputCurrencyInterface } from "src/types/InputCurrency";

import { SwapContext } from "src/contexts/swap.context";

const InputCurrency = ({className, selectionUpdate, delay = 0, maxLabel = "Max", maxCurrency = false}: InputCurrencyInterface): JSX.Element => { 
  const regexInputCurrency: RegExp = /^[0-9]{1,10}((\.)[0-9]{0,10}){0,1}$/g;
  const regexRemoveString: RegExp = /[^\d\.]/g; 

  const {updateSwap, swap, selectToken } = useContext(SwapContext);
  const [inputCurrency, setInputCurrency] = useState({isDisabled: false, value: ""});

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getValue = e.target.value.replace(regexRemoveString, ''), validateNumber = getValue.match(regexInputCurrency);
    if(validateNumber || !getValue){
      const value = validateNumber?.[0] || "";
      updateSwap(selectionUpdate, "value", {...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], value: value}})
      setInputCurrency({...inputCurrency, value: value});
    }
  };

  const setMaxCurrency = (number: string) => {
    updateSwap(selectionUpdate, "value", {...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], value: number.replace(regexRemoveString, '')}})
    setInputCurrency({...inputCurrency, value: number.replace(regexRemoveString, '')});
  };

  useEffect(()=>{
    if(swap[selectionUpdate.toLowerCase()].token === undefined || swap[selectionUpdate.toLowerCase()].token === ""){
      setInputCurrency({...inputCurrency, value: "", isDisabled: true});
    }else{
      setInputCurrency({...inputCurrency, isDisabled: false, value: swap[selectionUpdate.toLowerCase()].value || ""});
    }
  },[swap[selectionUpdate.toLowerCase()].chain, swap[selectionUpdate.toLowerCase()].token, swap[selectionUpdate.toLowerCase()].value]);

  return (
    <div className={`flex items-center py-2 px-2 border border-black border-opacity-20 rounded-lg ${className} ${inputCurrency.isDisabled? "bg-slate-300": "bg-white"}`}>
      <input 
        type="text" 
        placeholder="0.0" 
        name={`input${selectionUpdate}`} 
        className={`input focus:outline-none w-full disabled:border-opacity-0 disabled:bg-transparent disabled:text-white`} 
        disabled={inputCurrency.isDisabled}
        onChange={onInput} 
        value={inputCurrency.value}
      />
      { maxCurrency && <button className="btn btn-outline  btn-ghost" disabled={inputCurrency.isDisabled} onClick={()=> setMaxCurrency((selectToken.source.maxAmount || "").toString())}>{maxLabel}</button> }
    </div>
  );
};

export default InputCurrency;