import Card from 'src/components/shared/Card';
import { TransferRateCollapseInterface } from "src/types/TransferRateCollapse";

// todo for source and destination
const TokenInfo = () => {
  return (
    <div>
      <img />
      <div>token name</div>
      <div>chain name</div>
    </div>
  );
};
// todo dynamic render transfer route


const TransferRateCollapse = (props: TransferRateCollapseInterface): JSX.Element => {
  return (
    <>
      <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-medium">
          {props.title}
        </div>
        <div className="collapse-content">
          <Card>
            <div>
              <p>source</p>
              <p>tabindex="0" attribute is necessary to make the div focusable</p>
              <p>destination</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TransferRateCollapse;