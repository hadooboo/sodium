import { Cell, StreamLoop } from 'sodiumjs'
import SButton from '../swidgets/src/swidgets/SButton';
import STextField from '../swidgets/src/swidgets/STextField';

class SSpinner {
  public value: Cell<number>

  constructor({
    initialValue
  } : {
    initialValue: number
  }) {
    const sSetValue = new StreamLoop<number>();
    const textField = new STextField({
      sText: sSetValue.map(v => v.toString()),
      initText: initialValue.toString(),
      width: 5,
    });
    this.value = textField.text.map(txt => Number(txt) || 0);

    const plus = new SButton({label: '+'});
    const minus = new SButton({label: '-'});

    textField.render();
    plus.render();
    minus.render();

    const sPlusDelta = plus.sClicked.map(u => 1);
    const sMinusDelta = minus.sClicked.map(u => -1);
    const sDelta = sPlusDelta.orElse(sMinusDelta);
    sSetValue.loop(sDelta.snapshot(this.value, (delta, value) => delta + value));
  }
}

export default SSpinner;
