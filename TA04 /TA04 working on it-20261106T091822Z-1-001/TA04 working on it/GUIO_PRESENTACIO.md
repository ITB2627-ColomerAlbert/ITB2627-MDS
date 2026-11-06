# 🎤 GUIÓ DE LA PRESENTACIÓ ORAL (4 MINUTS) · GRUP G6

**Mòdul 0373 · Llenguatges de Marques · Institut Tecnològic de Barcelona**  
**Grup:** G6  
**Ordre d'intervenció:**

1. **Samire Laarej** (Castellano) → Obre, presenta l'equip i el repte \[0:00 \- 0:35\]  
2. **Kevin Aguilar** (Català) → Formulari, dades i migració a XML \[0:35 \- 1:45\]  
3. **Albert Colomer** (Català) → Python, filtratge (dada vs info) i JSON \[1:45 \- 2:55\]  
4. **Samire Laarej** (Castellano) → El gran tancament: DEMO EN DIRECTE del Dashboard interactiu \[2:55 \- 4:00\]

---

## ⏱️ GUIÓ PAS A PAS (CRONÒMETRE ESTRICTE)

---

### 👤 1\. SAMIRE LAAREJ (Castellano) · \[0:00 \- 0:35\]

*(Diapositiva 1 \- Portada & Diapositiva 2 \- Arquitectura)*

**\[Diapositiva 1 \- Portada\]**

> "Hola a todos y profesores. Somos el Grupo G6, formado por Kevin Aguilar, Albert Colomer y yo, Samire Laarej. Hoy venimos a presentar nuestra solución para la TA04: el ciclo de vida completo y la administración de incidencias TIC en el centro."

**\[Diapositiva 2 \- Pipeline técnico\]**

> "El reto no consistía en hacer un simple formulario, sino en diseñar una arquitectura de sistemas robusta: pasar de respuestas de usuarios a un archivo CSV, transformarlo a un árbol XML semántico, procesarlo y filtrarlo en Python, y persistirlo en JSON.

> Ahora le cedo la palabra a Kevin para que explique cómo recogimos los datos y construimos el XML."

---

### 👤 2\. KEVIN AGUILAR (Català) · \[0:35 \- 1:45\]

*(Diapositiva 3 \- El Formulari & Diapositiva 4 \- Migració a XML)*

**\[Diapositiva 3 \- Fase 1: Formulari i recol·lecció massiva\]**

> "Gràcies, Samire. Per començar, vam dissenyar un formulari amb 13 camps clau —superant els 10 obligatoris—: traçabilitat de l'usuari amb correu `@itb.cat`, identificació de l'equip amb format d'inventari `ABC-123`, ubicació exacta de l'aula i l'impacte en la classe de l'1 al 5\. Gràcies a un script de simulació i respostes reals, vam assolir una massa crítica de més de **4.000 registres** al full de càlcul per fer proves d'estrès reals."

**\[Diapositiva 4 \- Fase 2: Migració CSV a XML semàntic\]**

> "El següent pas va ser transformar el fitxer pla `incidencies.csv` a un document XML estructurat jeràrquicament. Vam aplicar les millors pràctiques de marcatge:

> - Els identificadors i codis van com a atributs (`id="INC-00001"`, `codi="PRO-312"`).  
> - La informació relacionada es va agrupar en subelements lògics com `<informador>` i `<equip>`.

> A més, un requisit fonamental va ser el **compliment del RGPD**: tot el tractament es va fer en local mitjançant programació, sense pujar dades privades dels companys a cap proveïdor d'IA extern. Ara l'Albert us explicarà com processem tot aquest volum en Python."

---

### 👤 3\. ALBERT COLOMER (Català) · \[1:45 \- 2:55\]

*(Diapositiva 5 \- Dades vs Informació & Diapositiva 6 \- Emmagatzematge en JSON)*

**\[Diapositiva 5 \- Fase 3: De la Dada a la Informació\]**

> "Gràcies, Kevin. A la fase 3 treballem la diferència fonamental de l'assignatura: Una **dada** és un valor brut aïllat sense context —com llegir 'Aula 305' o una data absurda de l'any '2064'—. La **informació** neix quan netegem, agrupem i donem significat a aquestes dades per poder prendre decisions operatives.

> El nostre script de Python analitza l'XML i aplica filtres de qualitat: descarta incidències amb dates del futur, descripcions buides o correus invàlids. Així vam convertir 4.002 dades en brut en 3.963 registres informatius d'alt valor."

**\[Diapositiva 6 \- Fase 4: Persistència en JSON\]**

> "Aquestes dades netes es desen a `incidencies.json`. Vam afegir una funcionalitat interactiva que comprova si el fitxer ja existeix i permet a l'administrador triar si vol sobreescriure'l o afegir només registres nous verificant que no hi hagi IDs duplicats.

> I ara, el Samire us ensenyarà una proposta innovadora que ha dissenyat per anar molt més enllà del que demanava la tasca."

---

### 👤 4\. SAMIRE LAAREJ (Castellano) · \[2:55 \- 4:00\]

*(Diapositiva 7 \+ CANVI DE PESTANYA EN DIRECTE A `dashboard.html`)*

**\[Diapositiva 7 \+ Salto al Navegador con el Dashboard en pantalla\]**

> "Exacto. Analizar 4.000 incidencias por terminal de consola está bien para un script, pero en un entorno real de soporte técnico de un centro como el ITB... **nadie quiere leer 4.000 líneas de texto a mano.**

> Por eso propuse ir un paso más allá y creé una **Plataforma Web Interactiva de Inteligencia de Incidencias** en tiempo real:

> *(Muestras el Dashboard en la pantalla y mueves el ratón)*:

> - **Visibilidad ejecutiva:** En la parte superior tenemos los KPIs clave: cuántas incidencias hay, cuántas son críticas y el impacto promedio.  
> - **Gráficos dinámicos:** En un segundo vemos qué equipamiento falla más (ordenadores y proyectores) y la proporción de prioridades.  
> - **Búsqueda instantánea:** Pero lo más importante es la agilidad. Si un técnico necesita saber qué ocurre en un aula conflictiva, simplemente escribe aquí: *(escribes `Aula 305` o filtras por `Crítica`)*... y el sistema filtra al instante entre los 4.000 registros sin tener que tocar una base de datos pesada.

> Convertimos un simple ejercicio escolar en una herramienta que cualquier departamento de soporte técnico querría utilizar el primer día de trabajo.

> Muchas gracias por vuestra atención, y pasamos al turno de preguntas\!"

---

## 🎯 RESPOSTES PER AL TORN DE PREGUNTES (PREGUNTES TÍPIQUES)

1. **"Per què heu utilitzat atributs a l'XML en lloc de tags?"**

   * *Resposta:* Els identificadors com `id` o `codi` són metadades d'indexació per al sistema, mentre que el contingut descriptiu va en elements fills.  
2. **"Per què no heu fet servir ChatGPT o Gemini per processar el CSV?"**

   * *Resposta:* Per la normativa **RGPD**. Els formularis contenen noms, cognoms i correus institucionals reals dels companys. Enviar-los a una IA comercial externa vulneraria la protecció de dades de l'institut.  
3. **"Quin avantatge té desar-ho en JSON al final?"**

   * *Resposta:* JSON és l'estàndard *de facto* per a aplicacions web modernes i APIs. Permet alimentar interfícies interactives (com el nostre Dashboard) de forma nativa en JavaScript sense necessitat de parsejadors complexos.