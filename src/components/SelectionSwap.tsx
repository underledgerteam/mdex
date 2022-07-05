import { Fragment } from "react";
import InputCurrency from 'src/components/shared/InputCurrency';
import InputSelect from 'src/components/shared/InputSelect';
import Card from 'src/components/shared/Card';
import { SelectionSwapInterface } from "src/types/SelectionSwapInterface";

const SelectionSwap = ({title, listOptionNetwork, maxCurrency}: SelectionSwapInterface): JSX.Element => {
  
  return (
    <Fragment>
      { title && <h1 className="text-3xl font-semibold pl-5">{title}</h1> }
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="bg-base-100 shadow-xl col-span-3 lg:col-span-1 overflow-visible"
          bodyClassName="grid"
        >
          <InputSelect 
            listOption={listOptionNetwork}
            selectionUpdate={title}
            keyUpdate="chain"
            selectLabel="Select Network"
          />
        </Card>

        <Card
          className="bg-base-100 shadow-xl col-span-3 lg:col-span-2 overflow-visible"
          bodyClassName="grid grid-cols-2 gap-4"
        >
          <Fragment>
            <InputSelect 
              listOption={[{
                value: "1",
                label: "TEST Token 1"
              },{
                value: "2",
                label: "TEST Token 2"
              },{
                value: "3",
                label: "TEST Token 3"
              }]}
              selectionUpdate={title}
              keyUpdate="token"
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