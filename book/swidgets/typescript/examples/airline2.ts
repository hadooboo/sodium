import { Cell, Transaction } from "sodiumjs";
import SButton from "../swidgets/src/swidgets/SButton";
import SDateField from "../swidgets/src/swidgets/SDateField";

class Rule {
  public f: (a: Date, b: Date) => boolean;

  constructor(f: (a: Date, b: Date) => boolean) {
    this.f = f;
  }

  reify(dep: Cell<Date>, ret: Cell<Date>): Cell<boolean> {
    return dep.lift(ret, this.f);
  }

  and(other: Rule): Rule {
    return new Rule((d, r) => this.f(d, r) && other.f(d, r));
  }
}

class Airline2 {
  private static unlucky(dt: Date): boolean {
    const day = dt.getDate();
    return day == 4 || day == 14 || day == 24;
  }

  public static main() {
    const dep = new SDateField({});
    const ret = new SDateField({});
    const r1 = new Rule((d, r) => d <= r);
    const r2 = new Rule((d, r) => !this.unlucky(d) && !this.unlucky(r));
    const r = r1.and(r2);
    const valid = r.reify(dep.date, ret.date);
    const ok = new SButton({ label: "OK", enabled: valid });

    document.body.appendChild(dep.getHTMLElement());
    document.body.appendChild(document.createElement("div"));
    document.body.appendChild(ret.getHTMLElement());
    document.body.appendChild(document.createElement("div"));
    document.body.appendChild(ok.getHTMLElement());
  }
}

Transaction.run(() => Airline2.main());
