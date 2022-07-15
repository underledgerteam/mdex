import { useEffect, useState, useContext, Fragment } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

const InputSelectToken = ({className, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface): JSX.Element => {
  const { updateSwap, OpenSelectToken, debounceSelectToken, swap, selectToken, selectTokenList } = useContext(SwapContext);
  const [inputSearchToken, setInputSearchToken] = useState({ isDisabled: false, isLoading: false, value: "" });

  const handelShowSelectToken = async() => {
    await OpenSelectToken(selectionUpdate);
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
  };
  const handelCloseSelectToken = () => {
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
    setInputSearchToken({...inputSearchToken, isLoading: false,  value: ""});
  };
  const handelSearchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchToken({...inputSearchToken, value: e.target.value});
  };
  const handelSelectToken = async(value: string | undefined) => {
    await updateSwap(selectionUpdate, "token", {...swap, [selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], token: value, value: undefined}});
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
          debounceSelectToken(selectionUpdate, inputSearchToken.value);
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
          {selectToken[selectionUpdate.toLowerCase()].name? (
            <div className="flex items-center">
              <img className="mask mask-squircle mr-2" src={selectToken[selectionUpdate.toLowerCase()].img || "chian/unknown_token.svg"} width={30} /> 
              <p className="text-ellipsis-1">{selectToken[selectionUpdate.toLowerCase()].symbol}</p>
            </div>
            ): selectLabel}
        </label>
        { selectionUpdate === "Source" && swap.source.token !== undefined && (<p className="text-center w-full absolute -bottom-7 left-[50%] font-medium text-sm invisible lg:visible" style={{transform: 'translate(-50%, 0)'}}>Available: {selectToken[selectionUpdate.toLowerCase()].balanceOf || 0}</p>) }
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

            { (!inputSearchToken.isLoading && inputSearchToken.value !== "" && Object.keys(selectTokenList)?.length <= 0) && (
              <Fragment>
                <div className="border-[2px] rounded-lg mb-4" />
                <p className="py-4 text-center">No results found.</p>
              </Fragment>
            )}

            { Object.keys(selectTokenList)?.length > 0 && (
              <Fragment>
              <div className="border-[2px] rounded-lg mb-4" />
                <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`} className="menu p-2 shadow bg-base-100 rounded-box w-full">
                  <div>
                    { Object.keys(selectTokenList).map((keyToken: any, key: any)=>{
                      return (
                        <li key={key}>
                          <div onClick={()=> handelSelectToken(keyToken)} className={`${(swap.source.token === keyToken || swap.destination.token === keyToken)? "cursor-no-drop text-custom-black/70 bg-slate-400/20 pointer-events-none": ""}`}>
                            <img className="mask mask-squircle mr-1" src={selectTokenList[keyToken]?.img || "chian/unknown_token.svg"} width="40" /> 
                            <div>
                              <p className="font-semibold">{selectTokenList[keyToken]?.symbol}</p>
                              <p className="text-sm">{selectTokenList[keyToken]?.name}</p>
                              <p className="text-sm block sm:hidden">Available: {selectTokenList[keyToken]?.balanceOf || 0}</p>
                            </div>
                            <p className="text-md font-semibold text-right hidden sm:block">{selectTokenList[keyToken]?.balanceOf || 0}</p>
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