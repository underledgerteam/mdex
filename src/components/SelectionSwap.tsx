import { Fragment, useContext } from "react";
import InputCurrency from 'src/components/shared/InputCurrency';
import InputSelectNetwork from 'src/components/shared/InputSelectNetwork';
import InputSelectToken from 'src/components/shared/InputSelectToken';
import Card from 'src/components/shared/Card';
import { SelectionSwapInterface } from "src/types/SelectionSwapInterface";
import { toBigNumber } from "src/utils/calculatorCurrency.util";

import { SwapContext } from "src/contexts/swap.context";

const SelectionSwap = ({ title, listOptionNetwork, maxCurrency, onClickSelectToken }: SelectionSwapInterface): JSX.Element => {
  const { swap, selectToken } = useContext(SwapContext);
  return (
    <Fragment>
      {title && <h1 className="text-3xl font-semibold pl-5">{title}</h1>}
      <div className="grid grid-cols-3 gap-4">
        <Card
          className="bg-base-100/80 shadow-xl col-span-3 lg:col-span-1 overflow-visible"
          bodyClassName="grid p-4 lg:p-8"
        >
          <InputSelectNetwork
            listOption={listOptionNetwork}
            selectionUpdate={title}
            selectLabel="Select Network"
          />
        </Card>

        <Card
          className="bg-base-100/80 shadow-xl col-span-3 lg:col-span-2 overflow-visible"
          bodyClassName="grid grid-cols-2 gap-4 lg:gap-4 p-4 lg:p-8"
        >
          <Fragment>
            <InputSelectToken
              selectionUpdate={title}
              className="col-span-2 lg:col-span-1"
              selectLabel="Select a Token"
              onClickSelectToken={onClickSelectToken}
            />
            <InputCurrency
              selectionUpdate={title}
              className="col-span-2 lg:col-span-1"
              delay={1000}
              maxCurrency={maxCurrency}
            />
            {title === "Source" && swap.source.token !== undefined && (
              <p className="w-full text-center absolute top-[50%] left-[50%] font-medium text-sm visible lg:invisible" style={{ transform: 'translate(-50%, -50%)' }}>
                Available: {toBigNumber(selectToken.source.balanceOf || 0).toString()}
              </p>
            )}
          </Fragment>
        </Card>
      </div>
    </Fragment>
  );
};

export default SelectionSwap;