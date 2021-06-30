# Web Crawler
## Allgemein
Beim Web Crawler handelt es sich um eine Software zur Analyse von Webseiten. Dabei kann der Benutzer eine Website bezüglich datenschutzrelevanter Daten wie externe Ressourcen & Cookie analysieren lassen. Der Crawler erkennt & folgt dabei automatisch Links, die zur Domain gehören, die es zu analysieren gilt.
## Bedienung
Um den Crawl-Vorgang starten zu können, hat man zunächst zwei Optionen:
- eine bestehende Session zu laden
- eine neue URL zum Analysieren in das __URL__ Feld einzutragen

Beide Optionen lassen sich dabei auch kombinieren (später dazu mehr).

Um eine bestehende Session zu laden, kann durch Klicken auf den __Load__ Button im unteren Bereich des Crawlers eine __JSON__-Datei geladen werden. Beim Laden der Datei wird geprüft, ob es die __JSON__ Datei eine gültige Session beinhaltet oder nicht.
Alternativ dazu kann in das __URL__ Feld eine URL eingetragen werden. Diese wird bei einer geladenen Session nur berücksichtigt, wenn die __URL__ zur __Domain__ der Session gehört. Wird keine Session geladen, wird eine neue Session mit der __URL__ erzeugt. Falls die __URL__ dabei ungültig ist, wird der Crawl-Vorgang frühzeitig abgebrochen. 

Durch Klicken auf den __Start__ Button im oberen Bereich des Crawlers wird der Crawl-Vorgang gestartet. Während dem Crawl-Vorgang werden bereits untersuchte __URLs__ im mittleren Feld ausgegeben. Der Crawl-Vorgang lässt sich jederzeit mit einem Klick auf den __Stop__ Button unterbrechen, wodurch das Ergebnis im mittleren Feld ausgegeben wird. Der Vorgang kann erneut durch Klicken auf den __Start__ Button weitergeführt werden.

Falls der Vorgang unterbrochen wird oder alle __URLs__ der Domäne erfolgreich untersucht wurden, wird im mittleren Feld das Ergebnis der Session ausgegeben. Dieses lässt sich durch Klicken auf den __Save__ Button im unteren Bereich des Crawlers in einer JSON-Datei speichern.

## Bibliotheken
- Bootstrap 5.02
- Preact
