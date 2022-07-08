import React, { useEffect, useState, useContext } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { Web3Context } from "src/contexts/web3.context";
import { SwapContext } from "src/contexts/swap.context";

const InputSelectNetwork = ({className, listOption, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface): JSX.Element => {
  const { updateSwap, swap } = useContext(SwapContext);
  const { walletAddress, isConnected } = useContext(Web3Context);
  const [value, setValue] = useState<string | JSX.Element>(defaultValue);

  const handelShowSelectNetwork = () => {
    const dropdown = document.querySelectorAll(".dropdown-content.show");
    dropdown && dropdown.forEach((list)=>{
      if(list.id !== `dropdown-content-${selectionUpdate.toLowerCase()}-chain`){
        list.classList.remove("show");
        // document.getElementById(`root`)?.classList.remove("fix-h-screen");
      }
    });
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-chain`)?.classList.toggle("show");
    // if(selectionUpdate === "Destination"){
    //   document.getElementById(`root`)?.classList.toggle("fix-h-screen");
    // }
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
        dropdown.forEach((list)=>{ 
          list.classList.remove("show"); 
          // document.getElementById(`root`)?.classList.remove("fix-h-screen");
        });
      }
    }
    document.body.addEventListener("click", dropdownClose);
    return () => document.body.removeEventListener("click", dropdownClose);
  },[]);
  
  return(
    <div className={`flex items-center ${className}`}>
      <div className={`dropdown w-full ${selectionUpdate==="Destination"? "dropdown-top": ""}`}>
        <label id="dropdown-title" className={`select select-bordered items-center m-1 w-full ${!isConnected || walletAddress === ""? "pointer-events-none bg-slate-300/60": ""}`} onClick={()=> handelShowSelectNetwork()}>{value || selectLabel}</label>
        <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-chain`} className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-full">
          { listOption?.map((list, key)=>{
            return(<li key={key}>
              <div 
                className={`${(selectionUpdate === "Destination" && swap.source.chain === list.value)? "cursor-no-drop text-custom-black/70 bg-slate-400/30 pointer-events-none": ""}`}
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