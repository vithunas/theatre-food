import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@shared/tokens.css";
import "./index.css";
import App from "./App.jsx";
import { seedMenuIfEmpty } from "@shared/data.js";

seedMenuIfEmpty();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
