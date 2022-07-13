import { useEffect, useState, useContext, Fragment } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

const InputSelectToken = ({className, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface): JSX.Element => {
  const { updateSwap, debounceSelectToken, swap, selectToken, selectTokenList } = useContext(SwapContext);
  const [inputSearchToken, setInputSearchToken] = useState({ isDisabled: false, isLoading: false, value: "" });

  const handelShowSelectToken = () => {
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
  };
  const handelCloseSelectToken = () => {
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
    setInputSearchToken({...inputSearchToken, isLoading: false,  value: ""});
  };
  const handelSearchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchToken({...inputSearchToken, value: e.target.value});
  };
  const handelSelectToken = (value: string | undefined) => {
    updateSwap(selectionUpdate, "token", {...swap, [selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], token: value, value: undefined}});
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
  };

  useEffect(()=>{
    const modelCloseOutside = (e: any)  => {
      const dropdown = document.querySelectorAll(`.modal.modal-open`);
      if(dropdown.length > 0 && e.path[0].id === `dropdown-content-${selectionUpdate.toLowerCase()}-token`){
        dropdown[0].classList.remove("modal-open");
      }
    }
    document.body.addEventListener("click", modelCloseOutside);
    return () => document.body.removeEventListener("click", modelCloseOutside);
  },[]);

  useEffect(()=>{
    if(inputSearchToken.value !== "" ){
      const delayInput = setTimeout(() => {
        setInputSearchToken({...inputSearchToken, isDisabled: true, isLoading: true});
        setTimeout(async() => {
          console.log("delay type, input token => ", selectionUpdate, inputSearchToken.value);
          setInputSearchToken({...inputSearchToken, isDisabled: false, isLoading: false});
          debounceSelectToken(inputSearchToken.value);
        }, 1000)
      }, 500);
      return () => { clearTimeout(delayInput) };
    }
  },[inputSearchToken.value]);

  useEffect(()=>{
    if(swap[selectionUpdate.toLowerCase()].token === "" || swap[selectionUpdate.toLowerCase()].token === undefined){
      setInputSearchToken({ isDisabled: false, isLoading: false, value: "" });
    }
    if(swap[selectionUpdate.toLowerCase()].chain === undefined || swap[selectionUpdate.toLowerCase()].chain === ""){
      setInputSearchToken({ ...inputSearchToken, isDisabled: true, isLoading: false });
    }
  },[swap[selectionUpdate.toLowerCase()].chain, swap[selectionUpdate.toLowerCase()].token]);

  return(
    <Fragment>
    <div className={`flex items-center py-2 border border-black border-opacity-20 rounded-lg ${className} ${inputSearchToken.isDisabled? "pointer-events-none bg-slate-300": "bg-white"}`}>
      <div className="dropdown w-full">
        <label 
          id="dropdown-title" 
          className={`select items-center w-full ${inputSearchToken.isDisabled? "pointer-events-none bg-slate-300": ""}`} 
          onClick={()=> handelShowSelectToken()}
        >
          {selectToken[selectionUpdate.toLowerCase()].label || selectLabel}
        </label>
        { selectionUpdate === "Source" && swap.source.token !== undefined && (<p className="text-center w-full absolute -bottom-7 left-[50%] font-medium text-sm invisible lg:visible" style={{transform: 'translate(-50%, 0)'}}>Available: {selectToken[selectionUpdate.toLowerCase()].maxAmount}</p>) }
        <div id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`} className="modal overflow-visible">
          <div className="modal-box">
            <label 
              className="btn btn-sm btn-circle absolute right-2 top-2 bg-red-500 border-0 hover:bg-red-600"
              onClick={()=> handelCloseSelectToken()}
            >
              ✕
            </label>
            <h3 className="font-bold text-2xl text-center">Select a token</h3>

            <input 
              type="text" 
              placeholder="Search name or paste address" 
              className="input input-bordered w-full my-4" 
              onChange={(e)=> handelSearchToken(e)} 
              disabled={inputSearchToken.isDisabled}
              value={inputSearchToken.value}
            />

            { inputSearchToken.isLoading && (<div className="min-h-[1rem] flex items-center mb-4"><progress className="progress w-full bg-slate-50" /></div>) }

            { (!inputSearchToken.isLoading && inputSearchToken.value !== "" && selectTokenList?.length <= 0) && (
              <Fragment>
                <div className="border-[2px] rounded-lg mb-4" />
                <p className="py-4 text-center">No results found.</p>
              </Fragment>
            )}

            { selectTokenList?.length > 0 && (
              <Fragment>
              <div className="border-[2px] rounded-lg mb-4" />
                <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`} className="menu p-2 shadow bg-base-100 rounded-box w-full">
                  <div>
                    { selectTokenList.map((list, key: any)=>{
                      return (
                        <li key={key}>
                          <div onClick={()=> handelSelectToken(list.value)}>
                            <img className="mask mask-squircle mr-1" src={list.img} width="40" /> 
                            <div>
                              <p className="font-semibold">{list.label}</p>
                              <p className="text-sm">{list.subLabel}</p>
                              <p className="text-sm block sm:hidden">Available: {list.maxAmount}</p>
                            </div>
                            <p className="text-md font-semibold text-right hidden sm:block">{list.maxAmount}</p>
                          </div>
                        </li>
                      )
                    }) }
                  </div>
                </ul>
              </Fragment>
            )}

          </div>
        </div>
      </div>
    </div>
    
    
    </Fragment>
  );
};

export default InputSelectToken;