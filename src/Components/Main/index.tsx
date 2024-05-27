import { useContext } from "react";
import SideBar from "./SideBar";
import { SymbolsContext } from "../../context/SymbolsContext";
import ChartSection from "./ChartSection";
// import SideBar from "../NavSidebar/SideBar";

const Main = () => {
  const { selectedCategory, symbols } = useContext(SymbolsContext);

  const status =
    selectedCategory && symbols.length ? 2 : selectedCategory ? 1 : 0;

  return (
    <section className="w-full p-4">
      {status === 0 && (
        <div className="w-full">
          <h3 className="text-gray-400 font-semibold text-sm sm:text-lg text-center">
            Please Select a Category
          </h3>
        </div>
      )}
      {status === 1 && (
        <div className="w-full h-[calc(100vh-123.6px)] flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
        </div>
      )}
      {status === 2 && (
        // <div className="flex">
        //   <div className="w-[12%] max-w-[280px]">
        //     <Sidebar />
        //   </div>
        //   <div className="flex-grow overflow-auto">
        //     <ChartSection />
        //   </div>
        // </div>
        <div className="">
          <SideBar />
          <main className="sm:ms-[250px] mt-[60px] min-h-[87vh]">
            <div className="mx-auto max-w-screen-2xl">
              <ChartSection />
            </div>
          </main>
        </div>
      )}
    </section>
  );
};
export default Main;
