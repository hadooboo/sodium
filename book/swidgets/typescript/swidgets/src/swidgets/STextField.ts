import { Cell, Operational, Stream, StreamSink, Transaction } from "sodiumjs";

class STextField {
  private textField: HTMLInputElement;
  public text: Cell<string>;
  public sUserChanges: Stream<string>;

  constructor({
    initText, width, sText = new Stream<string>(), enabled = new Cell<boolean>(true)
  } : {
    initText: string,
    width?: number,
    sText?: Stream<string>,
    enabled?: Cell<boolean>
  }) {
    const sUserChangesSnk = new StreamSink<string>();
    this.sUserChanges = sUserChangesSnk;

    this.textField = document.createElement('input');
    this.textField.value = initText;
    this.textField.width = width;
    this.textField.addEventListener('input', (event: InputEvent) => {
      if (event.target instanceof HTMLInputElement) {
        sUserChangesSnk.send(event.target.value);
      }
    });

    this.text = sUserChangesSnk.orElse(sText).hold(initText);
    sText.listen(text => {
      this.textField.value = text;
    });

    Transaction.currentTransaction.post(-1, () => {
      this.textField.disabled = !enabled.sample();
    });
    Operational.updates(enabled).listen(b => {
      this.textField.disabled = !b;
    });
  }

  render() {
    document.body.appendChild(this.textField);
  }
}

export default STextField;
