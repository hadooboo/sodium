import {
  Cell,
  Operational,
  Stream,
  StreamSink,
  Transaction,
  Unit,
} from "sodiumjs";

class SButton {
  private readonly button: HTMLButtonElement;
  public readonly sClicked: Stream<Unit>;

  constructor({
    label,
    enabled = new Cell<boolean>(true),
  }: {
    label: string;
    enabled?: Cell<boolean>;
  }) {
    const sClickedSink = new StreamSink<Unit>();
    this.sClicked = sClickedSink;

    this.button = document.createElement("button");
    this.button.textContent = label;
    this.button.addEventListener("click", () => {
      sClickedSink.send(Unit.UNIT);
    });

    Transaction.currentTransaction.post(0, () => {
      this.button.disabled = !enabled.sample();
    });
    Operational.updates(enabled).listen((b) => {
      this.button.disabled = !b;
    });
  }

  getHTMLElement(): HTMLElement {
    return this.button;
  }
}

export default SButton;
