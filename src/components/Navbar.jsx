import React, { Fragment, useContext } from "react";
import { Web3Context } from "src/contexts/web3.context";
import { shortenAddress } from "src/utils/shortenAddress.util";

const Navbar = () => {
  const { walletAddress, isConnected, handleConnectWallet } = useContext(Web3Context);

  return (<>
    <div className="flex flex-col">
      <div className="navbar bg-custom-navbar drop-shadow-navbar">
        <div className="navbar-start flex w-full lg:mx-auto justify-between items-center font-bold px-5 py-6">
          <button className="text-xl flex text-center text-2xl text-white uppercase cursor-pointer">mdex</button>
        </div>
        <div className="hidden lg:flex navbar-end">
          {!isConnected ? (
            <button className="btn btn-connect" onClick={() => handleConnectWallet}>Connect Wallet</button>
          ) : (
            <button className="inline-block text-2xl px-4 py-2 leading-none border rounded-full text-white mt-4 lg:mt-0 cursor-pointer">{shortenAddress(walletAddress)}</button>
          )}

        </div>
      </div>
    </div>
  </>);
};

export default Navbar;