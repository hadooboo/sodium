class LandingPage {
  public static main() {
    const a1 = document.createElement('a');
    a1.innerHTML = 'to clearfield';
    a1.href = '/clearfield.html';
    document.body.appendChild(a1);

    const a2 = document.createElement('a');
    a2.innerHTML = 'to label';
    a2.href = '/label.html';
    document.body.appendChild(a2);
  }
}

LandingPage.main();
