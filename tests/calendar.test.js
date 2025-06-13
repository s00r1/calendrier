const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Bouton Télécharger PDF', () => {
  test('le bouton est présent dans index.html', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    const dom = new JSDOM(html);
    const btn = dom.window.document.querySelector('#download-pdf');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toContain('Télécharger PDF');
  });

  test("le gestionnaire d'événement est défini", () => {
    const js = fs.readFileSync(path.resolve(__dirname, '../src/calendar.js'), 'utf8');
    const regex = /downloadPdfBtn\.addEventListener\(\s*['\"]click['\"]/;
    expect(regex.test(js)).toBe(true);
  });
});
