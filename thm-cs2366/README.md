# Cookie Tracker
## Allgemein
Beim Cookie Tracker handelt es sich um eine Software zur Analyse von Webseiten hinsichtlich Cookies. Dabei kann der Benutzer zunächst eine Domain bezüglich __Cookies__ & dem Umgang mit __Do Not Track (DNT)-__ & __Global Privacy Control (GPC)-Header__ untersuchen. Während der Analyse erkennt der Cookie Tracker externe Links & folgt diesen nach Abschluss der Analyse. Dies wird so oft wiederholt, bis keine weiteren externen Links verfügbar sind oder der Nutzer den Vorgang unterbricht. Nach Abschluss oder Abbruch des Vorgangs werden die gesammelten Ergebnisse als Diagramme anschaulich präsentiert. Der Nutzer bekommt einen allgemeinen Überblick über den abgeschlossenen Vorgang, kann aber auch einzelne Domains bei Interesse genauer untersuchen & sich die Ergebnisse präsentieren lassen. Abgeschlossene oder abgebrochene Vorgänge lassen sich dabei ebenfalls zwischenspeichern & laden. Unterbrochene Vorgänge lassen sich somit zu einem späteren Zeitpunkt weiterführen.
## Bedienung
Um den Crawl-Vorgang starten zu können, hat man zunächst zwei Optionen:
- eine bestehende Session zu laden
- eine neue URL zum Analysieren in das __URL__ Feld einzutragen

Beide Optionen lassen sich dabei auch kombinieren (später dazu mehr).

Um eine bestehende Session zu laden, kann durch Klicken auf den __Load__ Button im unteren Bereich des Crawlers eine __JSON__-Datei geladen werden. Beim Laden der Datei wird geprüft, ob es die __JSON__ Datei eine gültige Session beinhaltet oder nicht.
Alternativ dazu kann in das __URL__ Feld eine URL eingetragen werden. Diese wird bei einer geladenen Session nur berücksichtigt, wenn die __URL__ zur __Domain__ der Session gehört. Wird keine Session geladen, wird eine neue Session mit der __URL__ erzeugt. Falls die __URL__ dabei ungültig ist, wird der Crawl-Vorgang frühzeitig abgebrochen. 

Durch Klicken auf den __Start__ Button im oberen Bereich des Crawlers wird der Crawl-Vorgang gestartet. Während dem Crawl-Vorgang werden bereits untersuchte __URLs__ im mittleren Feld ausgegeben. Der Crawl-Vorgang lässt sich jederzeit mit einem Klick auf den __Stop__ Button unterbrechen, wodurch das Ergebnis im mittleren Feld ausgegeben wird. Der Vorgang kann erneut durch Klicken auf den __Start__ Button weitergeführt werden.

Falls der Vorgang unterbrochen wird oder alle __URLs__ der Domäne erfolgreich untersucht wurden, wird im mittleren Feld das Ergebnis der Session ausgegeben. Dieses lässt sich durch Klicken auf den __Save__ Button im unteren Bereich des Crawlers in einer JSON-Datei speichern.

## Entwicklerteam
Der Cookie Tracker wurde von Leon George & Jan Geicke als Projekt für das Modul "CS2366 Datenschutz und Datensicherheit" von Tobias Reimann an der Technischen Hochschule Mittelhessen im Sommersemester 2021 entwickelt.
## Bibliotheken
- Bootstrap
- Preact
- JQuery
- PopperJS
- Chart.js

## Icons Attribution
<div>Cookie Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

<div>Settings Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

<div>Main Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>