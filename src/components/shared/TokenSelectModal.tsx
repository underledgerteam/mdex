import { useEffect, useState, useContext, Fragment } from "react";
import { SwapContext } from "src/contexts/swap.context";

interface ModalInterface {
  visible: boolean,
  selectionUpdate: string,
  onClose: Function;
};

const TokenSelectModal = (props: ModalInterface): JSX.Element | null => {
  const { visible, selectionUpdate, onClose } = props;
  const { updateSwap, debounceSelectToken, clearSelectTokenList, openSelectToken, swap, selectTokenList } = useContext(SwapContext);
  const [inputSearchToken, setInputSearchToken] = useState({
    isDisabled: false,
    isLoading: false,
    value: ""
  });

  const handelClose = () => {
    setInputSearchToken({ ...inputSearchToken, isLoading: false, value: "" });
    onClose();
    clearSelectTokenList();
  };
  const handelSearchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchToken({ ...inputSearchToken, value: e.target.value });
  };
  const handelSelectToken = async(value: string | undefined) => {
    setInputSearchToken({ ...inputSearchToken, isDisabled: true, isLoading: true });
    await updateSwap(selectionUpdate, "token", {
      ...swap,
      [selectionUpdate.toLowerCase()]: {
        ...swap[selectionUpdate.toLowerCase()],
        token: value,
        value: undefined
      }
    });
    setInputSearchToken({ ...inputSearchToken, isDisabled: false, isLoading: false });
    onClose();
    clearSelectTokenList();
  };
  
  useEffect(() => {
    if (inputSearchToken.value !== "") {
      const delayInput = setTimeout(() => {
        setInputSearchToken({ ...inputSearchToken, isDisabled: true, isLoading: true });
        setTimeout(async () => {
          setInputSearchToken({ ...inputSearchToken, isDisabled: false, isLoading: false });
          debounceSelectToken(selectionUpdate, inputSearchToken.value);
        }, 1000);
      }, 500);
      return () => { clearTimeout(delayInput); };
    }
  }, [inputSearchToken.value]);

  useEffect(() => {
    if(visible){
      (async()=>{
        setInputSearchToken({ ...inputSearchToken, isDisabled: true, isLoading: true, value: "" });
        await openSelectToken(selectionUpdate);
        setInputSearchToken({ ...inputSearchToken, isDisabled: false, isLoading: false });
      })();
    }
  }, [visible]);

  if (visible) {
    return (
      <Fragment>
        <div className="opacity-50 fixed inset-0 z-50 bg-black" />
        <div
          id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`}
          className="flex justify-center items-center overflow-visible fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="modal-box">

            <h3 className="font-bold text-2xl text-center">
              Select a token
            </h3>
            <label
              className="btn btn-sm btn-circle absolute right-2 top-2 bg-red-500 border-0 hover:bg-red-600"
              onClick={() => handelClose()}
            >
              ✕
            </label>

            <input
              type="text"
              placeholder="Search name or paste address"
              className="input input-bordered w-full my-4"
              onChange={(e) => handelSearchToken(e)}
              disabled={inputSearchToken.isDisabled}
              value={inputSearchToken.value}
            />

            {inputSearchToken.isLoading && (
              <div className="min-h-[1rem] flex items-center mb-4">
                <progress className="progress w-full bg-slate-50" />
              </div>
            )}

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
                            <div className="w-full">
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
      </Fragment>
    );
  }
  return null;
};

export default TokenSelectModal;