import { CellLoop, Transaction } from "sodiumjs";
import SButton from "../swidgets/src/swidgets/SButton";
import SLabel from "../swidgets/src/swidgets/SLabel";

class Nonegative {
  public static main() {
    const value = new CellLoop<number>();
    const lblValue = new SLabel({ text: value.map((i) => i.toString()) });
    const plus = new SButton({ label: "+" });
    const minus = new SButton({ label: "-" });
    const sPlusDelta = plus.sClicked.map((u) => 1);
    const sMinusDelta = minus.sClicked.map((u) => -1);
    const sDelta = sPlusDelta.orElse(sMinusDelta);
    const sUpdate = sDelta
      .snapshot(value, (delta, value_) => delta + value_)
      .filter((n) => n >= 0);
    value.loop(sUpdate.hold(0));

    document.body.appendChild(lblValue.getHTMLElement());
    document.body.appendChild(plus.getHTMLElement());
    document.body.appendChild(minus.getHTMLElement());
  }
}

Transaction.run(() => Nonegative.main());
