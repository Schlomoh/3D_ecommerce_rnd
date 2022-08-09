import { css, Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const globalStyles = css`
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;
const element = document.getElementById("root") as HTMLElement;
const root = createRoot(element);
const app = (
  <StrictMode>
    <Global styles={globalStyles} />
    <App />
  </StrictMode>
);
root.render(app);
