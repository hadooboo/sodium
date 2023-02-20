import { Transaction } from "sodiumjs";
import SSpinner from "./SSpinner";

class SpinMe {
  public static main() {
    Transaction.run(() => {
      const _ = new SSpinner({ initialValue: 0 });
    });
  }
}

Transaction.run(() => SpinMe.main());
