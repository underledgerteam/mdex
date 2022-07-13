import { TokenCardInterface } from "src/types/TransferRateCollapse";

const TokenTransferCard = (props: TokenCardInterface) => {
  const { chainName, networkName, imageSrc, value, currencySymbol } = props;
  return (
    <div className="card card-compact md:card-side">

      <div className="p-2 my-4 md:hidden">
        <h1 className="card-title">
          <img className="mask mask-squircle mr-1" src={imageSrc} width={20} alt="token" />
          {chainName}
        </h1>
        <div>
          {networkName}
        </div>
        <div>
          {`${value} ${currencySymbol}`}
        </div>
      </div>

      <figure>
        <img className="hidden md:block mask mask-squircle mr-1" src={imageSrc} width={30} alt="token" />
      </figure>
      <div className="hidden md:card-body">
        <h1 className="card-title">
          {chainName}
        </h1>
        <div>
          {networkName}
        </div>
      </div>
      <div className="hidden md:flex items-center">
        {`${value} ${currencySymbol}`}
      </div>

    </div>
  );
};

export default TokenTransferCard;