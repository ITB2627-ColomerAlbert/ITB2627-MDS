/**
 * Envia respostes directament a través de l'API de Google Forms (FormResponse).
 * D'aquesta manera el comptador de Google Forms sí que puja fins a les 4.000+ respostes!
 * Executa en blocs per no superar el límit de temps de Google (6 minuts).
 */
function enviarRespostesRealsForms() {
  const formUrl = 'https://docs.google.com/forms/d/1lVuqliAWJQqk43vEgg5fYauzFHrOQTYHr9w_-jSAH8w/edit';
  const form = FormApp.openByUrl(formUrl);
  const items = form.getItems();
  
  // Identifiquem els camps del formulari
  const map = {};
  items.forEach(item => {
    map[item.getTitle().trim()] = item;
  });

  const P = a => a[Math.floor(Math.random() * a.length)];
  const noms = ['Marc Puig','Laia Soler','Pau Vidal','Júlia Ferrer','Arnau Roca','Martina Serra','Pol Costa','Ona Font','Jan Mas','Carla Pons','Nil Riera','Aina Camps','Biel Sala','Emma Vila','Hugo López','Lucía García','Mateo Martín','Sofía Pérez','Àlex Torres','Noa Romero'];
  const deps = ['Administració','Docència','Secretaria','Direcció','Biblioteca','Sistemes','Consergeria','Laboratori'];
  const ubic = ['Aula 101','Aula 102','Aula 204','Aula 305','Lab Xarxes','Lab Hardware','Sala d\'Actes','Biblioteca','Despatx Direcció','Secretaria','Sala de Professors','CPD'];
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

  // Enviem un lot de 500 respostes a través de l'API de Formularis
  const BLOC = 500;
  for (let i = 0; i < BLOC; i++) {
    const resp = form.createResponse();
    const nom = P(noms);
    const email = nom.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@itb.cat';
    const t = P(tipus);
    const e = equips[t];
    const codi = e[1] + '-' + String(1 + Math.floor(Math.random() * 120)).padStart(3, '0');
    const p = P(prio);

    if (map['Nom i cognoms']) resp.withItemResponse(map['Nom i cognoms'].asTextItem().createResponse(nom));
    if (map['Correu electrònic']) resp.withItemResponse(map['Correu electrònic'].asTextItem().createResponse(email));
    if (map['Departament']) resp.withItemResponse(map['Departament'].asListItem().createResponse(P(deps)));
    if (map['Ubicació de l\'equip']) resp.withItemResponse(map['Ubicació de l\'equip'].asListItem().createResponse(P(ubic)));
    if (map['Tipus d\'equip']) resp.withItemResponse(map['Tipus d\'equip'].asMultipleChoiceItem().createResponse(t));
    if (map['Codi d\'inventari de l\'equip']) resp.withItemResponse(map['Codi d\'inventari de l\'equip'].asTextItem().createResponse(codi));
    if (map['Categoria']) resp.withItemResponse(map['Categoria'].asListItem().createResponse(e[0]));
    if (map['Descripció del problema']) resp.withItemResponse(map['Descripció del problema'].asParagraphTextItem().createResponse(P(e[2])));
    if (map['Prioritat']) resp.withItemResponse(map['Prioritat'].asMultipleChoiceItem().createResponse(p));
    if (map['Quan va començar el problema?']) {
      const d = new Date(Date.now() - Math.floor(Math.random() * 5 * 86400000));
      resp.withItemResponse(map['Quan va començar el problema?'].asDateTimeItem().createResponse(d));
    }
    if (map['L\'equip es pot continuar fent servir?']) {
      resp.withItemResponse(map['L\'equip es pot continuar fent servir?'].asMultipleChoiceItem().createResponse(P(us)));
    }
    if (map['Grau d\'afectació a la classe / feina']) {
      resp.withItemResponse(map['Grau d\'afectació a la classe / feina'].asScaleItem().createResponse(Math.floor(Math.random() * 5) + 1));
    }

    resp.submit();
  }
  Logger.log('✔ Enviat bloc de ' + BLOC + ' respostes a Google Forms!');
}