import { useContext, useEffect, useRef } from "react";
import { SymbolsContext, symbolProps } from "../../../context/SymbolsContext";
import { SidebarContext } from "../../../context/SidebarContext";
import { RangeContext } from "../../../context/RangeContext";

const SideBar = () => {
  const { symbols, selectedSymbol, setSelectedSymbol } =
    useContext(SymbolsContext);
  const { removeRange } = useContext(RangeContext);
  const handleSymbolSelection = (symbol: symbolProps) => {
    if (symbol === selectedSymbol) return;
    setSelectedSymbol(symbol);
    //removing range is exist
    removeRange();
  };

  const sidebar = useRef<HTMLElement>(null);

  const storedSidebarExpanded = "true";
  const sidebarExpanded =
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true";
  // const [sidebarExpanded, setSidebarExpanded] = useState(
  //   storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  // );
  const { isSidebarOpen, toggleSidebar, triggerRef } =
    useContext(SidebarContext);
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !triggerRef?.current) return;
      if (
        !isSidebarOpen ||
        sidebar.current.contains(target as Node) ||
        triggerRef.current.contains(target as Node)
      )
        return;
      toggleSidebar(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!isSidebarOpen || key !== "Escape") return;
      toggleSidebar(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-[10] w-32 h-screen pt-20 transition-transform  bg-white border-r border-gray-200 sm:translate-x-0 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      aria-label="Sidebar"
      ref={sidebar}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white ">
        <ul className="space-y-2 font-medium">
          {symbols.map((symbol, index) => {
            return (
              <li className="" key={index}>
                <button
                  type="button"
                  onClick={() => handleSymbolSelection(symbol)}
                  className={`${
                    selectedSymbol === symbol ? "text-blue-500" : ""
                  } p-2 hover:text-blue-500 w-fit`}
                  key={index}
                >
                  {symbol}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
export default SideBar;
