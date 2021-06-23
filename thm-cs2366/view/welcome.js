const jetpack = require('fs-jetpack');
import { Component, html, render } from '../assets/preact.js';

/**Welcome page when the app is started */
class WelcomePage extends Component {
  dialogOpened = false;

  /**Create new welcome page component */
  constructor(props) {
    super(props);

    this.clickButton = this.clickButton.bind(this);
    this.htmlReceived = this.htmlReceived.bind(this);
    this.abortSession = this.abortSession.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onResInput = this.onResInput.bind(this);
    this.loadJsonResult = this.loadJsonResult.bind(this);
    this.saveJsonResult = this.saveJsonResult.bind(this);

    ipcRenderer.on('htmlReceived', this.htmlReceived);
  }

  /**Event handler to handle the "htmlReceived" event.
   * Sets the html state to be rendered.
   */
  htmlReceived(event, data) {
    this.setState({
        html: data
    });
    console.log(event, data);
  }

  /**Event handler to handle the "onkeyup" event.*/
  onKeyUp(event){
    // keycode: 13='Enter' 
    if(event.keyCode === 13){
      this.clickButton();
    } else if(event.keyCode === 27){
      //keycode: 27='ESC'
      this.clearInput();
    }
  }

  /**Event handler to handle the "onInput" event for url input field. */
  onInput(event) {
    this.setState({
      input: event.target.value
    });
    console.log('Input changed: ', event.target.value);
  }

  /**Event handler to handle the "onResInput" event for result textarea. */
  onResInput(event) {
    this.setState({
      html: event.target.value
    });
    console.log('Result Input changed: ', event.target.value);
  }

  /**Event handler to handle the "onClick" event.*/
  clickButton() {
    console.log('Button clicked in UI!', this.state.input);
    ipcRenderer.invoke('buttonClicked', this.state.input, this.state.html);
    this.clearInput();
  }

  /** Load json file containing a session result */
  async loadJsonResult(){
    // check if another dialog is opened
    if(this.dialogOpened){
      return;
    }
    // set dialog
    this.dialogOpened = true;
    let options = {
      filters: [
        { name: 'All Files', extensions: ['*'] },
        {name: 'JSON', extensions: ['json']}
      ],
      properties: ['openFile']
    };
    // show load dialog
    let result = await dialog.showOpenDialog(options);

     // check if dialog was canceled
     if(!result.canceled){
      let path = result.filePaths[0];
      try{
        let input = jetpack.read(path);
        this.setState({
          html: input
        });
        console.log(this.state.html);
      } catch(err){
        console.error(err);
      }
    }
     // reset dialog
     this.dialogOpened = false;
  }

  /** Save json file containing with session result */
  async saveJsonResult(){
    // check if another dialog is opened
    if(this.dialogOpened){
      return;
    }
    // set dialog
    this.dialogOpened = true;
    let options = {
      filters: [
        { name: 'All Files', extensions: ['*'] },
        {name: 'JSON', extensions: ['json']}
      ]
    };
    // show save dialog
    let result = await dialog.showSaveDialog(options);

    // check if dialog was canceled
    if(!result.canceled){
      let path = result.filePath;
      try{
        jetpack.writeAsync(path, this.state.html);
      } catch(err){
        console.error(err);
      }
    }
    // reset dialog
    this.dialogOpened = false;
  }

  /**Clears the input state */
  clearInput(){
    this.setState({
      input: '',
      html: ''
    });
  }

  /** Aborts running session */
  abortSession(){
    console.log('Abort-Button clicked in UI!', this.state.input);
    ipcRenderer.invoke('abortButtonClicked', this.state.input);
  }

  /** render the html elements*/
  render() {
    return html`
    <div style="margin-left: auto;margin-right:auto; margin-top:25px; margin-bottom:15px; width: 40%;">
      <input type="text" placeholder="URL" value=${this.state.input} onInput=${this.onInput} onkeyup=${this.onKeyUp}/>
      <button onClick=${this.clickButton}>Start</button>
      <button onClick=${this.abortSession}>Stop</button>
    </div>
    <div style="width: 90%; margin: auto;">
      <textarea style="resize: none; height: 300px; width:100%;" onInput=${this.onResInput} value=${this.state.html} readonly></textarea>
    </div>
    <div style="margin: auto; width: 20%;">
      <button style="width: 30%; margin-right:5px; text-align: center;" onClick=${this.loadJsonResult}>Load</button>
      <button style="width: 30%; text-align: center;" onClick=${this.saveJsonResult}>Save</button>
    </div>
    `;
  }
}

render(html`<${WelcomePage} />`, document.body);