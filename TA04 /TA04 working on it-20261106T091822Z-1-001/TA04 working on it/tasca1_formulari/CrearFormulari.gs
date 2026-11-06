/**
 * TA04 - Tasca 1: crea el Google Form d'incidències + el full de càlcul vinculat.
 * Com fer-ho servir:
 *   1. Ves a https://script.google.com  ->  "Nou projecte"
 *   2. Esborra el codi i enganxa tot aquest fitxer
 *   3. Tria la funció "crearFormulari" i prem ▶ Executar (accepta els permisos)
 *   4. Mira el "Registre d'execució": hi tens l'enllaç per compartir i el del full
 * Quan tinguis respostes, executa "exportarCSV": crea incidencies.csv al teu Drive.
 */
function crearFormulari() {
  const form = FormApp.create('Registre d\'incidències TIC i audiovisuals')
    .setDescription('Informa de qualsevol avaria d\'equips informàtics o audiovisuals. Temps: 1 minut.')
    .setCollectEmail(false)
    .setProgressBar(false);

  form.addTextItem().setTitle('Nom i cognoms').setRequired(true);

  form.addTextItem().setTitle('Correu electrònic').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form.addListItem().setTitle('Departament').setRequired(true)
    .setChoiceValues(['Administració', 'Docència', 'Secretaria', 'Direcció', 'Biblioteca',
                      'Sistemes', 'Consergeria', 'Laboratori']);

  form.addListItem().setTitle('Ubicació de l\'equip').setRequired(true)
    .setChoiceValues(['Aula 101', 'Aula 102', 'Aula 204', 'Aula 305', 'Lab Xarxes', 'Lab Hardware',
                      'Sala d\'Actes', 'Biblioteca', 'Despatx Direcció', 'Secretaria',
                      'Sala de Professors', 'CPD']);

  form.addMultipleChoiceItem().setTitle('Tipus d\'equip').setRequired(true)
    .setChoiceValues(['Ordinador', 'Portàtil', 'Impressora', 'Projector', 'Pantalla', 'Altaveus',
                      'Xarxa / WiFi', 'Servidor', 'Telèfon IP', 'Pissarra digital'])
    .showOtherOption(true);

  form.addTextItem().setTitle('Codi d\'inventari de l\'equip')
    .setHelpText('Etiqueta de l\'equip, format ABC-123 (ex: PRO-021)').setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern('^[A-Za-z]{3}-[0-9]{3}$')
      .setHelpText('Format: 3 lletres, guió, 3 números (ex: PRO-021)').build());

  form.addListItem().setTitle('Categoria').setRequired(true)
    .setChoiceValues(['Hardware', 'Software', 'Xarxa', 'Perifèrics', 'Audiovisual', 'Comunicacions']);

  form.addParagraphTextItem().setTitle('Descripció del problema').setRequired(true);

  form.addMultipleChoiceItem().setTitle('Prioritat').setRequired(true)
    .setChoiceValues(['Baixa', 'Mitjana', 'Alta', 'Crítica']);

  form.addDateTimeItem().setTitle('Quan va començar el problema?').setRequired(true);

  form.addMultipleChoiceItem().setTitle('L\'equip es pot continuar fent servir?').setRequired(true)
    .setChoiceValues(['Sí, amb normalitat', 'Sí, però amb dificultats', 'No, està inutilitzat']);

  form.addScaleItem().setTitle('Grau d\'afectació a la classe / feina')
    .setBounds(1, 5).setLabels('Gens', 'Totalment').setRequired(true);

  // Full de càlcul de respostes (la "Marca de temps" la posa Google automàticament)
  const ss = SpreadsheetApp.create('Respostes - Incidències TIC');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());

  Logger.log('✅ Enllaç per COMPARTIR amb la classe: ' + form.getPublishedUrl());
  Logger.log('✏️  Editar el formulari: ' + form.getEditUrl());
  Logger.log('📊 Full de respostes: ' + ss.getUrl());
}

/** Exporta les respostes a incidencies.csv (al teu Google Drive), afegint un ID INC-00001... */
function exportarCSV() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const sheet = SpreadsheetApp.openById(id).getSheets()[0];
  const dades = sheet.getDataRange().getDisplayValues();
  const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
  const linies = dades.map((fila, i) =>
    [i === 0 ? 'ID' : 'INC-' + String(i).padStart(5, '0')].concat(fila).map(esc).join(','));
  const fitxer = DriveApp.createFile('incidencies.csv', '\uFEFF' + linies.join('\r\n'), MimeType.CSV);
  Logger.log('📁 ' + (dades.length - 1) + ' incidències exportades: ' + fitxer.getUrl());
}
