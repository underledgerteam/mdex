import React, { useEffect, useState, useContext } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

const InputSelectNetwork = ({className, listOption, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface): JSX.Element => {
  const { updateSwap, swap } = useContext(SwapContext);
  const [value, setValue] = useState<string | JSX.Element>(defaultValue);

  const handelShowSelectNetwork = () => {
    const dropdown = document.querySelectorAll(".dropdown-content.show");
    dropdown && dropdown.forEach((list)=>{
      if(list.id !== `dropdown-content-${selectionUpdate.toLowerCase()}-chain`){
        list.classList.remove("show");
      }
    });
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-chain`)?.classList.toggle("show");
  };

  const handelSelectNetwork = (value: string, label: JSX.Element | string) => {
    updateSwap(selectionUpdate, "chain", {...swap, [selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], chain: value, token: undefined, value: undefined}});
    setValue(label);
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-chain`)?.classList.toggle("show");
  };

  useEffect(()=>{
    setValue(listOption?.find((x)=>x.value === swap[selectionUpdate.toLowerCase()].chain)?.label || "");
  },[swap[selectionUpdate.toLowerCase()].chain]);

  useEffect(()=>{
    const dropdownClose = (e: any)  => {
      const dropdown = document.querySelectorAll(".dropdown-content.show");
      if(dropdown.length > 0 && !e.path[0].id){
        dropdown.forEach((list)=>{ list.classList.remove("show"); });
      }
    }
    document.body.addEventListener("click", dropdownClose);
    return () => document.body.removeEventListener("click", dropdownClose);
  },[]);

  return(
    <div className={`flex items-center ${className}`}>
      <div className="dropdown w-full">
        <label id="dropdown-title" className="select select-bordered items-center m-1 w-full" onClick={()=> handelShowSelectNetwork()}>{value || selectLabel}</label>
        <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-chain`} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
          { listOption?.map((list, key)=>{
            return(<li key={key}>
              <div 
                className={`${(selectionUpdate === "Destination" && swap.source.chain === list.value)? "cursor-no-drop text-custom-black/50 bg-slate-300/20 pointer-events-none": ""}`}
                onClick={()=> handelSelectNetwork(list.value, list.label)} 
                >
                {list.label}
              </div>
            </li>);
          }) }
        </ul>
      </div>
    </div>
  );
};

export default InputSelectNetwork;