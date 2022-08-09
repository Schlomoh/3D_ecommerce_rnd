import { CssVarsProvider } from "@mui/joy";
import { PresentationScene } from "./components";

// routing
const App = () => {
  return (
    <CssVarsProvider>
      <div style={{ height: "100vh", width: "100vw" }}>
        <PresentationScene />
      </div>
    </CssVarsProvider>
  );
};

export default App;
