import React, { useEffect, useState, useContext, Fragment } from "react";
import { listOptionType, InputSelectInterface } from "src/types/InputSelect";

import { Web3Context } from "src/contexts/web3.context";
import { SwapContext } from "src/contexts/swap.context";

const defaultNetworkSelect = { chainId: "", symbol: "", chainName: "" };

const InputSelectNetwork = ({className, listOption, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface): JSX.Element => {
  const { updateSwap, swap, swapStatus } = useContext(SwapContext);
  const { walletAddress, isConnected } = useContext(Web3Context);
  const [network, setNetwork] = useState<listOptionType>(defaultNetworkSelect);
  const [networkVisible, setNetworkVisible] = useState<{[key: string]: boolean}>({ source: true, destination: false });

  const handelShowSelectNetwork = (selectionUpdate: string) => {
    const dropdown = document.querySelectorAll(".dropdown-content.show");
    dropdown && dropdown.forEach((list)=>{
      if(list.id !== `dropdown-content-${selectionUpdate.toLowerCase()}-chain`){
        // list.classList.remove("show");
        // document.getElementById(`root`)?.classList.remove("fix-h-screen");
      }
    });
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-chain`)?.classList.toggle("show");
    // if(selectionUpdate === "Destination"){
    //   document.getElementById(`root`)?.classList.toggle("fix-h-screen");
    // }
  };

  const handelSelectNetwork = (objChain: listOptionType) => {
    updateSwap(selectionUpdate, "chain", {...swap, [selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], chain: objChain.chainId, token: undefined, value: undefined}, summary: { fee: undefined, recieve: undefined, expected: undefined, isSplitSwap: false, route: undefined },});
    // setNetwork(objChain);
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-chain`)?.classList.toggle("show");
  };

  useEffect(()=>{
    setNetwork(listOption?.find((x)=>x.chainId === swap[selectionUpdate.toLowerCase()].chain) || defaultNetworkSelect);
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
    <div className={`flex items-center py-2 border border-black border-opacity-20 rounded-lg ${className} ${!isConnected || walletAddress === "" || swapStatus.isSummaryLoading || swapStatus.isSwitchLoading? "pointer-events-none bg-slate-300": "bg-white"}`}>
      <div className={`dropdown w-full ${selectionUpdate==="Destination"? "dropdown-top": ""}`}>
        <label id="dropdown-title" className={`select items-center w-full ${!isConnected || walletAddress === "" || swapStatus.isSummaryLoading || swapStatus.isSwitchLoading? "pointer-events-none bg-slate-300/60": ""}`} onClick={()=> handelShowSelectNetwork(selectionUpdate)}>
        { network.chainId !== ""? 
          <div className="flex items-center">
            <img className="mask mask-squircle mr-2" src={network.symbol} width={35} /> 
            <p className="text-ellipsis-1">{network.chainName}</p>
          </div>: selectLabel 
        }
        </label>
        <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-chain`} className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-full">
          { listOption?.map((list, key)=>{
            return(<li key={key}>
              <div 
                className={`${(selectionUpdate === "Destination" && swap.source.chain === list.chainId)? "cursor-no-drop text-custom-black/70 bg-slate-400/30 pointer-events-none": ""}`}
                onClick={()=> handelSelectNetwork(list)} 
                >
                <img className="mask mask-squircle mr-1" src={list.symbol} width={30} /> 
                <p className="text-ellipsis-1">{list.chainName}</p>
              </div>
            </li>);
          }) }
        </ul>
      </div>
    </div>
  );
};

export default InputSelectNetwork;