import { useEffect, useState, useContext, Fragment } from "react";
import { InputSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

const mockSelect = [{
  label: "ETH", subLabel: "Ether", value: "1", img: "https://placeimg.com/160/160/arch", balance: 1000
},{
  label: "BNB", subLabel: "Binance Coin", value: "1", img: "https://placeimg.com/160/160/arch", balance: 500
},{
  label: "AVAX", subLabel: "Avalance", value: "1", img: "https://placeimg.com/160/160/arch", balance: 1235
}]

const InputSelectToken = ({className, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface) => {
  const { updateSwap, swap, reloadSwitch } = useContext(SwapContext);
  const [value, setValue] = useState<string | JSX.Element>(defaultValue);
  const [tokenList, setTokenList] = useState<any>(null);
  const [inputSearchToken, setInputSearchToken] = useState({
    isDisabled: false,
    value: ""
  });

  const handelShowSelectToken = () => {
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
  };
  const handelCloseSelectToken = () => {
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
    setInputSearchToken({...inputSearchToken, value: ""});
  };
  const handelSearchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchToken({...inputSearchToken, value: e.target.value});
  };
  const handelSelectToken = (value: string, label: JSX.Element | string) => {
    updateSwap(selectionUpdate, "token", {...swap, [selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], token: value}});
    setValue(label);
    document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
  };

  useEffect(()=>{
    if(inputSearchToken.value !== "" ){
      const delayInput = setTimeout(() => {
        setInputSearchToken({...inputSearchToken, isDisabled: true});
        setTokenList(null);
        setTimeout(() => {
          console.log("delay type, input token => ", selectionUpdate, inputSearchToken.value);
          setInputSearchToken({...inputSearchToken, isDisabled: false});
          setTokenList(mockSelect);
        }, 5000)
      }, 3000);
      return () => { clearTimeout(delayInput) };
    }
  },[inputSearchToken.value]);

  useEffect(()=>{
    setValue("");
  },[reloadSwitch]);

  return(
    <div className={`flex items-center ${className}`}>
      <div className="dropdown w-full">
        <label id="dropdown-title" className="select select-bordered items-center m-1 w-full" onClick={()=> handelShowSelectToken()}>{value || selectLabel}</label>
          <div id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`} className="modal overflow-visible">
          <div className="modal-box">
            <label 
              className="btn btn-sm btn-circle absolute right-2 top-2"
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
            
            { inputSearchToken.isDisabled && (<div className="min-h-[1rem] flex items-center mb-4"><progress className="progress w-full" /></div>) }

            { !inputSearchToken.isDisabled && inputSearchToken.value === "0x0" && (
              <Fragment>
                <div className="border-[2px] rounded-lg mb-4" />
                <p className="py-4 text-center">No results found.</p>
              </Fragment>
            )}

            { tokenList && (
              <Fragment>
              <div className="border-[2px] rounded-lg mb-4" />
                <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`} className="menu p-2 shadow bg-base-100 rounded-box w-full">
                  <div>
                    { tokenList.map((list: any, key: any)=>{
                      return (
                        <li key={key}>
                          <div onClick={()=> handelSelectToken(list.value, <Fragment><img className="mask mask-squircle mr-1" src={list.img} width={30} /> {list.label}</Fragment>)}>
                            <img className="mask mask-squircle mr-1" src={list.img} width="40" /> 
                            <div>
                              <p className="font-semibold">{list.label}</p>
                              <p className="text-sm">{list.subLabel}</p>
                            </div>
                            <p className="text-lg text-right">{list.balance}</p>
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
  );
};

export default InputSelectToken;