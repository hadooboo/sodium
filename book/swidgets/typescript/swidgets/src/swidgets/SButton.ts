import { Cell, Operational, Stream, StreamSink, Transaction, Unit } from "sodiumjs";

class SButton {
  private button: HTMLButtonElement;
  public sClicked: Stream<Unit>;

  constructor({
    label,
    enabled = new Cell<boolean>(true)
  } : {
    label: string,
    enabled?: Cell<boolean>
  }) {
    const sClickedSink = new StreamSink<Unit>();
    this.sClicked = sClickedSink;

    this.button = document.createElement('button');
    this.button.textContent = label;
    this.button.addEventListener('click', () => {
      sClickedSink.send(Unit.UNIT);
    });

    Transaction.currentTransaction.post(0, () => {
      this.button.disabled = !enabled.sample();
    });
    Operational.updates(enabled).listen(b => {
      this.button.disabled = !b;
    });
  }

  render() {
    document.body.appendChild(this.button);
  }
}

export default SButton;
