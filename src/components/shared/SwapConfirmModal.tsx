import { useEffect, useState, useContext, Fragment } from "react";
import { useNotifier } from 'react-headless-notifier';
import { DangerNotification, SuccessNotification } from 'src/components/shared/Notification';
import { SwapConfirmModalInterface } from "src/types/SwapConfirmModal";
import { SwapContext } from "src/contexts/swap.context";

const SwapConfirmModal = ({onOpenSuccessModal}: SwapConfirmModalInterface): JSX.Element => {
  const { notify } = useNotifier();

  const { updateSwap, swap, swapStatus, selectToken, swapConfirm } = useContext(SwapContext);

  const handelCloseModal = () => {
    document.getElementById("swap-modal")?.classList.toggle("modal-open")
  };

  const handelSwapConfirm = () => {
    swapConfirm(
      swapStatus.isApprove,
      (success: string)=> { 
        if(swapStatus.isApprove){ 
          onOpenSuccessModal();
          handelCloseModal(); 
        } 
        notify(
          <SuccessNotification 
            message={success}
          />
        );
      },
      (error: string)=> {
        notify(
          <DangerNotification 
            message={error}
          />
        );
      }
    );
  };

  return(
    <div id="swap-modal" className="modal">
      <div className="modal-box relative">
        <label 
          className="btn btn-sm btn-circle absolute right-2 top-2 bg-red-500 border-0 hover:bg-red-600" 
          onClick={()=> handelCloseModal()}
        >
          ✕
        </label>
        <h3 className="text-2xl font-bold text-center mb-5">{swapStatus.isApprove? "Confirm Swap": "Approve"}</h3>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          {/* <img className="mask mask-squircle mr-2" src={selectToken.source.img} width={45} /> */}
          <p className="font-semibold text-lg">{selectToken.source.symbol}</p>
          <p className="font-semibold text-lg ml-auto">{swap.source.value}</p>
        </div>
        <div className="flex justify-center text-3xl py-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700">▼</div>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          {/* <img className="mask mask-squircle mr-2" src={selectToken.destination.img} width={45} /> */}
          <p className="font-semibold text-lg">{selectToken.destination.symbol}</p>
          <p className="font-semibold text-lg ml-auto">{swap.destination.value}</p>
        </div>

        <div className="px-5 py-5">
          { swapStatus.isApprove? (
            <Fragment>
              <div className="flex">
                <p className="font-semibold text-sm md:text-lg">Fee</p>
                <p className="font-semibold text-sm md:text-lg ml-auto">{swap.summary.fee} {selectToken.source.symbol}</p>
              </div>
              <div className="flex">
                <p className="font-semibold text-sm md:text-lg">Recieve</p>
                <p className="font-semibold text-sm md:text-lg ml-auto">{swap.summary.recieve} {selectToken.source.symbol}</p>
              </div>
              <div className="flex">
                <p className="font-semibold text-sm md:text-lg">Expected Output ({selectToken.destination.symbol})</p>
                <p className="font-semibold text-sm md:text-lg ml-auto">{swap.summary.expected} {selectToken.destination.symbol}</p>
              </div>
            </Fragment>
          ): (
            <div className="flex">
              <p className="font-semibold text-sm md:text-lg">Price per {selectToken.source.symbol}</p>
              <p className="font-semibold text-sm md:text-lg ml-auto">{1}</p>
            </div>
          ) }
        </div>
        <button 
          className={`btn ${swapStatus.isApproveLoading? "loading": ""} btn-block`}
          disabled={swapStatus.isApproveLoading}
          onClick={()=> handelSwapConfirm()}
        >
          {swapStatus.isApprove? "Confirm Swap": "Approve"}
        </button>
      </div>
    </div>
  );
};

export default SwapConfirmModal;