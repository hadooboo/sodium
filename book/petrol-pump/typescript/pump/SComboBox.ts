import { Cell, CellSink } from "sodiumjs";

class SComboBox<E> {
  private readonly comboBox: HTMLSelectElement;
  public readonly selectedItem: Cell<E>;
  private readonly items: E[];

  constructor({ items = [] }: { items?: E[] }) {
    this.comboBox = document.createElement("select");
    for (const e of items) {
      const comboBoxOption = document.createElement("option");
      comboBoxOption.text = e.toString();
      comboBoxOption.value = e.toString();
      this.comboBox.add(comboBoxOption);
    }
    this.items = items;

    const initValue = this.comboBox.selectedOptions[0].value;
    const item = new CellSink<E>(this.findItem(initValue));
    this.comboBox.addEventListener("change", (event: InputEvent) => {
      if (event.target instanceof HTMLSelectElement) {
        const changedValue = event.target.selectedOptions[0].value;
        item.send(this.findItem(changedValue));
      }
    });
    this.selectedItem = item;
  }

  private findItem(value: string): E {
    for (const item of this.items) {
      if (item.toString() == value) {
        return item;
      }
    }
    return undefined;
  }

  getHTMLElement(): HTMLElement {
    return this.comboBox;
  }
}

export default SComboBox;
