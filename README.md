# Cookie Tracker
## Allgemein
Beim Cookie Tracker handelt es sich um eine Software zur Analyse von Webseiten bezüglich Cookies sowie dem Umgang der Website mit DNT-Header bzw. GPC-Header. Auch bietet die Software die Möglichkeit an zu prüfen, ob Websiten sich je nach User-Agent unterschiedlich verhalten.

## Installation
### Windows
Um den Cookie Tracker auf Windows zu starten, kann über die Releases die ensprechende Windows zip Datei heruntergeladen werden. Der Cookie Tracker kann dann über die entsprechende Cookie Tracker Executable (Cookie Tracker.exe) gestartet werden. Eine Installation ist nicht notwendig.

### MacOS
Um den Cookie Tracker auf Mac zu starten, kann über die Releases die darwin tar Datei heruntergeladen werden. Dort kann dann nach Entpacken der Datei, die App normal gestartet werden.

Achtung! Es wird wahrscheinich notwendig sein, der App Erlaubnis zu geben zu starten. Das kann in den Einstellungen auf dem Mac unter "Sicherheit" freigegeben werden.

### Linux
Linux wird aktuell nicht unterstützt.

## Bedienung
Nach Starten des Cookie Trackers gelangt man zunächst zur Hauptansicht.
Der Nutzer hat dort die Möglichkeit eine bestehende Session zu laden oder eine neue Session mit einer URL zu beginnen.


Im Settings-Fenster kann der Nutzer das Verhalten des Cookie Tracker entsprechend anpassen.

Beim Starten des Vorgangs untersucht der Cookie Tracker die ausstehenden URLs nach Cookies und prüft, wie die Website entsprechende Header (DNT/GPC) umsetzt. Bereits untersuchte URLs werden im Log
für den Nutzer ausgegeben. Sollte der Vorgang unterbrochen werden oder der Cookie Tracker keine weiteren URLs haben, denen er folgen kann,
gelangt der Nutzer zur Darstellung der Ergebnisse durch Diagramme.

Zunächst werden dem Nutzer die Ergebnisse von allen untersuchten URLs als Diagramm präsentiert. Der Nutzer kann sich jedoch auch die Ergebnisse
von einzelne Domains darstellen lassen. Mit Hilfe des Dropdown-Menüs kann der Nutzer einzelne Domains auswählen, wodurch die Ergebnisse detailliert in einem extra Fenster dargestellt werden.

Abgeschlossene oder pausierte Sessions lassen sich nach Belieben speichern und zu einem späteren Zeitpunkt fortsetzen. 
Auch eine pausierte bzw. gestoppte Session kann nach der Darstellung der Zwischenergebnisse weitergeführt werden.

Will der Nutzer eine neue Session beginnen, aber hat bereits eine Session gestartet gehabt, muss nach dem aktuellen Stand der Cookie Tracker neu gestartet werden.

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
