import { useEffect, useState, useContext, Fragment } from "react";
import { SwapContext } from "src/contexts/swap.context";

interface ModalInterface {
  visible: boolean,
  selectionUpdate: string,
  onClose: Function;
};

const TokenSelectModal = (props: ModalInterface): JSX.Element | null => {
  const { visible, selectionUpdate, onClose } = props;
  const { updateSwap, debounceSelectToken, swap, selectTokenList } = useContext(SwapContext);
  const [inputSearchToken, setInputSearchToken] = useState({
    isDisabled: false,
    isLoading: false,
    value: ""
  });

  const handelClose = () => {
    setInputSearchToken({ ...inputSearchToken, isLoading: false, value: "" });
    onClose();
  };
  const handelSearchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearchToken({ ...inputSearchToken, value: e.target.value });
  };
  const handelSelectToken = (value: string | undefined) => {
    updateSwap(selectionUpdate, "token", {
      ...swap,
      [selectionUpdate.toLowerCase()]: {
        ...swap[selectionUpdate.toLowerCase()],
        token: value,
        value: undefined
      }
    });
    onClose();
  };

  useEffect(() => {
    if (inputSearchToken.value !== "") {
      const delayInput = setTimeout(() => {
        setInputSearchToken({ ...inputSearchToken, isDisabled: true, isLoading: true });
        setTimeout(async () => {
          setInputSearchToken({ ...inputSearchToken, isDisabled: false, isLoading: false });
          debounceSelectToken(inputSearchToken.value);
        }, 1000);
      }, 500);
      return () => { clearTimeout(delayInput); };
    }
  }, [inputSearchToken.value]);

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

            {(!inputSearchToken.isLoading && inputSearchToken.value !== "" && selectTokenList?.length <= 0) && (
              <Fragment>
                <div className="border-[2px] rounded-lg mb-4" />
                <p className="py-4 text-center">No results found.</p>
              </Fragment>
            )}

            {selectTokenList?.length > 0 && (
              <Fragment>
                <div className="border-[2px] rounded-lg mb-4" />
                <ul id={`dropdown-content-${selectionUpdate.toLowerCase()}-token`} className="menu p-2 shadow bg-base-100 rounded-box w-full">
                  <div>
                    {selectTokenList.map((list, key: any) => {
                      return (
                        <li key={key}>
                          <div onClick={() => handelSelectToken(list.value)}>
                            <img className="mask mask-squircle mr-1" src={list.img} width="40" />
                            <div>
                              <p className="font-semibold">{list.label}</p>
                              <p className="text-sm">{list.subLabel}</p>
                              <p className="text-sm block sm:hidden">Available: {list.maxAmount}</p>
                            </div>
                            <p className="text-md font-semibold text-right hidden sm:block">{list.maxAmount}</p>
                          </div>
                        </li>
                      );
                    })}
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