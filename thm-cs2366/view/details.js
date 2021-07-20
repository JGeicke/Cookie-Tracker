import { Component, html, render } from '../assets/preact.js';

/**
 * Component to display the detailed results.
 */
class DetailsPage extends Component{

		/**
		 * Cookies to be displayed in detail.
		 */
		cookies;
		/**
		 * Current scope (all or domain) of the displayed details.
		 * @type {string}
		 */
		title = '';

		constructor(props) {
				super(props);
				this.detailsReceived = this.detailsReceived.bind(this);
				ipcRenderer.on('detailsReceived', this.detailsReceived);
		}

		/**
		 * Format the expiring date of persistent/tracking cookies.
		 * @param date - date to be formated
		 * @returns {string} - formated date
		 */
		formatDateString(date){
				// format date
				let month = '' + (date.getMonth() + 1);
				let day = '' + date.getDate();
				let year = date.getFullYear();

				if (month.length < 2)
						month = '0' + month;
				if (day.length < 2)
						day = '0' + day;

				let hour = '' + date.getHours();
				let minutes = '' + date.getMinutes();

				if (hour.length < 2)
						hour = '0' + hour;
				if (minutes.length < 2)
						minutes = '0' + minutes;

				return '' + [day, month, year].join('-') + ' ' + hour + ':' + minutes;
		}

		/**
		 * Handle 'detailsReceived' event and render the dom-elements to display the details.
		 * @param e - event reference
		 * @param title - title or scope to display the details of
		 * @param cookies - cookies to display in detail
		 */
		detailsReceived(e, title, cookies){
				this.title = title;

				// check if specific domain or everything should be displayed
				if(this.title === 'all'){
						// get all domain keys
						let k = Object.keys(cookies);
						// create base structure of cookies
						this.cookies = {persistentCookies: {}, sessionCookies: {}, trackingCookies: {}};

						// iterate domains
						k.forEach((key) => {
								// get session cookies of domain
								let sessionCookies = cookies[key].sessionCookies;

								// iterate session cookie keys
								let k = Object.keys(sessionCookies);
								k.forEach((key) => {
										//add session cookies to displayed result
										this.cookies.sessionCookies[key] = sessionCookies[key];
								});

								// get persistent cookies of domain
								let persistentCookies = cookies[key].persistentCookies;

								// iterate persistent cookie keys
								k = Object.keys(persistentCookies);
								k.forEach((key) => {
										//add persistent cookies to displayed result
										this.cookies.persistentCookies[key] = persistentCookies[key];
								});

								// get tracking cookies of domain
								let trackingCookies = cookies[key].trackingCookies;

								// iterate tracking cookie keys
								k = Object.keys(trackingCookies);
								k.forEach((key) => {
										//add tracking cookies to displayed result
										this.cookies.trackingCookies[key] = trackingCookies[key];
								});
						});

						// TODO: handle multiple cookies with same name
				} else {
						this.cookies = cookies;
				}

				// render title
				render(html`<strong>${this.title.toString()}</strong>`, document.getElementById('display-domain'));

				// session cookies
				let keys = Object.keys(this.cookies.sessionCookies);
				let cookieData = [];
				keys.forEach((key) => {
						let value = this.cookies.sessionCookies[key].value;

						cookieData.push(html`
								<tr>
                    <td>${key}</td>
                    <td>${value}</td>
								</tr>
						`);
				});

				// render session cookies
				render(cookieData, document.getElementById('sessionCookie-body'));

				// persistent cookies
				keys = Object.keys(this.cookies.persistentCookies);
				cookieData = [];
				keys.forEach((key) => {
						let value = this.cookies.persistentCookies[key].value;
						let date = this.cookies.persistentCookies[key].expires;

						let dateString = '';
						if(date){
								// format date
								dateString = this.formatDateString(date);
						}

						cookieData.push(html`
                <tr>
									<td>${key}</td>
									<td>${value}</td>
									<td>${dateString}</td>
								</tr>
						`);
				});

				// render persistent cookies
				render(cookieData, document.getElementById('persistentCookie-body'));

				// tracking cookies
				keys = Object.keys(this.cookies.trackingCookies);
				cookieData = [];
				keys.forEach((key) => {
						let value = this.cookies.trackingCookies[key].value;
						let date = this.cookies.trackingCookies[key].expires;

						let dateString = '';
						if(date){
								// format date
								dateString = this.formatDateString(date);
						}

						cookieData.push(html`
                <tr>
									<td>${key}</td>
									<td>${value}</td>
									<td>${dateString}</td>
								</tr>
						`);
				});

				// render tracking cookies
				render(cookieData, document.getElementById('trackingCookie-body'));

		}

		/** render the html elements*/
		render() {
				console.log('render...'+this.title);
				return html`
        <div class="container-fluid">
            <strong class="mb-0">Details</strong>
            <div id="display-domain"></p>
            <div class="accordion" id="cookieAccordion">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Persistent Cookies
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#cookieAccordion">
                        <div class="accordion-body">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Expires</th>
                                </tr>
                                </thead>
                                <tbody style="font-size: 0.8rem" id="persistentCookie-body">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingTwo">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Session Cookies
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#cookieAccordion">
                        <div class="accordion-body">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Value</th>
                                </tr>
                                </thead>
                                <tbody style="font-size: 0.8rem" id="sessionCookie-body">
                                </tbody>
                            </table>                        
												</div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingThree">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Tracking Cookies
                        </button>
                    </h2>
                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#cookieAccordion">
                        <div class="accordion-body">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Value</th>
                                    <th scope="col">Expires</th>
                                </tr>
                                </thead>
                                <tbody style="font-size: 0.8rem" id="trackingCookie-body">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
		}
}
render(html`<${DetailsPage} />`, document.body);
export default DetailsPage;