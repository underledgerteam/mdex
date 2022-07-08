import { useEffect, useState, useContext, Fragment } from "react";
import { SwapConfirmModalInterface } from "src/types/SwapConfirmModal";

import { SwapContext } from "src/contexts/swap.context";

const SwapConfirmModal = (): JSX.Element => {
  const { updateSwap, swap, swapStatus, selectToken, swapConfirm } = useContext(SwapContext);

  const handelCloseModal = () => {
    document.getElementById("swap-modal")?.classList.toggle("modal-open")
  };

  const handelSwapConfirm = () => {
    swapConfirm(
      swapStatus.isApprove,
      ()=> { handelCloseModal() },
      ()=> {}
    );
  };

  return(
    <div id="swap-modal" className="modal">
      <div className="modal-box relative">
        <label 
          className="btn btn-sm btn-circle absolute right-2 top-2" 
          onClick={()=> handelCloseModal()}
        >
          ✕
        </label>
        <h3 className="text-2xl font-bold text-center mb-5">{swapStatus.isApprove? "Confirm Swap": "Approve"}</h3>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          {/* <img className="mask mask-squircle mr-2" src={selectToken.source.img} width={45} /> */}
          <p className="font-semibold text-lg">{selectToken.source.tokenName}</p>
          <p className="font-semibold text-lg text-right">{swap.source.value}</p>
        </div>
        <div className="flex justify-center text-3xl py-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700">▼</div>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          {/* <img className="mask mask-squircle mr-2" src={selectToken.destination.img} width={45} /> */}
          <p className="font-semibold text-lg">{selectToken.destination.tokenName}</p>
          <p className="font-semibold text-lg text-right">{swap.destination.value}</p>
        </div>

        <div className="px-5 py-5">
          { swapStatus.isApprove? (
            <Fragment>
              <div className="flex">
                <p className="font-semibold text-lg">Fee</p>
                <p className="font-semibold text-lg text-right">{swap.summary.fee} {selectToken.source.tokenName}</p>
              </div>
              <div className="flex">
                <p className="font-semibold text-lg">Recieve</p>
                <p className="font-semibold text-lg text-right">{swap.summary.recieve} {selectToken.source.tokenName}</p>
              </div>
              <div className="flex">
                <p className="font-semibold text-lg">Expected Output(ETH)</p>
                <p className="font-semibold text-lg text-right">{swap.summary.expected} {selectToken.destination.tokenName}</p>
              </div>
            </Fragment>
          ): (
            <div className="flex">
              <p className="font-semibold text-lg">Price per {selectToken.source.tokenName}</p>
              <p className="font-semibold text-lg text-right">{selectToken.source.rate}</p>
            </div>
          ) }
        </div>
        <button 
          className={`btn ${swapStatus.isLoading? "loading": ""} btn-block`}
          onClick={()=> handelSwapConfirm()}
        >
          {swapStatus.isApprove? "Confirm Swap": "Approve"}
        </button>
      </div>
    </div>
  );
};

export default SwapConfirmModal;