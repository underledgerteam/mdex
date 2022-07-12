import { TokenCardInterface } from "src/types/TransferRateCollapse";

const TokenTransferCard = (props: TokenCardInterface) => {
  const { chainName, networkName, imageSrc, value, currencySymbol } = props;
  return (
    <div className="card card-side">
      <figure>
        <img className="mask mask-squircle mr-1" src={imageSrc} width={30} alt="token" />
      </figure>
      <div className="card-body">
        <h1 className="card-title">
          {chainName}
        </h1>
        <div>
          {networkName}
        </div>
      </div>
      <div className="flex items-center">
        {`${value} ${currencySymbol}`}
      </div>
    </div>
  );
};

export default TokenTransferCard;