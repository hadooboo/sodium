import { Transaction } from "sodiumjs";
import SButton from "../swidgets/src/swidgets/SButton";
import STextField from "../swidgets/src/swidgets/STextField";

class ClearField {
  public static main() {
    const clear = new SButton({ label: "clear" });
    const sClearIt = clear.sClicked.map((u) => "");
    const text = new STextField({ sText: sClearIt, initText: "Hello" });

    document.body.appendChild(text.getHTMLElement());
    document.body.appendChild(clear.getHTMLElement());
  }
}

Transaction.run(() => ClearField.main());
