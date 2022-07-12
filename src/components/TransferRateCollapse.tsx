import { TransferRateCollapseInterface } from "src/types/TransferRateCollapse";
import TokenTransferCard from "src/components/shared/TokenTransferCard";

// todo dynamic render transfer route
const TransferRoute = (): JSX.Element => {
  return (
    <>
      <p>WIP transfer route WIP</p>
    </>
  );
};

const TransferRateCollapse = (props: TransferRateCollapseInterface): JSX.Element => {
  const { title, source, destination, fee, recieve, expect } = props;
  return (
    <>
      <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-5">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-medium mx-4">
          {title}
        </div>
        <div className="collapse-content">
          <div className="p-4">
            <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl mb-4">
              <div>{`Fee`}</div>
              <div>{`${fee} ${source?.currencySymbol}`}</div>
            </div>
            <div className="flex justify-between font-semibold text-md md:text-lg lg:text-xl mb-4">
              <div>{`Recieve(${source?.currencySymbol})`}</div>
              <div>{`${recieve} ${source?.currencySymbol}`}</div>
            </div>
            <div className="flex justify-between font-bold text-md md:text-lg lg:text-xl mb-4">
              <div className="underline">{`Expected output(${destination?.currencySymbol})`}</div>
              <div className="underline">{`${expect} ${destination?.currencySymbol}`}</div>
            </div>

            <TokenTransferCard {...source} />

            <TransferRoute />

            <TokenTransferCard {...destination} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferRateCollapse;