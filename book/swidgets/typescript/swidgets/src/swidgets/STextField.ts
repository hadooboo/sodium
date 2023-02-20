import { Cell, Operational, Stream, StreamSink, Transaction } from "sodiumjs";

class STextField {
  private readonly textField: HTMLInputElement;
  public readonly text: Cell<string>;
  public readonly sUserChanges: Stream<string>;

  constructor({
    sText = new Stream<string>(),
    initText,
    width = 15,
    enabled = new Cell<boolean>(true)
  } : {
    sText?: Stream<string>,
    initText: string,
    width?: number,
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

    Transaction.currentTransaction.post(0, () => {
      this.textField.disabled = !enabled.sample();
    });
    Operational.updates(enabled).listen(b => {
      this.textField.disabled = !b;
    });
  }

  getHTMLElement(): HTMLElement {
    return this.textField;
  }
}

export default STextField;
