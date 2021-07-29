# Cookie Tracker
## Allgemein
Beim Cookie Tracker handelt es sich um eine Software zur Analyse von Webseiten bezüglich Cookies sowie dem Umgang der Website mit DNT-Header bzw. GPC-Header. Auch bietet die Software die Möglichkeit an zu prüfen, ob Websiten sich je nach User-Agent unterschiedlich verhalten.

## Installation
### Windows
Der Cookie Tracker kann über die entsprechende Cookie Tracker Executable (Cookie Tracker.exe) gestartet werden. Eine Installation ist nicht notwendig.

### MacOS
TODO

### Linux
TODO

## Bedienung
Nach Starten des Cookie Trackers gelangt man zunächst zur Hauptansicht.
Der Nutzer hat dabei die Möglichkeit eine bestehende Session zu laden oder eine neue Session mit einer URL zu beginnen.


Im Settings-Fenster kann der Nutzer das Verhalten des Cookie Tracker entsprechend anpassen.

Beim Starten des Vorgangs untersucht Cookie Tracker die ausstehenden URLs nach Cookies. Bereits untersuchte URLs werden im Log
für den Nutzer ausgegeben. Sollte der Vorgang unterbrochen werden oder der Cookie Tracker hat keine weiteren URLs, denen er folgen kann,
gelangt der Nutzer zur Darstellung der Ergebnisse mit Hilfe von Charts.

Zunächst werden dem Nutzer die Ergebnisse von allen untersuchten URLs präsentiert. Der Nutzer kann sich die Ergebnisse
von einzelne URLs darstellen lassen. Mit Hilfe des Dropdown-Menüs kann die Ergebnisse von allen bzw. einzelnen Domains detailliert
dargestellt bekommen.

Abgeschlossene oder pausierte Sessions lassen sich nach Belieben speichern und zu einem späteren Zeitpunkt fortsetzen. 
Auch eine pausierte bzw. gestoppte Session kann nach der Darstellung der Zwischenergebnisse weitergeführt werden.

## Einstellungen
### User Agent
__Standard__: Der Standard User Agent, welcher von Node.js HTTPS Libary verwendet wird.

__Custom__: Es wird der vom Nutzer eingetragene User Agent verwendet.

    
### Header
__DNT Header__: Es wird beim Request der veraltete DNT Header verwendet, um Tracking Cookies zu erlauben und zu ermitteln.
Der DNT Header wird seit 2019 nicht mehr weiter verfolgt durch fehlende Unterstützung und Adaption der Branche.

__GPC Header__: Es wird beim Request der neuere GPC Header verwendet, um Tracking Cookies zu erlauben und zu ermitteln.
Der GPC Header ist seit 2020 der geistige Nachfolger des DNT Headers.

### Crawler Behaviour
__Breadth__: Cookie Tracker untersucht Webseiten nach externen Links und geht zur Analyse der externen Webseiten über,
nachdem die aktuelle Webseite ausgewertet wurde.

__Single Page__: Cookie Tracker wertet nur die vom Nutzer eingebene Webseite aus und stoppt nach der vollständigen Auswertung.
## Entwicklerteam
Der Cookie Tracker wurde von Leon George & Jan Geicke als Projekt für das Modul "CS2366 Datenschutz und Datensicherheit" von Tobias Reimann an der Technischen Hochschule Mittelhessen im Sommersemester 2021 entwickelt.

## Bibliotheken
- Bootstrap
- Chart.js
- fs-jetpack
- JQuery
- PopperJS
- Preact
- set-cookie-parser



## Bekannte Bugs
- Manchmal kann es beim Wechseln von der Ergebnisdarstellung hin zur Hauptansicht zur einer Vermischung der beiden Ansichten kommen.
__Temporärer Workaround__: Crawler neustarten. 

## Icons Attribution
<div>Cookie Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

<div>Settings Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

<div>Main Icon made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>