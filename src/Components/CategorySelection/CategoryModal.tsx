import { FC, useContext, useEffect, useState } from "react";
import { SymbolsContext, category } from "../../context/SymbolsContext";
import { getCategoryList } from "../../helpers/requests";
import { toast } from "react-toastify";

interface Props {
  closeModalHandler: () => void;
}

const CategoryModal: FC<Props> = ({ closeModalHandler }) => {
  const { categories, selectedCategory, setCategories, selectCategory } =
    useContext(SymbolsContext);
  const [loading, setLoading] = useState(true);

  const SelectCategoryHandler = async (category: category) => {
    selectCategory(category);
    closeModalHandler();
  };

  useEffect(() => {
    if (categories.length > 0) {
      setLoading(false);
      return;
    }
    const FetchCategoryList = async () => {
      try {
        const response = await getCategoryList();
        setCategories(response.data);
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong. Please try again");
      }
      setLoading(false);
    };

    FetchCategoryList();
  }, []);
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className=" z-9999 flex justify-center items-center overflow-hidden fixed top-0 right-0 left-0 w-full md:inset-0 h-screen"
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
              Select Category
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
          <div className="p-4 flex flex-col gap-8 text-center overflow-auto h-[500px]">
            {loading ? (
              <div className="flex h-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => SelectCategoryHandler(category)}
                    className={`${
                      selectedCategory === category
                        ? "border-blue-500 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-100  bg-transparent"
                    } w-full hover:cursor-pointer rounded-lg border-[1.5px] text-sm  py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter`}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategoryModal;
