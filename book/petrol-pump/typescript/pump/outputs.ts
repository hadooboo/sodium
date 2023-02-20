import { Cell, Stream, Unit } from "sodiumjs";
import Delivery from "./delivery";
import Sale from "./sale";

class Outputs {
  public readonly delivery: Cell<Delivery>;
  public readonly presetLCD: Cell<string>;
  public readonly saleCostLCD: Cell<string>;
  public readonly saleQuantityLCD: Cell<string>;
  public readonly priceLCD1: Cell<string>;
  public readonly priceLCD2: Cell<string>;
  public readonly priceLCD3: Cell<string>;
  public readonly sBeep: Stream<Unit>;
  public readonly sSaleComplete: Stream<Sale>;

  constructor();
  constructor(
    delivery: Cell<Delivery>,
    presetLCD: Cell<string>,
    saleCostLCD: Cell<string>,
    saleQuantityLCD: Cell<string>,
    priceLCD1: Cell<string>,
    priceLCD2: Cell<string>,
    priceLCD3: Cell<string>,
    sBeep: Stream<Unit>,
    sSaleComplete: Stream<Sale>
  );
  constructor(
    delivery: Cell<Delivery> = new Cell<Delivery>(Delivery.OFF),
    presetLCD: Cell<string> = new Cell<string>(""),
    saleCostLCD: Cell<string> = new Cell<string>(""),
    saleQuantityLCD: Cell<string> = new Cell<string>(""),
    priceLCD1: Cell<string> = new Cell<string>(""),
    priceLCD2: Cell<string> = new Cell<string>(""),
    priceLCD3: Cell<string> = new Cell<string>(""),
    sBeep: Stream<Unit> = new Stream<Unit>(),
    sSaleComplete: Stream<Sale> = new Stream<Sale>()
  ) {
    this.delivery = delivery;
    this.presetLCD = presetLCD;
    this.saleCostLCD = saleCostLCD;
    this.saleQuantityLCD = saleQuantityLCD;
    this.priceLCD1 = priceLCD1;
    this.priceLCD2 = priceLCD2;
    this.priceLCD3 = priceLCD3;
    this.sBeep = sBeep;
    this.sSaleComplete = sSaleComplete;
  }

  setDelivery(delivery: Cell<Delivery>): Outputs {
    return new Outputs(
      delivery,
      this.presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setPresetLCD(presetLCD: Cell<string>): Outputs {
    return new Outputs(
      this.delivery,
      presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setSaleCostLCD(saleCostLCD: Cell<string>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setSaleQuantityLCD(saleQuantityLCD: Cell<string>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      this.saleCostLCD,
      saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setPriceLCD1(priceLCD1: Cell<string>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setPriceLCD2(priceLCD2: Cell<string>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      priceLCD2,
      this.priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setPriceLCD3(priceLCD3: Cell<string>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      priceLCD3,
      this.sBeep,
      this.sSaleComplete
    );
  }

  setBeep(beep: Stream<Unit>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      beep,
      this.sSaleComplete
    );
  }

  setSaleComplete(sSaleComplete: Stream<Sale>): Outputs {
    return new Outputs(
      this.delivery,
      this.presetLCD,
      this.saleCostLCD,
      this.saleQuantityLCD,
      this.priceLCD1,
      this.priceLCD2,
      this.priceLCD3,
      this.sBeep,
      sSaleComplete
    );
  }
}

export default Outputs;
