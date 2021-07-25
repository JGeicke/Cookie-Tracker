import { Component, html, render } from '../assets/preact.js';

/**
 *  Component of the crawler settings.
 */
class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.setCheckboxes = this.setCheckboxes.bind(this);
        ipcRenderer.on('settings', this.setCheckboxes);
    }

    setCheckboxes(e, settings) {
        console.log("Loading previous settings");
        if (settings.UA_generic) {
            document.getElementById('user_generic').checked = true;
        }
        if (settings.UA_special) {
            document.getElementById('user_special').checked = true;
        }
        if (settings.DNT) {
            document.getElementById('dntHeader').checked = true;
        }
        if (settings.GPC) {
            document.getElementById('gpcHeader').checked = true;
        }
        if (settings.Breadth) {
            document.getElementById('breadth').checked = true;
        }
        if (settings.Single) {
            document.getElementById('single-page').checked = true;
        }
    }

    saveButtonClicked() {
        var useragent_generic = document.getElementById('user_generic').checked ? true : false;
        var useragent_special = document.getElementById('user_special').checked ? true : false;
        var DNT_status = document.getElementById('dntHeader').checked ? true : false;
        var GPC_status = document.getElementById('gpcHeader').checked ? true : false;
        var breadth_status = document.getElementById('breadth').checked ? true : false;
        var singlepage_status = document.getElementById('single-page').checked ? true : false;
        //console.log('UA generic:' + useragent_generic + ' UA special: ' + useragent_special + ' DNT: ' + DNT_status + ' GPC: ' + GPC_status);
        ipcRenderer.invoke('saveButtonClicked', useragent_generic, useragent_special, DNT_status, GPC_status, breadth_status, singlepage_status);
    }

    /** render the html elements*/
    render() {
        return html`
        <div class="container-fluid">
            <strong class="mb-0">User Agent</strong>
            <p>Select the type of user agent used by the crawler.</p>
            <div class="list-group mb-4 shadow">
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            Generic
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="user_generic"/>
                        </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            Special
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="user_special"/>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-4" />
            <strong class="mb-0">Header</strong>
            <p>Select the headers used in the requests by the crawler.</p>
            <div class="list-group mb-3 shadow">
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            DNT-Header
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" name="header" type="radio" id="dntHeader"/>
                        </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            GPC-Header
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" name="header" type="radio" id="gpcHeader"/>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-4" />
            <strong class="mb-0">Crawl Behaviour</strong>
            <p>Set the behaviour of the crawler.</p>
            <div class="list-group mb-3 shadow">
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            Breadth
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="behaviour" id="breadth" value="breadth"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            Single Page
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="behaviour" id="single-page" value="single-page"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row align-items-center mb-3">
                <div class="col-sm-4 text-center"></div>
                <div class="col-sm-4 text-center">
                    <button type="button" onclick=${this.saveButtonClicked} class="btn btn-primary shadow-none">Save</button>
                </div>
                <div class="col-sm-4 text-center"></div>
            </div>
        </div>
        `;
    }
}
render(html`<${SettingsPage} />`, document.body);