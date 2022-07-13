import { FC } from "react";

const TransferRateRoute: FC<{ dataSrc: Array<string>; }> = ({ dataSrc }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        {dataSrc?.map(value => (
          <div key={value} className="relative w-full h-16 md:h-[100px]
            before:content-[''] 
            before:absolute 
            before:left-[50%] 
            before:top-[calc(-50%+1.5rem)] 
            before:w-1 
            before:h-[calc(100%-2.5rem)] 
            before:bg-gradient-to-r from-purple-700 to-pink-700
            last-of-type:after:content-[''] 
            last-of-type:after:absolute 
            last-of-type:after:left-[50%] 
            last-of-type:after:top-[calc(50%+1.5rem)] 
            last-of-type:after:w-1 
            last-of-type:after:h-[calc(100%-2.5rem)] 
            last-of-type:after:bg-gradient-to-r from-purple-700 to-pink-700 
            last-of-type:after:rounded-full 
            last-of-type:after:z-50
          ">
            <div className="flex h-full justify-center items-center">
              {value}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransferRateRoute;