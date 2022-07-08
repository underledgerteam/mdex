import { FC, useContext } from "react";
import { Web3Context } from "src/contexts/web3.context";
import { shortenAddress } from "src/utils/shortenAddress.util";
import { DEFAULT_CHAIN } from "src/utils/constants";

// Assets
import MdexLogo from "../assets/images/logo/mdex_logo.png";

const navData = [
  {
    name: "swap",
    href: "/",
  }
];

const ConnectButton: FC = () => {
  const { walletAddress, isConnected, isSupported, handleConnectWallet, walletSwitchChain } = useContext(Web3Context);
  if (isConnected && isSupported) {
    return (
      <div
        id="walletAddress"
        className="inline-block text-xl px-4 py-2 leading-none border rounded-lg text-white mx-2 lg:mt-0 cursor-pointer"
        onClick={() => { }}
      >
        {shortenAddress(walletAddress)}
      </div>
    );
  } else if (isConnected && !isSupported) {
    return (
      <div
        id="networkError"
        className="inline-block text-xl px-4 py-2 leading-none border rounded-lg text-white mx-2 lg:mt-0 cursor-pointer"
        onClick={() => walletSwitchChain(DEFAULT_CHAIN)}
      >
        Network Error
      </div>
    );
  }
  return (
    <button
      id="connectButton"
      className="btn btn-connect"
      onClick={() => handleConnectWallet()}
    >
      Connect Wallet
    </button>
  );
};

const Navbar: FC = () => {
  return (
    <div className="flex flex-col">
      <div className="navbar bg-custom-navbar w-full lg:mx-auto justify-between items-center font-bold lg:px-8 py-3">
        <div className="navbar-start">
          <div className="md:hidden flex dropdown">
            <label className="btn btn-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {navData.map((item, key) => {
                return (
                  <li id={`menu-${item.name}`} key={key}>
                    <a className="uppercase font-bold cursor-pointer" href={item.href}>
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-14">
            <button className="flex text-2xl text-white uppercase font-bold cursor-pointer"><img src={MdexLogo} /></button>
          </div>
        </div>
        <div className="hidden lg:flex navbar-center"><ul className="menu menu-horizontal p-0">
          {navData.map((item, key) => {
            return (
              <li id={`menu-${item.name}`} key={key}>
                <a href={item.href} className="flex text-center text-xl text-white uppercase font-bold cursor-pointer">
                  {item.name}
                </a>
              </li>
            );
          })}
        </ul>
        </div>
        <div className="lg:flex navbar-end">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;