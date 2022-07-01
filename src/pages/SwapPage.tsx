import { Fragment, useContext } from 'react';
import Card from 'src/components/shared/Card';
import SelectionSwap from 'src/components/SelectionSwap';

import { SwapContext } from "src/contexts/swap.context";
import { Web3Context } from "src/contexts/web3.context";


const SwapPage = (): JSX.Element => {
  const { swapSwitch } = useContext(SwapContext);
  const { walletAddress, isConnected, handleConnectWallet } = useContext(Web3Context);

  return (
    <Card
      className="glass w-full md:w-2/3"
      titleClassName="text-4xl mb-5"
      title="Swap"
    >
      <Fragment>
        <SelectionSwap title="Source" />
        <div className="flex mx-auto my-5">
          <button className="btn btn-link hover:no-underline text-5xl" onClick={() => swapSwitch()}>🔃</button>
        </div>
        <SelectionSwap title="Destination" />
        {!isConnected ? (
          <button className="btn btn-primary mt-8" onClick={() => handleConnectWallet}>Connect Wallet</button>
        ) : (
          <button className="btn btn-primary mt-8">Swap</button>
        )}
      </Fragment>
    </Card>
  );
};

export default SwapPage;