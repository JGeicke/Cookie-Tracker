const { ipcRenderer } = require('electron');
import { Component, html, render } from '../assets/preact.js';

/**
 *  Component of the crawler settings.
 */
class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.setCheckboxes = this.setCheckboxes.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
        this.onInput = this.onInput.bind(this);
        this.toggleInput = this.toggleInput.bind(this);
        this.clearInput = this.clearInput.bind(this);
        ipcRenderer.on('settings', this.setCheckboxes);
    }

    /**
     * Sets the checkboxes according to previous settings
     * 
     * @param {*} e Reference to the event
     * @param {*} settings The settings object with all settings
     */
    setCheckboxes(e, settings) {
        console.log("Loading previous settings");
        document.getElementById('user_generic').checked = settings.Generic;
        document.getElementById('user_special').checked = settings.Special;
        document.getElementById('dntHeader').checked = settings.DNT;
        document.getElementById('gpcHeader').checked = settings.GPC;
        document.getElementById('breadth').checked = settings.Breadth;
        document.getElementById('single-page').checked = settings.Single;
    }
    /**
     * Send all settings to backend on save button click
     */
    saveButtonClicked() {
        var useragent_generic = document.getElementById('user_generic').checked ? true : false;
        var useragent_special = document.getElementById('user_special').checked ? true : false;
        var DNT_status = document.getElementById('dntHeader').checked ? true : false;
        var GPC_status = document.getElementById('gpcHeader').checked ? true : false;
        var breadth_status = document.getElementById('breadth').checked ? true : false;
        var singlepage_status = document.getElementById('single-page').checked ? true : false;
        //console.log('UA generic:' + useragent_generic + ' UA special: ' + useragent_special + ' DNT: ' + DNT_status + ' GPC: ' + GPC_status);
        ipcRenderer.invoke('saveButtonClicked', useragent_generic, useragent_special, this.state.input, DNT_status, GPC_status, breadth_status, singlepage_status);
        this.clearInput();
    }

    toggleInput() {
        if (document.getElementById('user_generic').checked) {
            document.getElementById('custom_ua').readOnly = true;
            console.log("Input should be readonly");
        } else {
            document.getElementById('custom_ua').readOnly = false;
            console.log("Input should not be readonly");
        }
    }

    onInput(event) {
        this.setState({
          input: event.target.value
        });
        console.log('Input changed: ', event.target.value);
      }

    clearInput(){
        this.setState({
          input: ''
        });
      }

    /** render the html elements*/
    render() {
        return html`
        <div class="container-fluid">
            <hr class="my-3" />
            <div class="row text-center mt-2">
                <div class="col-sm">
                    <strong class="mb-0">Cookie Tracker Settings</strong>
                </div>
            </div>
            <hr class="my-3" />
            <strong class="mb-0">User Agent</strong>
            <p>Select the type of user agent used by the crawler.</p>
            <div class="list-group mb-4 shadow">
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            Standard
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="user_generic" onClick=${this.toggleInput}/>
                        </div>
                    </div>
                </div>
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col">
                            <p class="mb-1">Custom</p>
                            <input type="text"  class="form-control" id="inlineFormInputGroup" onInput=${this.onInput} value=${this.state.input} readonly id="custom_ua" placeholder="Custom User Agent"/>
                        </div>
                        <div class="col-auto">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="user_special" onClick=${this.toggleInput}/>
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