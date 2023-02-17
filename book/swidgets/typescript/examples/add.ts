import { Transaction } from 'sodiumjs';
import SLabel from '../swidgets/src/swidgets/SLabel';
import STextField from '../swidgets/src/swidgets/STextField';

class Add {
  public static main() {
    const txtA = new STextField({initText: '5'});
    const txtB = new STextField({initText: '10'});
    const a = txtA.text.map(t => Number(t));
    const b = txtB.text.map(t => Number(t));
    const sum = a.lift(b, (a_, b_) => a_ + b_);
    const lblSum = new SLabel({text: sum.map(n => n.toString())});

    txtA.render();
    txtB.render();
    document.body.appendChild(document.createElement('div'));
    lblSum.render();
  }
}

Transaction.run(() => Add.main());
