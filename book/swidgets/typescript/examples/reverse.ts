import { Transaction } from 'sodiumjs';
import SLabel from '../swidgets/src/swidgets/SLabel';
import STextField from '../swidgets/src/swidgets/STextField'

class Reverse {
  public static main() {
    const msg = new STextField({initText: 'Hello'});
    const reversed = msg.text.map(t => this.reverse(t));
    const lbl = new SLabel({text: reversed});

    msg.render();
    lbl.render();
  }

  static reverse(s: string): string {
    let res = "";
      for (const c of s) {
        res = c + res;
      }
      return res;
  }
}

Transaction.run(() => Reverse.main());
