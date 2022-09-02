import { useContext, Fragment } from "react";
import { useNotifier } from 'react-headless-notifier';
import { DangerNotification, SuccessNotification } from 'src/components/shared/Notification';
import { SwapConfirmModalInterface } from "src/types/SwapConfirmModal";
import { SwapContext } from "src/contexts/swap.context";
import { toBigNumber } from "src/utils/calculatorCurrency.util";

const SwapConfirmModal = ({ onOpenSuccessModal }: SwapConfirmModalInterface): JSX.Element => {
  const { notify } = useNotifier();

  const { swap, swapStatus, selectToken, inputCurrency, swapConfirm } = useContext(SwapContext);

  const handelCloseModal = () => {
    document.getElementById("swap-modal")?.classList.toggle("modal-open");
  };

  const handelSwapConfirm = () => {
    swapConfirm(
      swapStatus.isApprove,
      (success: string) => {
        if (swapStatus.isApprove) {
          onOpenSuccessModal();
          handelCloseModal();
        }
        notify(
          <SuccessNotification
            message={success}
          />
        );
      },
      (error: string) => {
        notify(
          <DangerNotification
            message={error}
          />
        );
      }
    );
  };

  return (
    <div id="swap-modal" className="modal">
      <div className="modal-box relative">
        <label
          className="btn btn-sm btn-circle absolute right-2 top-2 bg-red-500 border-0 hover:bg-red-600"
          onClick={() => handelCloseModal()}
        >
          ✕
        </label>
        <h3 className="text-2xl font-bold text-center mb-5">{swapStatus.isApprove ? "Confirm Swap" : "Approve"}</h3>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          {/* <img className="mask mask-squircle mr-2" src={selectToken.source.img} width={45} /> */}
          <p className="font-semibold text-lg">{selectToken.source.symbol}</p>
          <p className="font-semibold text-lg ml-auto">{toBigNumber(inputCurrency.source.value || "0").toDP(10).toString()}</p>
        </div>
        <div className="flex justify-center text-3xl py-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700">▼</div>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          {/* <img className="mask mask-squircle mr-2" src={selectToken.destination.img} width={45} /> */}
          <p className="font-semibold text-lg">{selectToken.destination.symbol}</p>
          <p className="font-semibold text-lg ml-auto">{swap.summary.expected || toBigNumber(inputCurrency.source.value || "0").toDP(10).toString()}</p>
        </div>

        <div className="px-5 py-5">
          {swapStatus.isApprove ? (
            <Fragment>
              {swap?.summary?.fee && (
                <div className="flex">
                  <p className="font-semibold text-sm md:text-lg">MDEX Fee</p>
                  <p className="font-semibold text-sm md:text-lg ml-auto">{swap.summary.fee} {selectToken.source.symbol}</p>
                </div>
              )}
              {/* <div className="flex">
                <p className="font-semibold text-sm md:text-lg">Recieve</p>
                <p className="font-semibold text-sm md:text-lg ml-auto">{swap.summary.recieve} {selectToken.source.symbol}</p>
              </div> */}
              {/* {
              swap.summary.route?.map((list, key)=>{
                return(
                  <div className="flex" key={key}>
                    <p className="font-semibold text-sm md:text-lg">{list.name} Fee</p>
                    <p className="font-semibold text-sm md:text-lg ml-auto">{0.00} {selectToken.source.symbol}</p>
                  </div>
                )
              })
            } */}
              <div className="flex">
                <p className="font-semibold text-sm md:text-lg">Estimated ({selectToken.destination.symbol})</p>
                <div className="flex items-center cursor-pointer">
                  <div className="estimated tooltip" style={{position: 'absolute'}} data-tip="Estimated received token may be subject to price impact or slippage that may cause estimated received token to be less or more than show.">
                    <div style={{lineHeight: 0}} className="ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E727D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
                  </div>
                </div>
                <p className="font-semibold text-sm md:text-lg pl-8 md:pl-0 ml-auto">{swap.summary.expected || toBigNumber(inputCurrency.source.value || "0").toString()} {selectToken.destination.symbol}</p>
              </div>
            </Fragment>
          ) : (
            <div className="flex">
              <p className="font-semibold text-sm md:text-lg">Price {selectToken.destination.symbol} per {selectToken.source.symbol}</p>
              <p className="font-semibold text-sm md:text-lg ml-auto">{toBigNumber(swap.summary.fee || "0").plus(toBigNumber(swap.summary.expected || "1")).toString()}</p>
            </div>
          )}
        </div>
        <button
          className={`btn ${swapStatus.isApproveLoading ? "loading" : ""} btn-block`}
          disabled={swapStatus.isApproveLoading}
          onClick={() => handelSwapConfirm()}
        >
          {swapStatus.isApprove ? "Confirm Swap" : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default SwapConfirmModal;