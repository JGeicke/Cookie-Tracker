class DomainResult{
     /**
     * Creates a new domain result object if no object exists for the domain.
     * @param {*} domain - current domain
      * @param {*} currentSession - current session object
     */
    createDomainResultObject(domain, currentSession){
        if(currentSession.results[domain] === undefined){
            currentSession.results[domain] = {
                persistentCookies: {},
                sessionCookies: {},
                trackingCookies: {}
            };
        }
    }
}
exports.DomainResult = new DomainResult();