import { Cell, Transaction } from 'sodiumjs';
import SButton from '../swidgets/src/swidgets/SButton';
import SLabel from '../swidgets/src/swidgets/SLabel';
import STextField from '../swidgets/src/swidgets/STextField';
import SSpinner from './SSpinner';

class FormValidation {
  public static main() {
    const maxEmails = 4;
    const row = maxEmails + 2;

    const valids: Cell<string>[] = [];
    
    const name = new STextField({initText: '', width: 30});
    valids.push(
      name.text.map(t => t.trim() == ''            ? '<-- enter something' :
                         t.trim().indexOf(' ') < 0 ? '<-- must contain space' : '')
    );
    name.render();
    const nameLabel = new SLabel({text: valids[0]});
    nameLabel.render();
    document.body.appendChild(document.createElement('div'));

    const spinner = new SSpinner({initialValue: 1});
    valids.push(
      spinner.value.map(n => n < 1 || n > maxEmails ? `<-- must be 1 to ${maxEmails}` : '')
    );
    const spinnerLabel = new SLabel({text: valids[1]});
    spinnerLabel.render();
    document.body.appendChild(document.createElement('div'));

    for (let i = 0; i < maxEmails; i++) {
      const enabled = spinner.value.map(n => i < n);
      const email = new STextField({initText: '', width: 30, enabled: enabled});
      valids.push(
        email.text.lift(spinner.value, (e, n) =>
          i >= n             ? '' :
          e.trim() == ''     ? '<-- enter something' :
          e.indexOf('@') < 0 ? '<-- must contain @' : ''
        )
      );
      email.render();
      const validLabel = new SLabel({text: valids[i + 2]});
      validLabel.render();
      document.body.appendChild(document.createElement('div'));
    }

    let allValid = new Cell<boolean>(true);
    for (let i = 0; i < row; i++) {
      const thisValid = valids[i].map(t => t == '');
      allValid = allValid.lift(thisValid, (a, b) => a && b);
    }

    const ok = new SButton({label: 'OK', enabled: allValid});
    ok.render();
  }
}

Transaction.run(() => FormValidation.main());
