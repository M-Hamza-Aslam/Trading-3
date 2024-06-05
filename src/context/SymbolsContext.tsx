import { Dispatch, SetStateAction, createContext, useState } from "react";
import { getSymbolList } from "../helpers/requests";
import { toast } from "react-toastify";

export type category = string;
export type symbolProps = string;
interface SymbolsContextState {
  categories: category[];
  selectedCategory: category | null;
  symbols: symbolProps[];
  selectedSymbol: symbolProps | null;
  setCategories: Dispatch<SetStateAction<category[]>>;
  selectCategory: (category: category) => void;
  setSelectedSymbol: Dispatch<SetStateAction<symbolProps | null>>;
}

export const SymbolsContext = createContext<SymbolsContextState>({
  categories: [],
  selectedCategory: null,
  symbols: [],
  selectedSymbol: null,
  setCategories: () => {},
  selectCategory: () => {},
  setSelectedSymbol: () => {},
});

export const SymbolsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<category | null>(
    null
  );
  const [symbols, setSymbols] = useState<symbolProps[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<symbolProps | null>(
    null
  );

  const selectCategory = async (category: category) => {
    setSymbols([]);
    setSelectedSymbol(null);
    setSelectedCategory(category);
    localStorage.setItem("market", "crypto");
    try {
      const response = await getSymbolList(category);
      setSymbols(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again");
    }
  };

  return (
    <SymbolsContext.Provider
      value={{
        categories,
        selectedCategory,
        symbols,
        selectedSymbol,
        setCategories,
        selectCategory,
        setSelectedSymbol,
      }}
    >
      {children}
    </SymbolsContext.Provider>
  );
};
