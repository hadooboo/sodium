import { Cell, Operational, Transaction } from "sodiumjs";

class SLabel {
  private div: HTMLDivElement;

  constructor({
    text
  } : {
    text: Cell<string>
  }) {
    this.div = document.createElement('div');
    this.div.innerText = text.sample();

    Transaction.currentTransaction.post(-1, () => {
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
