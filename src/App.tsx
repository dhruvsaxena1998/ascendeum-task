import { Calculator } from "@/features/calculator";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/theme-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <div className="p-4">
        <ModeToggle /> <div className="my-4"></div>
        <Calculator />
      </div>
    </ThemeProvider>
  );
}

export default App;
