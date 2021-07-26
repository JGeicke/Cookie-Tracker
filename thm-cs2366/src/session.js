/**
 * Class representing a crawler session.
 */
class Session {

		/**
		 * Evaluate the current results of the session that will be displayed in the chart.
		 * @param session - current session
		 * @param scope - scope ('all' or specific domain)
		 * @returns {(number|number)[]|number[]} - return the results to be displayed in the chart
		 */
		evaluateSession(session, scope){
				let persistentCookies = 0;
				let trackingCookies = 0;
				let sessionCookies = 0;

				let domains;

				// evaluate every domain
				if(scope === 'all'){
						domains = Object.keys(session.results);
				} else {
						// evaluate specific domain
						domains = [scope];
				}

				// iterate domain keys and add cookies
				domains.forEach((domain) => {
						// get cookie count for domain
						let sessionCookiesCount = Object.keys(session.results[domain].sessionCookies).length;
						let trackingCookiesCount = Object.keys(session.results[domain].trackingCookies).length;
						let persistentCookiesCount = Object.keys(session.results[domain].persistentCookies).length;

						// add cookie count together
						persistentCookies += persistentCookiesCount;
						trackingCookies += trackingCookiesCount;
						sessionCookies += sessionCookiesCount;

						console.log('session ' + sessionCookiesCount);
						console.log('persistent ' + persistentCookiesCount);
						console.log('tracking ' + trackingCookiesCount);
				});

				// check if no cookies in session found
				if((persistentCookies+sessionCookies+trackingCookies)< 1){
						return [0,0,0,1];
				}

				// return cookie evaluation
				return [persistentCookies, sessionCookies, trackingCookies, 0];
		}

		/**
		 * Create a new session object.
		 * @param {*} url - First url to add to session
		 * @returns new session object
		 */
		createSession(url) {
				try {
						new URL(url);
						return {
								start: new Date(),
								end: '',
								urls: [url],
								urls_done: [],
								results: {}
						};
				} catch (err) {
						console.log('Not a url. Aborting...!');
						return undefined;
				}
		}

		/**
		 * Parse the result input & create a session based on it.
		 * Add the url input to the session if the url has not been explored yet.
		 * @param {*} url - url input
		 * @param {*} result - json result input of a session
		 * @returns new session based on result
		 */
		continueSession(url, result) {
				let session = result;
				try {
						if (url && !session.urls_done.includes(url) && !session.urls.includes(url)) {
								session.urls.push(url);
						} else {
								console.log('no url defined or already visited.');
						}

						// check parsed session
						if (this.checkParsedSession(session)) {
								return session;
						}
						// abort later if session is undefined
						return undefined;
				} catch (err) {
						console.error(err);
						console.log('Illegal session\nStarting new session...');
						if (url) {
								session = this.createSession(url);
								return session;
						}
						// abort later if session is undefined
						return undefined;
				}
		}

		/**
		 * Check if parsed session matches the needed session structure
		 * @param {*} session - parsed session to check
		 * @returns if the session matches the needed structure
		 */
		checkParsedSession(session) {
				let neededAttrs = ['start', 'end', 'urls', 'urls_done'];
				let neededResultAttrs = ['persistentCookies', 'sessionCookies', 'trackingCookies'];

				// check needed outer attributes
				for (let i = 0; i < neededAttrs.length; i++) {
						if (session[neededAttrs[i]] === undefined) {
								return false;
						}
				}
				// check results
				let res = session['results'];
				console.log(res);
				if (res === undefined) {
						return false;
				}

				// check needed result domain objects
				let resultDomainObjects = Object.keys(res);
				for (let i = 0; i < resultDomainObjects.length; i++) {
						// get result domain object
						let resultDomainObject = res[resultDomainObjects[i]];

						// iterate needed attributes of result domain object
						for (let k = 0; k < neededResultAttrs.length; k++) {
								if (resultDomainObject[neededResultAttrs[k]] === undefined) {
										return false;
								}
						}
				}
				return true;
		}
}
module.exports = new Session();