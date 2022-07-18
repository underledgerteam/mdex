import { useEffect, useState, useContext, Fragment } from "react";
import { InputTokenSelectInterface } from "src/types/InputSelect";

import { SwapContext } from "src/contexts/swap.context";

// const InputSelectToken = ({className, selectionUpdate, defaultValue = "", selectLabel}:InputSelectInterface): JSX.Element => {
//   const { updateSwap, OpenSelectToken, debounceSelectToken, swap, selectToken, selectTokenList } = useContext(SwapContext);
//   const [inputSearchToken, setInputSearchToken] = useState({ isDisabled: false, isLoading: false, value: "" });

//   const handelShowSelectToken = async() => {
//     await OpenSelectToken(selectionUpdate);
//     document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
//   };
//   const handelCloseSelectToken = () => {
//     document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
//     setInputSearchToken({...inputSearchToken, isLoading: false,  value: ""});
//   };
//   const handelSearchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputSearchToken({...inputSearchToken, value: e.target.value});
//   };
//   const handelSelectToken = async(value: string | undefined) => {
//     await updateSwap(selectionUpdate, "token", {...swap, [selectionUpdate.toLowerCase()]: {...swap[selectionUpdate.toLowerCase()], token: value, value: undefined}});
//     document.getElementById(`dropdown-content-${selectionUpdate.toLowerCase()}-token`)?.classList.toggle("modal-open");
//   };

//   useEffect(()=>{
//     const modelCloseOutside = (e: any)  => {
//       const dropdown = document.querySelectorAll(`.modal.modal-open`);
//       if(dropdown.length > 0 && e.path[0].id === `dropdown-content-${selectionUpdate.toLowerCase()}-token`){
//         dropdown[0].classList.remove("modal-open");
//       }
//     }
//     document.body.addEventListener("click", modelCloseOutside);
//     return () => document.body.removeEventListener("click", modelCloseOutside);
//   },[]);

//   useEffect(()=>{
//     if(inputSearchToken.value !== "" ){
//       const delayInput = setTimeout(() => {
//         setInputSearchToken({...inputSearchToken, isDisabled: true, isLoading: true});
//         setTimeout(async() => {
//           console.log("delay type, input token => ", selectionUpdate, inputSearchToken.value);
//           setInputSearchToken({...inputSearchToken, isDisabled: false, isLoading: false});
//           debounceSelectToken(selectionUpdate, inputSearchToken.value);
//         }, 1000)
//       }, 500);
//       return () => { clearTimeout(delayInput) };
//     }
//   },[inputSearchToken.value]);

//   useEffect(()=>{
//     if(swap[selectionUpdate.toLowerCase()].token === "" || swap[selectionUpdate.toLowerCase()].token === undefined){
const InputSelectToken = ({ className, selectionUpdate, selectLabel, onClickSelectToken }: InputTokenSelectInterface): JSX.Element => {
  const { swap, selectToken } = useContext(SwapContext);
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
    <div className={`flex items-center py-2 border border-black border-opacity-20 rounded-lg ${className} ${inputSearchToken.isDisabled? "pointer-events-none bg-slate-300": "bg-white"}`}>
      <div className="dropdown w-full">
        <label 
          id="dropdown-title" 
          className={`select items-center w-full ${inputSearchToken.isDisabled? "pointer-events-none bg-slate-300": ""}`} 
          onClick={()=> onClickSelectToken()}
        >
          {selectToken[selectionUpdate.toLowerCase()].name? (
            <div className="flex items-center">
              <img className="mask mask-squircle mr-2" src={selectToken[selectionUpdate.toLowerCase()].img || "chian/unknown_token.svg"} width={30} /> 
              <p className="text-ellipsis-1">{selectToken[selectionUpdate.toLowerCase()].symbol}</p>
            </div>
            ): selectLabel}
        </label>
        { selectionUpdate === "Source" && swap.source.token !== undefined && (<p className="text-center w-full absolute -bottom-7 left-[50%] font-medium text-sm invisible lg:visible" style={{transform: 'translate(-50%, 0)'}}>Available: {selectToken[selectionUpdate.toLowerCase()].balanceOf || 0}</p>) }
        </div>
      </div>
    </Fragment>
  );
};

export default InputSelectToken;