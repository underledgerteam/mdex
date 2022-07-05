import React, { useEffect, useState, useContext } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

const InputSelect = ({className, listOption, keyUpdate, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface) => {
  const { updateSwap, swap, reloadSwitch } = useContext(SwapContext);

  const [value, setValue] = useState<string | JSX.Element>(defaultValue);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updateValue = (keyUpdate === "chain"? Number(e.target.value): e.target.value);
    updateSwap(selectionUpdate, keyUpdate, {...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], [keyUpdate]: updateValue}});
    setValue(e.target.value);
  };
  const onShow = () => {
    const dropdown = document.querySelectorAll(".dropdown-content.show");
    dropdown && dropdown.forEach((list)=>{
      if(list.id !== `dropdown-content-${selectionUpdate.toLowerCase()}-${keyUpdate}`){
        list.classList.remove("show");
      }
    })
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-${keyUpdate}`)?.classList.toggle("show");
  }
  const onSelect = (value: string, label: JSX.Element | string) => {
    updateSwap(selectionUpdate, keyUpdate, {...swap,[selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], [keyUpdate]: value}});
    setValue(label);
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-${keyUpdate}`)?.classList.toggle("show");
  }
  useEffect(()=>{
    setValue(listOption.find((x)=>x.value === swap[selectionUpdate.toLowerCase()][`${keyUpdate}`])?.label || "");
  },[reloadSwitch]);

  useEffect(()=>{
    const dropdownClose = (e: any)  => {
      const dropdown = document.querySelectorAll(".dropdown-content.show");
      if(dropdown.length > 0 && !e.path[0].id){
        dropdown.forEach((list)=>{
          list.classList.remove("show");
        })
      }
    }
    document.body.addEventListener("click", dropdownClose);
    return () => document.body.removeEventListener("click", dropdownClose);
  },[]);

  return(
    <div className={`flex items-center ${className}`}>
      <div className="dropdown w-full">
        <label id="dropdown-title" className="select select-bordered items-center m-1 w-full" onClick={()=> onShow()}>{value || selectLabel}</label>
        <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-${keyUpdate}`} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
          { listOption.map((list, key)=>{
            return(<li key={key}><a onClick={()=> onSelect(list.value, list.label)}>{list.label}</a></li>);
          }) }
        </ul>
      </div>
    </div>
  );
};

export default InputSelect;