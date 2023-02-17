import { Transaction } from 'sodiumjs';
import SButton from '../swidgets/src/swidgets/SButton';
import STextField from '../swidgets/src/swidgets/STextField';

class GameChat {
  public static main() {
    const onegai = new SButton({label: 'Onegai shimasu'});
    const thanks = new SButton({label: 'Thank you'});
    const sOnegai = onegai.sClicked.map(u => 'Onegai shimasu');
    const sThanks = thanks.sClicked.map(u => 'Thank you');
    const sCanned = sOnegai.orElse(sThanks);
    const text = new STextField({sText: sCanned, initText: ''});

    document.body.appendChild(text.getHTMLElement());
    document.body.appendChild(onegai.getHTMLElement());
    document.body.appendChild(thanks.getHTMLElement());
  }
}

Transaction.run(() => GameChat.main());
