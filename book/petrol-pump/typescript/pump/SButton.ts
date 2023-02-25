import { Stream, StreamSink, Unit } from "sodiumjs";

class SButton {
  private readonly button: HTMLButtonElement;
  public readonly sClicked: Stream<Unit>;

  constructor({ label }: { label: string }) {
    const sClickedSink = new StreamSink<Unit>();
    this.sClicked = sClickedSink;

    this.button = document.createElement("button");
    this.button.textContent = label;
    this.button.addEventListener("click", () => {
      sClickedSink.send(Unit.UNIT);
    });
  }

  getHTMLElement(): HTMLElement {
    return this.button;
  }
}

export default SButton;
