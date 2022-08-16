import { FC } from "react";
import { TransferRoute } from "src/types/TransferRateCollapse";

const TransferRateRoute: FC<{ dataSrc: Array<TransferRoute>; }> = ({ dataSrc }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        {dataSrc?.map(({ key, name, fee }) => (
          <div key={key} className="relative w-full h-[80px] md:h-[120px]
            before:content-[''] 
            before:absolute 
            before:left-[50%] 
            before:top-[calc(-25%)] 
            before:w-1 
            before:h-[calc(50%)]
            before:bg-gradient-to-r from-purple-700 to-pink-700
            last-of-type:after:content-[''] 
            last-of-type:after:absolute 
            last-of-type:after:left-[50%] 
            last-of-type:after:top-[75%] 
            last-of-type:after:w-1 
            last-of-type:after:h-[50%] 
            last-of-type:after:bg-gradient-to-r from-purple-700 to-pink-700 
            last-of-type:after:rounded-full 
            last-of-type:after:z-50
          ">
            <div className="flex flex-col h-full justify-center items-center text-sm md:text-base">
              <div>
                {name}
              </div>
              <div>
                {fee}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransferRateRoute;