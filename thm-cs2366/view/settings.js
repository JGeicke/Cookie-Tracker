import { Component, html, render } from '../assets/preact.js';

/**
 *  Component of the crawler settings.
 */
class SettingsPage extends Component{
    constructor(props) {
        super(props);
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
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked/>
                        </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            Special
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"/>
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
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="dntHeader" checked />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            GPC-Header
                        </div>
                        <div class="col-auto">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="gpcHeader" />
                            </div>
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
                                <input class="form-check-input" type="radio" name="behaviour" id="behaviourRadios1" value="breadth" checked/>
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
                                <input class="form-check-input" type="radio" name="behaviour" id="behaviourRadios2" value="single-page"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row align-items-center mb-3">
                <div class="col-sm-4 text-center"></div>
                <div class="col-sm-4 text-center">
                    <button type="button" class="btn btn-primary shadow-none">Save</button>
                </div>
                <div class="col-sm-4 text-center"></div>
            </div>
        </div>
        `;
    }
}

render(html`<${SettingsPage} />`, document.body);