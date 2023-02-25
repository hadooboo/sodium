import { Cell, Unit } from "sodiumjs";
import Delivery from "../../pump/delivery";
import Formatters from "../../pump/formatters";
import Fuel from "../../pump/fuel";
import Inputs from "../../pump/inputs";
import Outputs from "../../pump/outputs";
import Pump from "../../pump/pump";
import { LifeCycle } from "../section4/LifeCycle";
import Fill from "./Fill";

class ShowDollarsPump implements Pump {
  public create(inputs: Inputs): Outputs {
    const lc = new LifeCycle(inputs.sNozzle1, inputs.sNozzle2, inputs.sNozzle3);
    const fi = new Fill(
      lc.sStart.map(() => Unit.UNIT),
      inputs.sFuelPulses,
      inputs.calibration,
      inputs.price1,
      inputs.price2,
      inputs.price3,
      lc.sStart
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
      .setSaleCostLCD(
        fi.dollarsDelivered.map((q) => Formatters.formatSaleCost(q))
      )
      .setSaleQuantityLCD(
        fi.litersDelivered.map((q) => Formatters.formatSaleQuantity(q))
      )
      .setPriceLCD1(
        ShowDollarsPump.priceLCD(lc.fillActive, fi.price, Fuel.ONE, inputs)
      )
      .setPriceLCD2(
        ShowDollarsPump.priceLCD(lc.fillActive, fi.price, Fuel.TWO, inputs)
      )
      .setPriceLCD3(
        ShowDollarsPump.priceLCD(lc.fillActive, fi.price, Fuel.THREE, inputs)
      );
  }

  public static priceLCD(
    fillActive: Cell<Fuel | undefined>,
    fillPrice: Cell<number>,
    fuel: Fuel,
    inputs: Inputs
  ): Cell<string> {
    let idlePrice: Cell<number> | null = null;
    switch (fuel) {
      case Fuel.ONE:
        idlePrice = inputs.price1;
        break;
      case Fuel.TWO:
        idlePrice = inputs.price2;
        break;
      case Fuel.THREE:
        idlePrice = inputs.price3;
        break;
    }
    return fillActive.lift3(
      fillPrice,
      idlePrice,
      (oFuelSelected, fillPrice_, idlePrice_) =>
        oFuelSelected !== undefined
          ? oFuelSelected == fuel
            ? Formatters.formatPrice(fillPrice_)
            : ""
          : Formatters.formatPrice(idlePrice_)
    );
  }

  public toString(): string {
    return "ShowDollarsPump";
  }
}

export default ShowDollarsPump;
