import { Transaction } from 'sodiumjs';
import SLabel from '../swidgets/src/swidgets/SLabel';
import STextField from '../swidgets/src/swidgets/STextField';

class Label {
  public static main() {
    const msg = new STextField({initText: 'Hello'});
    const lbl = new SLabel({text: msg.text});

    msg.render();
    document.body.appendChild(document.createElement('div'));
    lbl.render();
  }
}

Transaction.run(() => Label.main());
