import { useState, useEffect } from "react";
import { utils } from "ethers";

import { toBigNumber } from "src/utils/calculatorCurrency.util";
import { TransferRateCollapseInterface } from "src/types/TransferRateCollapse";
import TokenTransferCard from "src/components/shared/TokenTransferCard";
import TransferRateRoute from "src/components/TransferRateRoute";

const TransferRateCollapse = (props: TransferRateCollapseInterface): JSX.Element => {
  const { title, source, destination, fee, recieve, expect, route, amount } = props;

  const [transferRoute, setTransferRoute] = useState<string[]>([]);
  useEffect(()=>{
    const transferRouteList = route?.reduce((previousValue: any, currentValue, currentIndex)=> {
      return previousValue.concat([`${currentValue.name} Fee ${0.00} ${source?.currencySymbol}`]);
    }, [`MDEX Fee ${fee} ${source?.currencySymbol}`]) || [];
    setTransferRoute([...transferRouteList, "Convert"]);
  },[])

  return (
    <>
      <div className="collapse collapse-arrow border border-base-300 bg-base-100/80 rounded-box mt-5">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-medium lg:mx-4">
          {title}
        </div>
        <div className="collapse-content">
          <div className="lg:p-4">
            <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl lg:mb-4">
              <div>{`MDEX Fee`}</div>
              <div>{`${fee} ${source?.currencySymbol}`}</div>
            </div>
            <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl lg:mb-4">
              <div>{`Recieve(${source?.currencySymbol})`}</div>
              <div>{`${recieve} ${source?.currencySymbol}`}</div>
            </div>
            {
              route?.map((list, key)=>{
                return(
                  <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl lg:mb-4" key={key}>
                    <div>{`${list.name} Fee`}</div>
                    <div>{`${0.00} ${source?.currencySymbol}`}</div>
                  </div>
                )
              })
            }
            <div className="flex justify-between font-bold text-md md:text-lg lg:text-xl lg:mb-4">
              <div className="underline">{`Expected output(${destination?.currencySymbol})`}</div>
              <div className="underline">{`${expect} ${destination?.currencySymbol}`}</div>
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