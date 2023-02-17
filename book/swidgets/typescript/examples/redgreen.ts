import { Transaction } from 'sodiumjs';
import SButton from '../swidgets/src/swidgets/SButton';
import SLabel from '../swidgets/src/swidgets/SLabel';

class RedGreen {
  public static main() {
    const red = new SButton({label: 'red'});
    const green = new SButton({label: 'green'});
    const sRed = red.sClicked.map(u => 'red');
    const sGreen = green.sClicked.map(u => 'green');
    const sColor = sRed.orElse(sGreen);
    const color = sColor.hold('');
    const lbl = new SLabel({text: color});

    document.body.appendChild(red.getHTMLElement());
    document.body.appendChild(green.getHTMLElement());
    document.body.appendChild(document.createElement('div'));
    document.body.appendChild(lbl.getHTMLElement());
  }
}

Transaction.run(() => RedGreen.main());
