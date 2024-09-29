import "katex/dist/katex.min.css";

import { BlockMath } from "react-katex";
import { useFormulaStore } from "@/store/formula";

export const FormulaDisplay = () => {
  const { formula } = useFormulaStore();

  if (!formula) {
    return (
      <div className="katex">
        <span
          style={{
            font: "normal 1em KaTeX_Main",
          }}
        >
          e.g. 2 x + y
        </span>
      </div>
    );
  }

  return <BlockMath math={formula}></BlockMath>;
};
