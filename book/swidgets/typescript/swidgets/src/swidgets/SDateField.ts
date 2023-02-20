import { Cell } from 'sodiumjs';
import SComboBox from './SComboBox';

class SDateField {
  private static months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  public readonly date: Cell<Date>;
  private readonly yearComboBox: SComboBox<number>;
  private readonly monthComboBox: SComboBox<string>;
  private readonly dayComboBox: SComboBox<number>;

  constructor({
    cal = new Date()
  } : {
    cal?: Date
  }) {
    const years: number[] = [];
    const now = new Date();
    for (let y = now.getFullYear() - 10; y <= now.getFullYear() + 10; y++)
      years.push(y);
    const days: number[] = [];
    for (let d = 1; d <= 31; d++)
      days.push(d);

    this.yearComboBox = new SComboBox<number>({items: years});
    this.yearComboBox.setSelectedItem(cal.getFullYear());
    this.monthComboBox = new SComboBox({items: SDateField.months});
    this.monthComboBox.setSelectedItem(SDateField.months[cal.getMonth()]);
    this.dayComboBox = new SComboBox({items: days});
    this.dayComboBox.setSelectedItem(cal.getDate());

    const monthIndex = this.monthComboBox.selectedItem.map(ostr => 
      SDateField.months.findIndex(value => value == ostr)
    );

    this.date = this.yearComboBox.selectedItem.lift3(
      monthIndex,
      this.dayComboBox.selectedItem,
      (oy, om, od) => new Date(oy, om, od)
    );
  }

  getHTMLElement(): HTMLElement {
    const div = document.createElement('div');
    div.appendChild(this.yearComboBox.getHTMLElement());
    div.appendChild(this.monthComboBox.getHTMLElement());
    div.appendChild(this.dayComboBox.getHTMLElement());
    return div;
  }
}

export default SDateField;
