import { Component, html, render } from '../assets/preact.js';

class SettingsPage extends Component{
    constructor(props) {
        super(props);
    }

    /** render the html elements*/
    render() {
        // TODO wird fehlerhaft gerendert
        return html`
        <div class="container-fluid">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                <label class="form-check-label" for="flexRadioDefault1">
                    Default radio
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                <label class="form-check-label" for="flexRadioDefault2">
                    Default checked radio
                </label>
            </div>
        </div>
        `;
    }
}

render(html`<${SettingsPage} />`, document.body);