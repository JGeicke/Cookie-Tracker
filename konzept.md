# __CS2366 Datenschutz und Datensicherheit Projekt__
## __Thema:__ External Domains auf Cookies oder DNT überprüfen

## __Konzept:__
- Änderung des Crawlers zu Breitensuche
    - Die Startseite einer Webseite wird nach externen Ressourcen untersucht.
    - Werden keine Ressourcen gefunden, wird die Webseite entsprechend so lange untersucht bis eine externe Ressource gefunden wurde.
- Webseiten werden auf Initial-Cookies & auf DNT Header geprüft
    - Jede Webseite wird demnach zwei Mal aufgerufen.
        - DNT: true/false
- Browser Fingerprint soll dabei berücksichtigt werden:
    - zwei unterschiedliche Modi:
        - Durchschnittlicher Fingerprint
        - Spezieller Fingerprint
- Darstellung der Ergebnisse mit Charts
    - Anteil der Webseiten mit Initialcookies
    - Anteil der Webseiten, die DNT respektieren
        - überhaupt prüfbar?

