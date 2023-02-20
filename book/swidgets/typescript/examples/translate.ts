import { Transaction } from "sodiumjs";
import SButton from "../swidgets/src/swidgets/SButton";
import SLabel from "../swidgets/src/swidgets/SLabel";
import STextField from "../swidgets/src/swidgets/STextField";

class Translate {
  public static main() {
    const english = new STextField({ initText: "I like FRP" });
    const translate = new SButton({ label: "Translate" });
    const sLatin = translate.sClicked.snapshot(english.text, (u, txt) =>
      txt.trim().replace(/ |$/g, "us ").trim()
    );
    const latin = sLatin.hold("");
    const lblLatin = new SLabel({ text: latin });

    document.body.appendChild(english.getHTMLElement());
    document.body.appendChild(translate.getHTMLElement());
    document.body.appendChild(document.createElement("div"));
    document.body.appendChild(lblLatin.getHTMLElement());
  }
}

Transaction.run(() => Translate.main());
