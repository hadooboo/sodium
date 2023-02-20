import { Cell, Operational, Transaction } from "sodiumjs";

class SLabel {
  private readonly span: HTMLSpanElement;

  constructor({ text }: { text: Cell<string> }) {
    this.span = document.createElement("span");

    Transaction.currentTransaction.post(0, () => {
      this.span.innerText = text.sample();
    });
    Operational.updates(text).listen((t) => {
      this.span.innerText = t;
    });
  }

  getHTMLElement(): HTMLElement {
    return this.span;
  }
}

export default SLabel;
