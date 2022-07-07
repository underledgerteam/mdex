import { useEffect, useState, useContext, Fragment } from "react";
import { SwapConfirmModalInterface } from "src/types/SwapConfirmModal";

import { SwapContext } from "src/contexts/swap.context";

const SwapConfirmModal = (): JSX.Element => {
  const { updateSwap, swap } = useContext(SwapContext);
  return(
    <div id="swap-modal" className="modal">
      <div className="modal-box relative">
        <label 
          className="btn btn-sm btn-circle absolute right-2 top-2" 
          onClick={()=> document.getElementById("swap-modal")?.classList.toggle("modal-open")}
        >
          ✕
        </label>
        <h3 className="text-2xl font-bold text-center mb-5">Approve | Confirm Swap</h3>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          <img className="mask mask-squircle mr-2" src="https://placeimg.com/160/160/arch" width={45} />
          <p className="font-semibold text-lg">TEST</p>
          <p className="font-semibold text-lg text-right">1000</p>
        </div>
        <div className="flex justify-center text-3xl py-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700">▼</div>
        <div className="flex items-center px-5 py-5 border-2 rounded-2xl">
          <img className="mask mask-squircle mr-2" src="https://placeimg.com/160/160/arch" width={45} />
          <p className="font-semibold text-lg">TEST</p>
          <p className="font-semibold text-lg text-right">1000</p>
        </div>

        <div className="px-5 py-5">
          {/* Approve */}
          <div className="flex">
            <p className="font-semibold text-lg">Price per SIP</p>
            <p className="font-semibold text-lg text-right">300.1293</p>
          </div>
          {/* Confirm */}
          <div className="flex">
            <p className="font-semibold text-lg">Fee</p>
            <p className="font-semibold text-lg text-right">0.075 SIP</p>
          </div>
          <div className="flex">
            <p className="font-semibold text-lg">Recieve</p>
            <p className="font-semibold text-lg text-right">29.925 SIP</p>
          </div>

        </div>
        <button className="btn loading btn-block">Approve | Confirm Swap</button>
      </div>
    </div>
  );
};

export default SwapConfirmModal;