import React, { useEffect, useState, useContext } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

const InputSelect = ({className, keyUpdate, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface) => {
  const { updateSwap, swap, reloadSwitch } = useContext(SwapContext);

  const [value, setValue] = useState<string | undefined>(defaultValue);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSwap({...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], [keyUpdate.toLowerCase()]: e.target.value}});
    setValue(e.target.value);
  };
  useEffect(()=>{
    let value;
    if(keyUpdate === "chain"){
      value = swap[selectionUpdate.toLowerCase()].chain
    }
    if(keyUpdate === "token"){
      value = swap[selectionUpdate.toLowerCase()].token
    }
    setValue(value || "")
  },[reloadSwitch]);
  return(
    <div className={`flex items-center ${className}`}>
      <select className="select select-bordered w-full" value={value} onChange={onChange}>
        <option value="" disabled>{selectLabel}</option>
        <option value={1}>Homer</option>
        <option value={2}>Marge</option>
        <option value={3}>Bart</option>
        <option value={4}>Lisa</option>
        <option value={5}>Maggie</option>
      </select>
    </div>
  );
};

export default InputSelect;