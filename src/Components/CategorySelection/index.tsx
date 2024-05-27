import { useState } from "react";
import CategoryModal from "./CategoryModal";

const CategorySelection = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="sm:w-[300px] text-gray-600 bg-gray-100 rounded-md border border-solid border-gray-300 flex gap-4 items-center py-2 px-4 hover:bg-gray-200"
      >
        <svg
          className="w-5 h-5 text-gray-600 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
        <h3 className="hidden sm:block text-gray-600">Select Category</h3>
      </button>
      {openModal && (
        <CategoryModal closeModalHandler={() => setOpenModal(false)} />
      )}
    </>
  );
};
export default CategorySelection;
