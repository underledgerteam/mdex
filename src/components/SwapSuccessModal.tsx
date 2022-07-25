
import { SwapSuccessInterface } from "src/types/SwapSuccessInterface";

const SwapSuccessModal = ({ link, onCloseModal }: SwapSuccessInterface) => {

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto min-w-[50%]">

          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <label className="btn btn-sm btn-circle absolute right-2 top-2 bg-red-500 hover:bg-red-600 border-none" onClick={onCloseModal}>✕</label>
              <h3 className="text-3xl font-semibold text-center">
                You will receive
              </h3>
            </div>

            <div className="relative p-6 flex-auto">
              <div className="flex mx-auto my-5 justify-center text-9xl mt-5 mb-5">
                ⬆️
              </div>
              <p className="my-6 mx-6 mt-[50px;] text-xl text-center">
                Transaction Submitted
              </p>
              <p className="my-6 mx-6 mt-5 text-lg text-success text-center cursor-pointer">
                <a href={link}>
                  View your transaction
                </a>
              </p>
            </div>

            <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
              <label className="btn btn-close" onClick={onCloseModal}>close</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SwapSuccessModal;