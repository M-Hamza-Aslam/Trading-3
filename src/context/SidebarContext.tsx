import { RefObject, createContext, useRef, useState } from "react";

interface SidebarContextState {
  isSidebarOpen: boolean;
  toggleSidebar: (value: boolean) => void;
  triggerRef: null | RefObject<HTMLButtonElement>;
}

export const SidebarContext = createContext<SidebarContextState>({
  isSidebarOpen: false,
  toggleSidebar: () => {},
  triggerRef: null,
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (value: boolean) => {
    setIsSidebarOpen(value);
  };

  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        triggerRef,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
