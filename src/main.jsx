import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/animations.css";

/** Chrome/Safari cache favicons for months — force fresh file in dev after you replace public/favicon.svg */
function refreshFaviconInDev() {
  if (!import.meta.env.DEV) return;
  const href = `/favicon.svg?v=${Date.now()}`;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }
  link.href = href;
}
refreshFaviconInDev();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
