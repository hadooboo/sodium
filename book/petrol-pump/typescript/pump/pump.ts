import Inputs from "./inputs";
import Outputs from "./outputs";

interface Pump {
  create(inputs: Inputs): Outputs;
}

export default Pump;
