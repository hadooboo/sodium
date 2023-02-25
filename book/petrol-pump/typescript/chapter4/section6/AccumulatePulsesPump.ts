import { Cell, CellLoop, Stream, Unit } from "sodiumjs";
import Delivery from "../../pump/delivery";
import Formatters from "../../pump/formatters";
import Fuel from "../../pump/fuel";
import Inputs from "../../pump/inputs";
import Outputs from "../../pump/outputs";
import Pump from "../../pump/pump";
import { LifeCycle } from "../section4/LifeCycle";

class AccumulatePulsesPump implements Pump {
  public create(inputs: Inputs): Outputs {
    const lc = new LifeCycle(inputs.sNozzle1, inputs.sNozzle2, inputs.sNozzle3);
    const litersDelivered = AccumulatePulsesPump.accumulate(
      lc.sStart.map((u) => Unit.UNIT),
      inputs.sFuelPulses,
      inputs.calibration
    );
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
        litersDelivered.map((q) => Formatters.formatSaleQuantity(q))
      );
  }

  public static accumulate(
    sClearAccumulator: Stream<Unit>,
    sPulses: Stream<number>,
    calibration: Cell<number>
  ): Cell<number> {
    const total = new CellLoop<number>();
    total.loop(
      sClearAccumulator
        .map((u) => 0)
        .orElse(sPulses.snapshot(total, (pulses_, total_) => pulses_ + total_))
        .hold(0)
    );
    return total.lift(
      calibration,
      (total_, calibration_) => total_ * calibration_
    );
  }

  public toString(): string {
    return "AccumulatePulsesPump";
  }
}

export default AccumulatePulsesPump;
