import { Fragment, useContext, useEffect, useState } from 'react';
import Card from 'src/components/shared/Card';
import SelectionSwap from 'src/components/SelectionSwap';
import SwapConfirmModal from "src/components/shared/SwapConfirmModal";
import SwapSuccessModal from "src/components/SwapSuccessModal";
import TransferRateCollapse from "src/components/TransferRateCollapse";
import { SwapContext } from "src/contexts/swap.context";
import { Web3Context } from "src/contexts/web3.context";

import { SWAP_CONTRACTS } from "src/utils/constants";

import { mockData } from "src/assets/transferCollapseMockData";

const SwapPage = (): JSX.Element => {
  const { swap, swapStatus, selectToken, swapSwitch } = useContext(SwapContext);
  const { walletAddress, isConnected, handleConnectWallet } = useContext(Web3Context);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const listOptionNetwork = Object.keys(SWAP_CONTRACTS).map((key) => {
    return { value: key, chainName: SWAP_CONTRACTS[Number(key)].NETWORK_SHORT_NAME, label: (<Fragment><img className="mask mask-squircle mr-1" src={SWAP_CONTRACTS[Number(key)].SYMBOL} width={30} /> <p className="text-ellipsis-1">{SWAP_CONTRACTS[Number(key)].NETWORK_SHORT_NAME}</p></Fragment>) };
  });

  const handelSwapSwitch = () => {
    swapSwitch();
  };

  const handelCloseSuccessModal = () => {
    setIsSuccessModal(false);
  };

  useEffect(() => {
    if (swapStatus.isSuccess) {
      setIsSuccessModal(true);
    }
  }, [swapStatus.isSuccess]);

  return (
    <div className=" flex justify-center items-center p-8">
      <Card
        className="glass w-full md:w-2/3 overflow-visible"
        titleClassName="text-4xl mb-5"
        title="Swap"
      >
        <Fragment>
          <SelectionSwap title="Source" maxCurrency={true} listOptionNetwork={listOptionNetwork} />
          <div className={`flex mx-auto my-5 pb-2 rounded-2xl ${swapStatus.isSwitch ? " bg-slate-100/5 border border-spacing-1 border-slate-100/20 cursor-no-drop" : "bg-slate-100/20"}`}>
            <button className="btn btn-link text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700" disabled={swapStatus.isSwitch} onClick={() => handelSwapSwitch()}>⥮</button>
          </div>
          <SelectionSwap title="Destination" listOptionNetwork={listOptionNetwork} />
          {swapStatus.isSwap ? (
            <TransferRateCollapse {...{
              // title: `${1*selectToken.source.rate} ${selectToken.source.tokenName} = ${1*selectToken.destination.rate} ${selectToken.destination.tokenName}`,
              title: `${1} ${selectToken.source.symbol} = ${1} ${selectToken.destination.symbol}`,
              source: {
                chainName: listOptionNetwork?.find((x)=>x.value === swap.source.chain)?.chainName,
                networkName: selectToken.source.name,
                imageSrc: selectToken.source.img || "chian/unknown_token.svg",
                value: swap.source.value,
                currencySymbol: selectToken.source.symbol,
              },
              destination: {
                chainName: listOptionNetwork?.find((x)=>x.value === swap.destination.chain)?.chainName,
                networkName: selectToken.destination.symbol,
                imageSrc: selectToken.destination.img || "chian/unknown_token.svg",
                value: swap.destination.value,
                currencySymbol: SWAP_CONTRACTS[Number(4)].CURRENCY_SYMBOL,
              },
              fee: swap.summary.fee,
              recieve: swap.summary.recieve,
              expect: swap.summary.expected,
            }} />
          ) : (
            null
          )}
          {!isConnected ? (
            <button className="btn btn-connect mt-8" onClick={() => handleConnectWallet()}>Connect Wallet</button>
          ) : (
            <button
              className="btn btn-connect mt-8 disabled:text-white/60 h-fit p-2"
              disabled={!swapStatus.isSwap || ((selectToken.source.balanceOf  || 0 )< Number(swap.source.value))}
              onClick={() => document.getElementById("swap-modal")?.classList.toggle("modal-open")}
            >
              {
                !swapStatus.isTokenPool ? "No Source/Destination Token in Pool System" 
                  : !swapStatus.isSwap ? "Please Select Chain/Token or Enter Amount" 
                  : ((selectToken.source.balanceOf || 0) < Number(swap.source.value)) ? `Insufficient ${selectToken.source.symbol} balance` 
                  :"Swap"
              }
            </button>
          )}
          <SwapConfirmModal
          />
          {isSuccessModal && <SwapSuccessModal link={swapStatus.isLink} onCloseModal={() => handelCloseSuccessModal()} />}
        </Fragment>
      </Card>
    </div>
  );
};

export default SwapPage;