import { Cell, Stream, Unit } from "sodiumjs";
import Fuel from "../../pump/fuel";
import AccumulatePulsesPump from "../section6/AccumulatePulsesPump";

class Fill {
  public readonly price: Cell<number>;
  public readonly dollarsDelivered: Cell<number>;
  public readonly litersDelivered: Cell<number>;

  constructor(
    sClearAccumulator: Stream<Unit>,
    sFuelPulses: Stream<number>,
    calibration: Cell<number>,
    price1: Cell<number>,
    price2: Cell<number>,
    price3: Cell<number>,
    sStart: Stream<Fuel>
  ) {
    this.price = Fill.capturePrice(sStart, price1, price2, price3);
    this.litersDelivered = AccumulatePulsesPump.accumulate(
      sClearAccumulator,
      sFuelPulses,
      calibration
    );
    this.dollarsDelivered = this.litersDelivered.lift(
      this.price,
      (liters_, price_) => liters_ * price_
    );
  }

  public static capturePrice(
    sStart: Stream<Fuel>,
    price1: Cell<number>,
    price2: Cell<number>,
    price3: Cell<number>
  ): Cell<number> {
    const sPrice1 = sStart
      .snapshot(price1, (f, p) => (f == Fuel.ONE ? p : undefined))
      .filter((u) => u !== undefined);
    const sPrice2 = sStart
      .snapshot(price2, (f, p) => (f == Fuel.TWO ? p : undefined))
      .filter((u) => u !== undefined);
    const sPrice3 = sStart
      .snapshot(price3, (f, p) => (f == Fuel.THREE ? p : undefined))
      .filter((u) => u !== undefined);
    return sPrice1.orElse(sPrice2.orElse(sPrice3)).hold(0.0);
  }
}

export default Fill;
