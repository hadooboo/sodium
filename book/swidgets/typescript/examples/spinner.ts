import { CellLoop, Transaction } from 'sodiumjs';
import SButton from '../swidgets/src/swidgets/SButton';
import SLabel from '../swidgets/src/swidgets/SLabel';

class Spinner {
  public static main() {
    const value = new CellLoop<number>();
    const lblValue = new SLabel({text: value.map(i => i.toString())});
    const plus = new SButton({label: '+'});
    const minus = new SButton({label: '-'});
    const sPlusDelta = plus.sClicked.map(u => 1);
    const sMinusDelta = minus.sClicked.map(u => -1);
    const sDelta = sPlusDelta.orElse(sMinusDelta);
    const sUpdate = sDelta.snapshot(value, (delta, value_) => delta + value_);
    value.loop(sUpdate.hold(0));

    lblValue.render();
    plus.render();
    minus.render();
  }
}

Transaction.run(() => Spinner.main());
