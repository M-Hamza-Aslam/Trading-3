import { Dispatch, SetStateAction, createContext, useState } from "react";
import { dummySymbols } from "../assets/DummyData";

export interface category {
  id: number;
  name: string;
}
export interface symbolProps {
  name: string;
}
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

  const selectCategory = (category: category) => {
    setSymbols([]);
    setSelectedSymbol(null);
    setSelectedCategory(category);
    localStorage.setItem("market", "crypto");
    //get_category_symbols
    setTimeout(() => {
      setSymbols(dummySymbols);
    }, 1000);
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
