class DomainResult {
  /**
    * Creates & fills a domain result object for the current domain.
    * @param {*} domain - current domain
    * @param {*} currentSession - current session object
    * @param {*} persistentCookies - parsed persistent cookies
    * @param {*} sessionCookies - parsed session cookies
    * @param {*} trackingCookies - detected tracking cookies
  */
  fillDomainResultObject(domain, currentSession, persistentCookies, sessionCookies, trackingCookies, dnt_persistent, dnt_session, dnt_tracking) {
    if (currentSession.results[domain] === undefined) {
      currentSession.results[domain] = {
        persistentCookies: persistentCookies,
        sessionCookies: sessionCookies,
        trackingCookies: trackingCookies,
        DNT_Cookies: {
          persistentCookies: dnt_persistent,
          sessionCookies: dnt_session,
          trackingCookies: dnt_tracking
        }
      };
    } else {
      // domain object was already created
      let domainResultObject = currentSession.results[domain];

      // add persistent cookies
      let names = Object.keys(persistentCookies);
      names.forEach(name => {
        domainResultObject['persistentCookies'][name] = persistentCookies[name];
      });

      // add session cookies
      names = Object.keys(sessionCookies);
      names.forEach(name => {
        domainResultObject['sessionCookies'][name] = sessionCookies[name];
      });

      // add tracking cookies
      names = Object.keys(trackingCookies);
      names.forEach(name => {
        domainResultObject['trackingCookies'][name] = trackingCookies[name];
      });

    }
  }
}
exports.DomainResult = new DomainResult();