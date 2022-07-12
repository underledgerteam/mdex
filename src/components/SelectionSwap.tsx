import { Fragment } from "react";
import InputCurrency from 'src/components/shared/InputCurrency';
import InputSelectNetwork from 'src/components/shared/InputSelectNetwork';
import InputSelectToken from 'src/components/shared/InputSelectToken';
import Card from 'src/components/shared/Card';
import { SelectionSwapInterface } from "src/types/SelectionSwapInterface";

const SelectionSwap = ({title, listOptionNetwork, maxCurrency}: SelectionSwapInterface): JSX.Element => {
  
  return (
    <Fragment>
      { title && <h1 className="text-3xl font-semibold pl-5">{title}</h1> }
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="bg-base-100/80 shadow-xl col-span-3 lg:col-span-1 overflow-visible"
          bodyClassName="grid"
        >
          <InputSelectNetwork 
            listOption={listOptionNetwork}
            selectionUpdate={title}
            selectLabel="Select Network"
          />
        </Card>

        <Card
          className="bg-base-100/80 shadow-xl col-span-3 lg:col-span-2 overflow-visible"
          bodyClassName="grid grid-cols-2 gap-4"
        >
          <Fragment>
            <InputSelectToken 
              selectionUpdate={title}
              className="col-span-2 lg:col-span-1"
              selectLabel="Select a Token"
            />
            <InputCurrency 
              selectionUpdate={title}
              className="col-span-2 lg:col-span-1"
              delay={1000}
              maxCurrency={maxCurrency}
            />
          </Fragment>
        </Card>
      </div>
    </Fragment>
  );
};

export default SelectionSwap;