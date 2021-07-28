import { Component, html, render } from '../assets/preact.js';

/**
 * Component to display the detailed results
 */
class DetailsPage extends Component {

  /** Cookies to be displayed in detail */
  cookies;
  /**
   * Current scope (all or domain) of the displayed details
   * 
   * @type {string}
   */
  title = '';

  constructor(props) {
    super(props);
    this.detailsReceived = this.detailsReceived.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    ipcRenderer.on('detailsReceived', this.detailsReceived);
  }

  /**
   * Format the expiring date of persistent/tracking cookies
   * 
   * @param date date to be formated
   * @returns {string} formatted date
   */
  formatDateString(date) {
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

  renderAllDetails(cookies) {
    // get all domain keys
    let keys = Object.keys(cookies);

    // render title
    render(html`<h4 class="mb-0">All Domains</h4>`, document.getElementById('display-domain'));

    // render headers
    render(html`<tr><th scope="col">Domain</th><th scope="col">Name</th><th scope="col">Value</th></tr>`, document.getElementById('sessionCookie-header'));
    render(html`<tr><th scope="col">Domain</th><th scope="col">Name</th><th scope="col">Value</th><th scope="col">Expires</th></tr>`, document.getElementById('persistentCookie-header'));
    render(html`<tr><th scope="col">Domain</th><th scope="col">Name</th><th scope="col">Value</th><th scope="col">Expires</th></tr>`, document.getElementById('trackingCookie-header'));

    // result objects to be displayed
    let sessionCookieData = [];
    let persistentCookieData = [];
    let trackingCookieData = [];

    // iterate domains
    keys.forEach((key) => {
      let domain = key;

      console.log(key);

      // session cookies
      let sessionCookies = cookies[domain].sessionCookies;
      let cookieNames = Object.keys(sessionCookies);
      cookieNames.forEach((name) => {
        let value = sessionCookies[name].value;

        sessionCookieData.push(html`
								<tr>
										<td>${domain}</td>
                    <td>${name}</td>
                    <td>${value}</td>
								</tr>
						`);
      });

      // persistent cookies
      let persistentCookies = cookies[domain].persistentCookies;
      cookieNames = Object.keys(persistentCookies);
      cookieNames.forEach((name) => {
        let value = persistentCookies[name].value;
        let date = persistentCookies[name].expires;

        let dateString = '';
        if (date) {
          // format date
          dateString = this.formatDateString(date);
        }

        persistentCookieData.push(html`
								<tr>
										<td>${domain}</td>
                    <td>${name}</td>
                    <td>${value}</td>
										<td>${dateString}</td>
								</tr>
						`);
      });

      // tracking cookies
      let trackingCookies = cookies[domain].trackingCookies;
      cookieNames = Object.keys(trackingCookies);
      cookieNames.forEach((name) => {
        let value = trackingCookies[name].value;
        let date = trackingCookies[name].expires;

        let dateString = '';
        if (date) {
          // format date
          dateString = this.formatDateString(date);
        }

        trackingCookieData.push(html`
                    <tr>
                        <td>${domain}</td>
                        <td>${name}</td>
                        <td>${value}</td>
                        <td>${dateString}</td>
                    </tr>
								`);
      });
    });

    // render session cookies
    render(sessionCookieData, document.getElementById('sessionCookie-body'));
    // render persistent cookies
    render(persistentCookieData, document.getElementById('persistentCookie-body'));
    // render tracking cookies
    render(trackingCookieData, document.getElementById('trackingCookie-body'));
  }

  /**
   * Handle 'detailsReceived' event and render the dom-elements to display the details
   * 
   * @param e event reference
   * @param title title or scope to display the details of
   * @param cookies cookies to display in detail
   */
  detailsReceived(e, title, cookies) {
    this.title = title;

    // check if specific domain or everything should be displayed
    if (this.title === 'all') {
      this.renderAllDetails(cookies);
      return;
    }

    this.cookies = cookies;

    // render title
    render(html`<h4 class="mb-0">${this.title.toString()} Details</h4>`, document.getElementById('display-domain'));

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
      if (date) {
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
      if (date) {
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
    console.log('render...' + this.title);
    return html`
        <div class="container-fluid">
            <hr class="my-3" />
            <div class="row text-center mt-2">
                <div id="display-domain" class="col-sm">
                </div>
            </div>
            <hr class="my-3" />
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
                                <thead id="persistentCookie-header">
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
                                <thead id="sessionCookie-header">
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
                                <thead id="trackingCookie-header">
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
            <div class="row text-center mt-3">
                <div class="col-sm">
                    <button type="button" class="btn btn-primary shadow-none" onClick=${this.closeWindow}>Close</button>
                </div>
            </div>
        </div>
        `;
  }

  /** close window*/
  closeWindow() {
    let window = remote.getCurrentWindow();
    window.close();
  }
}
render(html`<${DetailsPage} />`, document.body);
export default DetailsPage;