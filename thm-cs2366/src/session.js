class Session {
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

				// return cookie evaluation
				return [persistentCookies, sessionCookies, trackingCookies];
		}
}
module.exports = new Session();