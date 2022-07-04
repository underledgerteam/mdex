import { useContext } from "react";
import { Web3Context } from "src/contexts/web3.context";
import { shortenAddress } from "src/utils/shortenAddress.util";

// Assets
import MdexLogo from "../assets/images/logo/mdex_logo.png";

const navData = [
  {
    name: "swap",
    href: "/",
  }
];

const Navbar = () => {
  const { walletAddress, isConnected, handleConnectWallet } = useContext(Web3Context);

  return (
    <div className="flex flex-col">
      <div class="navbar bg-custom-navbar w-full lg:mx-auto justify-between items-center font-bold lg:px-8 py-5">
        <div class="navbar-start">
          <div className="w-20">
            <button class="text-xl flex text-2xl text-white uppercase font-bold cursor-pointer"><img src={MdexLogo} /></button>
          </div>
          <div class="navbar hidden lg:flex">
            <ul class="menu menu-horizontal p-0">
              {navData.map((item) => {
                return (

                  <li><a href={item.href} class="text-xl flex text-center text-xl text-white uppercase font-bold cursor-pointer">{item.name}</a></li>

                );
              })}
            </ul>
          </div>
        </div>
        <div class="hidden lg:flex navbar-end">
          {!isConnected ? (
            <button className="btn btn-connect" onClick={() => handleConnectWallet}>Connect Wallet</button>
          ) : (
            <button className="inline-block text-2xl px-4 py-2 leading-none border rounded-full text-white mt-4 lg:mt-0 cursor-pointer">{shortenAddress(walletAddress)}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;