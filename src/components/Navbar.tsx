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
      <div className="navbar bg-custom-navbar w-full lg:mx-auto justify-between items-center font-bold lg:px-8 py-3">
        <div className="navbar-start">
          <div className="md:hidden flex dropdown">
            <label className="btn btn-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </label>
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {navData.map((item, key) => {
                return (

                  <li key={key}><a className="uppercase font-bold" href={item.href}>{item.name}</a></li>

                );
              })}
            </ul>
          </div>
          <div className="w-14">
            <button className="text-xl flex text-2xl text-white uppercase font-bold cursor-pointer"><img src={MdexLogo} /></button>
          </div>
        </div>
        <div className="hidden lg:flex navbar-center"><ul className="menu menu-horizontal p-0">
          {navData.map((item, key) => {
            return (

              <li key={key}><a href={item.href} className="text-xl flex text-center text-xl text-white uppercase font-bold cursor-pointer">{item.name}</a></li>

            );
          })}
        </ul>
        </div>
        <div className="hidden lg:flex navbar-end">
          {!isConnected ? (
            <button className="btn btn-connect" onClick={() => handleConnectWallet}>Connect Wallet</button>
          ) : (
            <div className="inline-block text-xl px-4 py-2 leading-none border rounded-lg text-white mt-4 lg:mt-0 cursor-pointer">{shortenAddress(walletAddress)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;