import { Transaction } from 'sodiumjs';
import SButton from '../swidgets/src/swidgets/SButton';
import SDateField from '../swidgets/src/swidgets/SDateField';

class Airline1 {
  public static main() {
    const dep = new SDateField({});
    const ret = new SDateField({});
    const valid = dep.date.lift(ret.date, (d, r) => d <= r);
    const ok = new SButton({label: 'OK', enabled: valid});

    dep.render();
    document.body.appendChild(document.createElement('div'));
    ret.render();
    document.body.appendChild(document.createElement('div'));
    ok.render();
  }
}

Transaction.run(() => Airline1.main());
