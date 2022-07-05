import { Fragment, useContext, useEffect, useState } from 'react';
import Card from 'src/components/shared/Card';
import SelectionSwap from 'src/components/SelectionSwap';

import { SwapContext } from "src/contexts/swap.context";
import { Web3Context } from "src/contexts/web3.context";

import { SWAP_CONTRACTS } from "src/utils/constants";

const SwapPage = (): JSX.Element => {
  const { swap, swapSwitch } = useContext(SwapContext);
  const { walletAddress, isConnected, handleConnectWallet } = useContext(Web3Context);

  const [isSwapDisable, setIsSwapDisable] = useState(false);

  const listOptionNetwork = Object.keys(SWAP_CONTRACTS).map((key) => {
    return { value: key, label: (<Fragment><img className="mask mask-squircle mr-1" src="https://placeimg.com/160/160/arch" width={30} /> {SWAP_CONTRACTS[Number(key)].NETWORK_SHORT_NAME}</Fragment>) };
  });

  useEffect(()=>{
    const checkSwapSourceUndefined = Object.values(swap.source).every((value)=>{ return value !== undefined? true: false });
    const checkSwapDestinationUndefined = Object.values(swap.destination).every((value)=>{ return value !== undefined? true: false });
    setIsSwapDisable(!(checkSwapSourceUndefined && checkSwapDestinationUndefined));
  },[swap]);
  
  return (
    <Card
      className="glass w-full md:w-2/3 overflow-visible"
      titleClassName="text-4xl mb-5"
      title="Swap"
    >
      <Fragment>
        <SelectionSwap title="Source" maxCurrency={true} listOptionNetwork={listOptionNetwork} />
        <div className="flex mx-auto my-5">
          <button className="btn btn-link hover:no-underline text-5xl" onClick={() => swapSwitch()}>🔃</button>
        </div>
        <SelectionSwap title="Destination" listOptionNetwork={listOptionNetwork} />
        {!isConnected ? (
          <button className="btn btn-primary mt-8" onClick={() => handleConnectWallet()}>Connect Wallet</button>
        ) : (
          <button className="btn btn-primary mt-8" disabled={isSwapDisable}>Swap</button>
        )}
      </Fragment>
    </Card>
  );
};

export default SwapPage;