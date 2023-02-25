import Delivery from "../../pump/delivery";
import Fuel from "../../pump/fuel";
import Inputs from "../../pump/inputs";
import Outputs from "../../pump/outputs";
import Pump from "../../pump/pump";
import { LifeCycle } from "./LifeCycle";

class LifeCyclePump implements Pump {
  public create(inputs: Inputs): Outputs {
    const lc = new LifeCycle(inputs.sNozzle1, inputs.sNozzle2, inputs.sNozzle3);

    return new Outputs()
      .setDelivery(
        lc.fillActive.map((of) =>
          of == Fuel.ONE
            ? Delivery.FAST1
            : of == Fuel.TWO
            ? Delivery.FAST2
            : of == Fuel.THREE
            ? Delivery.FAST3
            : Delivery.OFF
        )
      )
      .setSaleQuantityLCD(
        lc.fillActive.map((of) =>
          of == Fuel.ONE
            ? "1"
            : of == Fuel.TWO
            ? "2"
            : of == Fuel.THREE
            ? "3"
            : ""
        )
      );
  }

  public toString(): string {
    return "LifeCyclePump";
  }
}

export default LifeCyclePump;
