import { Cell, CellSink } from "sodiumjs";

class STextField {
  private readonly textField: HTMLInputElement;
  public readonly text: Cell<string>;

  constructor({ initText, width }: { initText: string; width?: number }) {
    const text = new CellSink<string>(initText);
    this.text = text;

    this.textField = document.createElement("input");
    this.textField.value = initText;
    this.textField.width = width;
    this.textField.addEventListener("input", (event: InputEvent) => {
      if (event.target instanceof HTMLInputElement) {
        text.send(event.target.value);
      }
    });
  }

  getHTMLElement(): HTMLElement {
    return this.textField;
  }
}

export default STextField;
