import { Fragment, useContext, useEffect, useState } from 'react';
import Card from 'src/components/shared/Card';
import SelectionSwap from 'src/components/SelectionSwap';
import SwapConfirmModal from "src/components/shared/SwapConfirmModal";
import SwapSuccessModal from "src/components/SwapSuccessModal";
import TransferRateCollapse from "src/components/TransferRateCollapse";
import TokenSelectModal from "src/components/shared/TokenSelectModal";
import { SwapContext } from "src/contexts/swap.context";
import { Web3Context } from "src/contexts/web3.context";
import { toBigNumber } from "src/utils/calculatorCurrency.util";

import { SWAP_CONTRACTS } from "src/utils/constants";

const SwapPage = (): JSX.Element => {
  const { swap, swapStatus, selectToken, inputCurrency, clearSwapStatus, swapSwitch, isTokenApprove } = useContext(SwapContext);
  const { walletAddress, isConnected, handleConnectWallet } = useContext(Web3Context);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [destinationModalVisible, setDestinationModalVisible] = useState(false);

  const listOptionNetwork = Object.keys(SWAP_CONTRACTS).map((key) => {
    return { chainId: key, chainName: SWAP_CONTRACTS[Number(key)].NETWORK_SHORT_NAME, symbol: SWAP_CONTRACTS[Number(key)].SYMBOL };
  });

  const handelSwapSwitch = () => {
    swapSwitch();
  };

  const handelOpenSuccessModal = () => {
    setIsSuccessModal(true);
  };

  const handelCloseSuccessModal = () => {
    clearSwapStatus();
    setIsSuccessModal(false);
  };

  const handleOpenSourceTokenModal = async () => {
    setSourceModalVisible(true);
  };

  const handleOpenDestinationTokenModal = async () => {
    setDestinationModalVisible(true);
  };

  const handleOpenSwapModal = async () => {
    isTokenApprove();
    document.getElementById("swap-modal")?.classList.toggle("modal-open");
  };
  return (
    <div className=" flex justify-center items-center lg:p-8">
      <Card
        className="glass w-full md:w-2/3 overflow-visible"
        titleClassName="text-4xl mb-5"
        bodyClassName="p-4 lg:p-8"
        title="Swap"
      >
        <Fragment>
          {swapStatus.isSwitchLoading &&
            <Card className="bg-slate-600/40 w-full h-full absolute z-50 -m-8">
              <div className="flex justify-center items-center h-full text-4xl text-white font-bold">Waiting Get Balance of Token. . .</div>
            </Card>
          }
          <SelectionSwap title="Source" maxCurrency={true} listOptionNetwork={listOptionNetwork} onClickSelectToken={handleOpenSourceTokenModal} />
          <div className={`flex mx-auto my-5 pb-2 rounded-2xl ${swapStatus.isSwitch ? " bg-slate-100/5 border border-spacing-1 border-slate-100/20 cursor-no-drop" : "bg-slate-100/20"}`}>
            <button className="btn btn-link text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700" disabled={swapStatus.isSwitch || swapStatus.isSummaryLoading} onClick={() => handelSwapSwitch()}>⥮</button>
          </div>
          <SelectionSwap title="Destination" listOptionNetwork={listOptionNetwork} onClickSelectToken={handleOpenDestinationTokenModal} />
          {swapStatus.isTokenPool && !swapStatus.isSummaryLoading && swapStatus.isSwap && swap.summary.isSplitSwap !== undefined ? (
            <TransferRateCollapse {...{
              title: `${1} ${selectToken.source.symbol} = ${toBigNumber(swap.summary.fee || "").plus(toBigNumber(swap.summary.expected || "")).div(toBigNumber(swap.source.value || "")).toString()} ${selectToken.destination.symbol}`,
              source: {
                chainName: listOptionNetwork?.find((x) => x.chainId === swap.source.chain)?.chainName,
                networkName: selectToken.source.name,
                imageSrc: selectToken.source.img || "chian/unknown_token.svg",
                value: inputCurrency.source.value,
                currencySymbol: selectToken.source.symbol,
              },
              destination: {
                chainName: listOptionNetwork?.find((x) => x.chainId === swap.destination.chain)?.chainName,
                networkName: selectToken.destination.symbol,
                imageSrc: selectToken.destination.img || "chian/unknown_token.svg",
                value: swap.summary.expected,
                currencySymbol: selectToken.destination.symbol,
              },
              fee: swap.summary.fee,
              recieve: swap.summary.recieve,
              expect: swap.summary.expected,
              route: swap.summary.route,
              amount: swap.summary.amount,
            }} />
          ) : (
            null
          )}
          
          {!isConnected ? (
            <button className="btn btn-connect mt-8" onClick={() => handleConnectWallet()}>Connect Wallet</button>
          ) : (
            <button
              className={`btn btn-connect mt-8 disabled:text-white/60 h-fit p-2 ${swapStatus.isSummaryLoading ? "loading" : ""}`}
              disabled={!swapStatus.isSwap || Number(inputCurrency.source.value) <= 0 || swapStatus.isSummaryLoading || !swapStatus.isTokenPool || swapStatus.isSummaryLoading || swapStatus.isSwitchLoading || ((selectToken.source.balanceOf || 0) < Number(inputCurrency.source.value))}
              onClick={() => handleOpenSwapModal()}
            >
              {
                swapStatus.isSummaryLoading ? "Fetching best price..."
                  : !swapStatus.isTokenPool ? "No Source/Destination Token in Pool System"
                    : !swapStatus.isSwap || Number(inputCurrency.source.value) <= 0 ? "Please Select Chain/Token or Enter Amount"
                      : ((selectToken.source.balanceOf || 0) < Number(inputCurrency.source.value)) ? `Insufficient ${selectToken.source.symbol} balance`
                        : "Swap"
              }
            </button>
          )}
        </Fragment>
      </Card>

      <TokenSelectModal visible={sourceModalVisible} selectionUpdate="Source" onClose={() => setSourceModalVisible(false)} />
      <TokenSelectModal visible={destinationModalVisible} selectionUpdate="Destination" onClose={() => setDestinationModalVisible(false)} />
      <SwapConfirmModal onOpenSuccessModal={() => handelOpenSuccessModal()} />
      {isSuccessModal && <SwapSuccessModal link={swapStatus.isLink} onCloseModal={() => handelCloseSuccessModal()} />}
    </div>
  );
};

export default SwapPage;