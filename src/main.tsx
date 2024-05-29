import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SymbolsProvider } from "./context/SymbolsContext";
import { SidebarProvider } from "./context/SidebarContext.tsx";
import { RangeProvider } from "./context/RangeContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SymbolsProvider>
      <SidebarProvider>
        <RangeProvider>
          <App />
          <ToastContainer />
        </RangeProvider>
      </SidebarProvider>
    </SymbolsProvider>
  </React.StrictMode>
);
