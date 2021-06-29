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
            <div>
                <input type="radio" id="test" name="testradio" value="1" checked>
                <label for="test">Test1</label>
            </div>
            <div>
                <input type="radio" id="test2" name="testradio" value="2">
                <label for="test2">Test2</label>
            </div>
        </div>
        `;
    }
}

render(html`<${SettingsPage} />`, document.body);