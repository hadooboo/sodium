import { Cell, CellSink } from 'sodiumjs';

class SComboBox<E = string|number> {
  private comboBox: HTMLSelectElement;
  public selectedItem: Cell<E>;
  private item: CellSink<E>;

  constructor({
    items,
  } : {
    items: E[],
  }) {
    this.comboBox = document.createElement('select');
    for (const e of items) {
      const comboBoxOption = document.createElement('option');
      comboBoxOption.text = e.toString();
      comboBoxOption.value = e.toString();
      this.comboBox.add(comboBoxOption);
    }

    const initValue = this.comboBox.selectedOptions[0].value;
    this.item = new CellSink<E>((Number(initValue) || initValue) as E);
    this.comboBox.addEventListener('change', (event: InputEvent) => {
      if (event.target instanceof HTMLSelectElement) {
        const changedValue = event.target.selectedOptions[0].value;
        this.item.send((Number(changedValue) || changedValue) as E);
      }
    });
    this.selectedItem = this.item;
  }

  setSelectedItem(value: E) {
    for (let i = 0; i < this.comboBox.length; i++) {
      if (this.comboBox.item(i).value == value) {
        this.comboBox.item(i).selected = true;
        this.item.send(value);
      }
    }
  }

  render() {
    document.body.appendChild(this.comboBox);
  }
}

export default SComboBox;
