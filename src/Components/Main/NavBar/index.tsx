import { useContext } from "react";
import CategorySelection from "../../CategorySelection";
import { SidebarContext } from "../../../context/SidebarContext";

const NavBar = () => {
  const { isSidebarOpen, toggleSidebar, triggerRef } =
    useContext(SidebarContext);
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={() => toggleSidebar(!isSidebarOpen)}
              ref={triggerRef}
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <div className="flex ms-2 md:me-24 items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-5 sm:h-6 me-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-base font-semibold sm:text-xl whitespace-nowrap ">
                Trading
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <CategorySelection />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
