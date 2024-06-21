import { useState, useEffect, useContext } from "react";
import { getCategoryList } from "../../helpers/requests";
import { toast } from "react-toastify";
import { SymbolsContext, category } from "../../context/SymbolsContext";
import { RangeContext } from "../../context/RangeContext";

const CategoryDropdown = ({ closeDropdownHandler }) => {
  const { categories, selectedCategory, setCategories, selectCategory } =
    useContext(SymbolsContext);
  const { removeRange } = useContext(RangeContext);

  const [loading, setLoading] = useState(true);

  const SelectCategoryHandler = async (category: category) => {
    selectCategory(category);
    removeRange();
    closeDropdownHandler();
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
    <div className="sm:w-[300px] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute max-h-[150px] overflow-y-auto mt-2">
      {loading ? (
        <div className="flex items-center justify-center my-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => SelectCategoryHandler(category)}
              className={`${
                selectedCategory === category
                  ? "border-blue-500 bg-blue-100 border-[1.5px]"
                  : "hover:border-blue-500 hover:bg-blue-100 hover:border-[1.5px]  bg-transparent"
              } w-full hover:cursor-pointer rounded-lg  text-sm  py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter`}
            >
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
