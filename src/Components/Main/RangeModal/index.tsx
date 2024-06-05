import { FC, useContext, useState } from "react";
import { RangeContext } from "../../../context/RangeContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { getOccurences } from "../../../helpers/requests";

interface Props {
  closeModalHandler: () => void;
  symbol: string;
}

const ShortValidationSchema = Yup.object({
  toleranceInput: Yup.number().required("Required"),
});

const RangeModal: FC<Props> = ({ closeModalHandler, symbol }) => {
  const { ranges, updateRangeToleranceInput } = useContext(RangeContext);
  const [loading, setLoading] = useState(false);
  const range = ranges.filter((r) => r.symbol === symbol)[0];
  const initialRangeValues = {
    symbol: range.symbol,
    id: range.rangeId,
    startingPrice:
      range.rangePoints[0].price <= range.rangePoints[1].price
        ? range.rangePoints[0].price
        : range.rangePoints[1].price,
    endingPrice:
      range.rangePoints[0].price <= range.rangePoints[1].price
        ? range.rangePoints[1].price
        : range.rangePoints[0].price,
    startingTime:
      range.rangePoints[0].time <= range.rangePoints[1].time
        ? range.rangePoints[0].time
        : range.rangePoints[1].time,
    endingTime:
      range.rangePoints[0].time <= range.rangePoints[1].time
        ? range.rangePoints[1].time
        : range.rangePoints[0].time,
    toleranceInput: range.toleranceInput,
  };

  const formik = useFormik({
    initialValues: initialRangeValues,
    validationSchema: ShortValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        //calling api
        setTimeout(() => {}, 1000);
        console.log(values);
        updateRangeToleranceInput(
          values.toleranceInput as number,
          values.id as string
        );
        const body = {
          symbol: values.symbol,
          start_range: new Date(values.startingTime).toISOString(),
          end_range: new Date(values.endingTime).toISOString(),
          tolerance: values.toleranceInput as number,
        };
        const response = await getOccurences(body);
        console.log(response.data);
        toast.success("Range proceed successfully");
        closeModalHandler();
        resetForm();
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong. Please try again");
      }
      setLoading(false);
    },
  });
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className=" z-[9999] flex justify-center items-center overflow-hidden fixed top-0 right-0 left-0 w-full md:inset-0 h-screen"
    >
      <div
        onClick={closeModalHandler}
        className="z-9998 absolute bg-black bg-opacity-50 w-full h-screen"
      />

      <div className="w-[95%] lg:w-[60%] max-h-[600px] max-w-[650px] mx-auto  bg-white rounded-lg shadow z-[9999]">
        <div>
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">
              Detailed Analysis
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="default-modal"
              onClick={closeModalHandler}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 flex flex-col gap-8 overflow-auto h-[500px]">
            <form onSubmit={formik.handleSubmit} className="w-full">
              <div className="mb-4">
                <label className="text-sm block text-black mb-3">Symbol</label>
                <input
                  {...formik.getFieldProps("symbol")}
                  placeholder="Enter Symbol Name"
                  required
                  disabled
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100   "
                />
                <span className="text-red-500 text-xs  ms-2 mt-4">
                  {formik.touched.symbol && formik.errors.symbol}
                </span>
              </div>
              <div className="mb-4">
                <label className="mb-3 text-sm block text-black ">
                  Starting Price
                </label>
                <input
                  {...formik.getFieldProps("startingPrice")}
                  placeholder="Enter Starting Price"
                  disabled
                  required
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100"
                />
                <span className="text-red-500 text-xs  ms-2 mt-4">
                  {formik.touched.startingPrice && formik.errors.startingPrice}
                </span>
              </div>
              <div className="mb-4">
                <label className="mb-3 text-sm block text-black ">
                  Ending Price
                </label>
                <input
                  {...formik.getFieldProps("endingPrice")}
                  placeholder="Enter Ending Price"
                  disabled
                  required
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100   "
                />
                <span className="text-red-500 text-xs  ms-2 mt-4">
                  {formik.touched.endingPrice && formik.errors.endingPrice}
                </span>
              </div>

              <div className="mb-4">
                <label className="mb-3 text-sm block text-black ">
                  Starting Time
                </label>
                <input
                  {...formik.getFieldProps("startingTime")}
                  placeholder="Enter Starting Time"
                  required
                  disabled
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100   "
                />
                <span className="text-red-500 text-xs  ms-2 mt-4">
                  {formik.touched.startingTime && formik.errors.startingTime}
                </span>
              </div>
              <div className="mb-4">
                <label className="mb-3 text-sm block text-black ">
                  Ending Time
                </label>
                <input
                  {...formik.getFieldProps("endingTime")}
                  placeholder="Enter Ending Time"
                  required
                  disabled
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100   "
                />
                <span className="text-red-500 text-xs  ms-2 mt-4">
                  {formik.touched.endingTime && formik.errors.endingTime}
                </span>
              </div>
              <div className="mb-4">
                <label className="mb-3 text-sm block text-black ">
                  Tolerance Number
                </label>
                <input
                  {...formik.getFieldProps("toleranceInput")}
                  type="number"
                  placeholder="Enter Tolerance Number"
                  required
                  className="w-full rounded-lg border-[1.5px] text-sm border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100   "
                />
                <span className="text-red-500 text-xs  ms-2 mt-4">
                  {formik.touched.toleranceInput &&
                    formik.errors.toleranceInput}
                </span>
              </div>

              <div className="mb-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="inline-flex items-center font-semibold text-sm sm:text-base w-full justify-center cursor-pointer rounded border border-blue-500 bg-blue-500 p-3 sm:p-4 text-white transition hover:bg-opacity-90"
                >
                  {loading && (
                    <span>
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  )}
                  Perform Analysis
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RangeModal;
