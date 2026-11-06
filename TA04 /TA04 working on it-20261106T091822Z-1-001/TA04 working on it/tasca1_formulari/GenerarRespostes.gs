
/**
 * Genera N respostes simulades directament al full de respostes (ràpid: 4000 files en segons).
 * Executa "generarRespostes". Inclou ~1% de dades errònies (any 2064, descripció buida)
 * per poder practicar el filtratge a la tasca 3.
 */
function generarRespostes() {
  const N = 4000;
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const sheet = SpreadsheetApp.openById(id).getSheets()[0];
  const P = a => a[Math.floor(Math.random() * a.length)];
  const noms = ['Marc','Laia','Pau','Júlia','Arnau','Martina','Pol','Ona','Jan','Carla','Nil','Aina',
                'Biel','Emma','Hugo','Lucía','Mateo','Sofía','Àlex','Noa','Adam','Mia','Èric','Paula'];
  const cognoms = ['Puig','Soler','Vidal','Ferrer','Roca','Serra','Costa','Font','Mas','Pons','Riera',
                   'Camps','Sala','Vila','López','García','Martín','Pérez','Torres','Romero'];
  const deps = ['Administració','Docència','Secretaria','Direcció','Biblioteca','Sistemes','Consergeria','Laboratori'];
  const ubic = ['Aula 101','Aula 102','Aula 204','Aula 305','Lab Xarxes','Lab Hardware','Sala d\'Actes',
                'Biblioteca','Despatx Direcció','Secretaria','Sala de Professors','CPD'];
  const equips = {
    'Ordinador':   ['Hardware', 'ORD', ['No arrenca','Pantalla blava','Va molt lent','Virus detectat','No connecta a la xarxa','El teclat no funciona']],
    'Portàtil':    ['Hardware', 'POR', ['La bateria no carrega','Pantalla trencada','No detecta la WiFi','Se sobreescalfa','El touchpad no respon']],
    'Impressora':  ['Perifèrics', 'IMP', ['Paper encallat','Sense tòner','No imprimeix','Imprimeix fulls en blanc','Error de connexió']],
    'Projector':   ['Audiovisual', 'PRO', ['No mostra imatge','Làmpada fosa','Colors distorsionats','No detecta l\'HDMI','Comandament perdut']],
    'Pantalla':    ['Perifèrics', 'PAN', ['No s\'encén','Píxels morts','Parpelleja','Cable VGA malmès']],
    'Altaveus':    ['Audiovisual', 'ALT', ['No sona','Soroll de fons','Volum molt baix']],
    'Xarxa / WiFi':['Xarxa', 'XAR', ['Sense connexió','Punt d\'accés caigut','Switch no respon','Connexió intermitent','Cable de xarxa trencat']],
    'Servidor':    ['Software', 'SRV', ['Servei caigut','Disc ple','Còpia de seguretat fallida','CPU al 100%']],
    'Telèfon IP':  ['Comunicacions', 'TEL', ['Sense to','No es registra','Pantalla apagada']],
    'Pissarra digital': ['Audiovisual', 'PIS', ['Calibratge incorrecte','No respon al tacte','Sense imatge']]
  };
  const tipus = Object.keys(equips);
  const prio = ['Baixa','Mitjana','Mitjana','Alta','Alta','Crítica'];
  const us = ['Sí, amb normalitat','Sí, però amb dificultats','No, està inutilitzat'];
  const ini = new Date('2026-09-01T08:00:00').getTime(), ara = Date.now();
  const files = [];
  for (let i = 0; i < N; i++) {
    const nom = P(noms), cog = P(cognoms), t = P(tipus), e = equips[t];
    const marca = new Date(ini + Math.random() * (ara - ini));
    let inici = new Date(marca.getTime() - Math.random() * 3 * 86400000);
    let desc = P(e[2]);
    const email = (nom + '.' + cog).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@itb.cat';
    const r = Math.random();
    if (r < 0.006) inici = new Date(inici.getTime()).setFullYear(2064) && new Date(new Date(inici).setFullYear(2064));
    else if (r < 0.012) desc = '';
    const p = P(prio);
    const usable = p === 'Crítica' ? 'No, està inutilitzat' : P(us);
    const afect = Math.min(5, Math.max(1, prio.indexOf(p) <= 0 ? 1 + Math.floor(Math.random() * 2)
                                         : 2 + Math.floor(Math.random() * 4)));
    files.push([marca, nom + ' ' + cog, email, P(deps), P(ubic), t,
                e[1] + '-' + String(1 + Math.floor(Math.random() * 120)).padStart(3, '0'),
                e[0], desc, p, inici, usable, afect]);
  }
  files.sort((a, b) => a[0] - b[0]);
  sheet.getRange(sheet.getLastRow() + 1, 1, files.length, files[0].length).setValues(files);
  Logger.log('✅ ' + N + ' respostes afegides. Total files de dades: ' + (sheet.getLastRow() - 1));
}
