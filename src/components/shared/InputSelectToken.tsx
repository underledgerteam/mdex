import { useEffect, useState, useContext, Fragment } from "react";
import { InputTokenSelectInterface } from "src/types/InputSelect";

import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { SwapContext } from "src/contexts/swap.context";

const InputSelectToken = ({ className, selectionUpdate, selectLabel, onClickSelectToken }: InputTokenSelectInterface): JSX.Element => {
  const { swap, selectToken, swapStatus } = useContext(SwapContext);
  const [inputSearchToken, setInputSearchToken] = useState({ isDisabled: false, isLoading: false, value: "" });

  useEffect(() => {
    if (!swap[selectionUpdate.toLowerCase()].token) {
      setInputSearchToken({ isDisabled: false, isLoading: false, value: "" });
    }
    if (!swap[selectionUpdate.toLowerCase()].chain) {
      setInputSearchToken({ ...inputSearchToken, isDisabled: true, isLoading: false });
    }
  }, [swap[selectionUpdate.toLowerCase()].chain, swap[selectionUpdate.toLowerCase()].token]);

  return (
    <Fragment>
    <div className={`flex items-center py-2 border border-black border-opacity-20 rounded-lg ${className} ${inputSearchToken.isDisabled || swapStatus.isSummaryLoading || swapStatus.isSwitchLoading? "pointer-events-none bg-slate-300": "bg-white"}`}>
      <div className="dropdown w-full">
        <label 
          id="dropdown-title" 
          className={`select items-center w-full ${inputSearchToken.isDisabled || swapStatus.isSummaryLoading || swapStatus.isSwitchLoading? "pointer-events-none bg-slate-300": ""}`} 
          onClick={()=> onClickSelectToken()}
        >
          {selectToken[selectionUpdate.toLowerCase()].name? (
            <div className="flex items-center">
              <img className="mask mask-squircle mr-2" src={selectToken[selectionUpdate.toLowerCase()].img || "chian/unknown_token.svg"} width={30} /> 
              <p className="text-ellipsis-1">{selectToken[selectionUpdate.toLowerCase()].symbol}</p>
            </div>
            ): selectLabel}
        </label>
        { selectionUpdate === "Source" && swap.source.token !== undefined && (<p className="text-center w-full absolute -bottom-7 left-[50%] font-medium text-sm invisible lg:visible" style={{transform: 'translate(-50%, 0)'}}>Available: {toBigNumber(selectToken[selectionUpdate.toLowerCase()].balanceOf || 0).toString()}</p>) }
        </div>
      </div>
    </Fragment>
  );
};

export default InputSelectToken;