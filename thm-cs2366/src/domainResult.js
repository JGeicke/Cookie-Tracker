/**
 * Class to represent the crawling results of each domain.
 */
class DomainResult{
     /**
     * Creates & fills a domain result object for the current domain.
     * @param {*} domain - current domain
      * @param {*} currentSession - current session object
      * @param {*} persistentCookies - parsed persistent cookies
      * @param {*} sessionCookies - parsed session cookies
      * @param {*} trackingCookies - detected tracking cookies
     */
    fillDomainResultObject(domain, currentSession, persistentCookies, sessionCookies, trackingCookies){
        if(currentSession.results[domain] === undefined){
            currentSession.results[domain] = {
                persistentCookies: persistentCookies,
                sessionCookies: sessionCookies,
                trackingCookies: trackingCookies
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