import { Cell, Operational, Transaction } from "sodiumjs";

class SLabel {
  private div: HTMLSpanElement;

  constructor({
    text
  } : {
    text: Cell<string>
  }) {
    this.div = document.createElement('span');

    Transaction.currentTransaction.post(0, () => {
      this.div.innerText = text.sample();
    });
    Operational.updates(text).listen(t => {
      this.div.innerText = t;
    });
  }

  render() {
    document.body.appendChild(this.div);
  }
}

export default SLabel;
