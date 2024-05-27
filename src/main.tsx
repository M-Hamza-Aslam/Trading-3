import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SymbolsProvider } from "./context/SymbolsContext";
import { SidebarProvider } from "./context/SidebarContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SymbolsProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </SymbolsProvider>
  </React.StrictMode>
);
