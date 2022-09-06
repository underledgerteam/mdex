import { useState, useEffect } from "react";

import { TransferRateCollapseInterface, TransferRoute } from "src/types/TransferRateCollapse";
import TokenTransferCard from "src/components/shared/TokenTransferCard";
import TransferRateRoute from "src/components/TransferRateRoute";

const TransferRateCollapse = (props: TransferRateCollapseInterface): JSX.Element => {
  const { title, source, destination, fee, recieve, expect, route, amount } = props;

  const [transferRoute, setTransferRoute] = useState<Array<TransferRoute>>([]);
  useEffect(() => {
    const transferRouteList = route?.reduce((previousValue: any, currentValue, currentIndex) => {
      return [
        ...previousValue,
        {
          key: `${currentIndex}`,
          name: `${currentValue.name} Fee`,
          fee: `${currentValue.fee} ${source?.currencySymbol}`
        }
      ];
    }, []) || [];
    setTransferRoute([...transferRouteList, { key: `${transferRouteList.length}`, name: "Convert", fee: "" }]);
  }, []);

  return (
    <>
      <div className="collapse collapse-arrow border border-base-300 bg-base-100/80 rounded-box mt-5">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-medium lg:mx-4">
          {title}
        </div>
        <div className="collapse-content">
          <div className="lg:p-4">
            <div className="flex justify-between font-semibold text-sm md:text-lg lg:text-xl lg:mb-4">
              <div>{`MDEX Fee`}</div>
              <div>{`${fee} ${source?.currencySymbol}`}</div>
            </div>
            {/* <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl lg:mb-4">
              <div>{`Recieve(${source?.currencySymbol})`}</div>
              <div>{`${recieve} ${source?.currencySymbol}`}</div>
            </div> */}
            {/* {
              route?.map((list, key)=>{
                return(
                  <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl lg:mb-4" key={key}>
                    <div>{`${list.name} ${list.fee !== "0"?"Fee":""}`}</div>
                    {list.fee !== "0" && (<div>{`${list.fee} ${source?.currencySymbol}`}</div>)}
                  </div>
                )
              })
            } */}

            {/* <div className="flex flex-wrap">
              <div className="underline">
                <div className="flex">
                  <p className="font-semibold text-sm md:text-lg whitespace-nowrap">Estimated (LAT)</p>
                  <div className="flex items-start mt-[0.2rem] md:mt-[0.5rem] cursor-pointer w-4">
                    <div className="estimated tooltip" data-tip="Estimated received token may be subject to price impact or slippage that may cause estimated received token to be less or more than show.">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E727D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-sm md:text-lg">0.559705719749917249 LAT</p>
              </div>
            </div> */}
            <div className="flex justify-between font-bold text-sm md:text-lg lg:text-xl lg:mb-4">
              <p className="text-sm md:text-lg underline">
                Estimated 
                <div className="inline-block ml-1">
                  {`(${destination?.currencySymbol})`} 
                  <div className="cursor-pointer w-5 inline-block align-middle ml-1">
                    <div className="estimated tooltip tooltip-right" data-tip="Estimated received token may be subject to price impact or slippage that may cause estimated received token to be less or more than show.">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6E727D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </div>
                  </div>
                </div>
              </p>
              <div className="underline text-end">{`${expect} ${destination?.currencySymbol}`}</div>
            </div>

            <TokenTransferCard {...source} />

            <TransferRateRoute dataSrc={transferRoute} />

            <TokenTransferCard {...destination} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferRateCollapse;