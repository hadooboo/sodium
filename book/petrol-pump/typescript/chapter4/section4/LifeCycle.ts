import { Cell, CellLoop, Stream } from "sodiumjs";
import Fuel from "../../pump/fuel";
import UpDown from "../../pump/updown";

export const enum End {
  END,
}

export class LifeCycle {
  public readonly sStart: Stream<Fuel>;
  public readonly fillActive: Cell<Fuel | undefined>;
  public readonly sEnd: Stream<End>;

  static whenLifted(sNozzle: Stream<UpDown>, nozzleFuel: Fuel): Stream<Fuel> {
    return sNozzle.filter((u) => u == UpDown.UP).map((u) => nozzleFuel);
  }

  static whenSetDown(
    sNozzle: Stream<UpDown>,
    nozzleFuel: Fuel,
    fillActive: Cell<Fuel | undefined>
  ): Stream<End> {
    return sNozzle
      .snapshot(fillActive, (u, f) =>
        u == UpDown.DOWN && f == nozzleFuel ? End.END : undefined
      )
      .filter((u) => u !== undefined);
  }

  constructor(
    sNozzle1: Stream<UpDown>,
    sNozzle2: Stream<UpDown>,
    sNozzle3: Stream<UpDown>
  ) {
    const sLiftNozzle = LifeCycle.whenLifted(sNozzle1, Fuel.ONE).orElse(
      LifeCycle.whenLifted(sNozzle2, Fuel.TWO).orElse(
        LifeCycle.whenLifted(sNozzle3, Fuel.THREE)
      )
    );
    const fillActive: CellLoop<Fuel | undefined> = new CellLoop();
    this.fillActive = fillActive;
    this.sStart = sLiftNozzle
      .snapshot(fillActive, (newFuel, fillActive_) =>
        fillActive_ !== undefined ? undefined : newFuel
      )
      .filter((u) => u !== undefined);
    this.sEnd = LifeCycle.whenSetDown(sNozzle1, Fuel.ONE, fillActive).orElse(
      LifeCycle.whenSetDown(sNozzle2, Fuel.TWO, fillActive).orElse(
        LifeCycle.whenSetDown(sNozzle3, Fuel.THREE, fillActive)
      )
    );
    fillActive.loop(
      this.sEnd
        .map((e) => undefined)
        .orElse(this.sStart.map((f) => f))
        .hold(undefined)
    );
  }
}
