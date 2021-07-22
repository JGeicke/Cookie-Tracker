const jetpack = require('fs-jetpack');
const session = require('../src/session.js');
import DetailsPage from './details.js';
import { h, Component, html, render } from '../assets/preact.js';


/**Welcome page when the app is started */
class WelcomePage extends Component {
  /**
   * whether the load/save dialogue is currently opened.
   * @type {boolean}
   */
  dialogOpened = false;

  /**
   * session results.
   */
  result;

  /**
   * reference to the chart element.
   */
  chart;

  /**Create new welcome page component */
  constructor(props) {
    super(props);

    this.clickButton = this.clickButton.bind(this);
    this.htmlReceived = this.htmlReceived.bind(this);
    this.abortSession = this.abortSession.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onStarted = this.onStarted.bind(this);
    this.loadJsonResult = this.loadJsonResult.bind(this);
    this.saveJsonResult = this.saveJsonResult.bind(this);
    this.settingsClicked = this.settingsClicked.bind(this);
    this.detailsClicked = this.detailsClicked.bind(this);
    this.toggleLog = this.toggleLog.bind(this);
    this.resultReceived = this.resultReceived.bind(this)
    this.showCrawlView = this.showCrawlView.bind(this);
    this.changeChart = this.changeChart.bind(this);

    ipcRenderer.on('htmlReceived', this.htmlReceived);
    ipcRenderer.on('resultReceived', this.resultReceived);
    ipcRenderer.on('onStarted', this.onStarted);

    this.result = null;
  }

  /**
   * Render the chart view when the session is done or was canceled.
   * @param event - reference to the event
   * @param data - session result data
   */
  resultReceived(event, data){
    //store result
    this.result = data;

    // create options for selection
    let domains = Object.keys(data.results);
    let domainHTML = [];
    domains.forEach((domain) => {
      domainHTML.push(html`<option value=${domain}>${domain}</option>`);
    });

    // clear header
    document.getElementById('content').innerHTML = '';

    // render charts in content
    render(html`
      <div class="row mb-3">
      </div>
      <div class="row">
        <div class="col-sm-4 text-center">
          <p>Domains:</p>
          <select id="domainSelection" class="form-select" aria-label="Select domain to display" onchange="${this.changeChart}">
            <option value="all" selected>All domains</option>
            ${domainHTML}
          </select>
          <button class="btn prim-btn shadow-none mt-4" onClick=${this.detailsClicked}>
            <img class="icon" src="../assets/bootstrap/bootstrap-icons-1.5.0/info-circle-fill.svg"/>
             Details
          </button>
        </div>
        <div id="chart-container" class="col-sm-8 align-self-center pb-2" style="min-height: 250px; max-height:300px;">
          <div style="width: 100%; height:80%">
            <canvas id="chart" style="width=100; height=100"></canvas>
          </div>
        </div>
    </div>
      <div class="row"></div>
    `, document.getElementById('content'));

    // render new header
    render(html`
    <div class="col-sm-3 text-center">
      <div class="row">
        <div class="col-sm">
          <button title="Go back" type="button" class="btn prim-btn shadow-none" onClick=${this.showCrawlView}>
            <img class="icon" src="../assets/bootstrap/bootstrap-icons-1.5.0/arrow-left-circle-fill.svg"/>
          </button>
        </div>
        <div class="col-sm">
        </div>
        <div class="col-sm">
        </div>
      </div>
    </div>
    <div class="col-sm-6 text-center">
      <h3>Results</h3>
    </div>
    <div class="col-sm-3 text-center"></div>
    `, document.getElementById('header'));

    // create chart script
    this.generateChart(data, 'all');
  }

  /**
   * Change view to the standard crawler view.
   */
  showCrawlView(){
    console.log('return');
    // reset content
    document.body.innerHTML = '';

    // render crawler view
    render(this.render(), document.body);
  }

  /**
   * Create and display the chart element.
   * @param data - data to create the chart off
   * @param scope - scope (all/domain) to evaluate the data with
   */
  generateChart(data, scope){
    // evaluate session
    let evaluation = session.evaluateSession(data, scope);

    // create chart
    const chartInput = {
      labels: [
        'Persistent',
        'Session',
        'Tracking',
        'No Cookies found'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [evaluation[0], evaluation[1], evaluation[2], evaluation[3]],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(80,80,80)'
        ],
        hoverOffset: 4
      }]
    };

    const config = {
      type: 'doughnut',
      data: chartInput,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'rgba(255,255,255,1.0)'
            },
            position: 'right'
          },
        }
      }
    };

    this.chart = new Chart(
        document.getElementById('chart'),
        config
    );
  }

  /**
   * Update the exisiting chart element.
   * @param data - data to update the chart with
   * @param scope - scope (all/domain) to evaluate the data with
   */
  updateChart(data, scope){
    // evaluate session
    let evaluation = session.evaluateSession(data, scope);

    let index = 0;

    // update data in chart
    this.chart.data.datasets.forEach((dataset) => {
      dataset.data.splice(0, 4);
      dataset.data.push(evaluation[index++]);
      dataset.data.push(evaluation[index++]);
      dataset.data.push(evaluation[index++]);
      dataset.data.push(evaluation[index++]);
    });

    //update chart
    this.chart.update();
  }

  /**
   * Change and update the chart to display the results of the selected domain.
   */
  changeChart(){
    console.log('change chart');
    let key = document.getElementById('domainSelection').value;
    this.updateChart(this.result, key);
  }

  /**
   * Workaround to toggle the url log.
   */
  toggleLog(){
    console.log('click');
    this.test = !this.test;
    if(this.test){
      console.log('active');
    }
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

  /**Event handler to handle the "onStarted" event when the crawler was started. */
  onStarted(event){

    // render spinner
    render(html`
    <div class="spinner-grow" role="status">
      <span class="sr-only"></span>
    </div>
    <div class="mt-2">
      <strong>Crawling...</strong>
    </div>
  `, document.getElementById('spinner'));
  }

  /**Event handler to handle the "onClick" event.*/
  clickButton() {
    console.log('Button clicked in UI!', this.state.input);
    ipcRenderer.invoke('buttonClicked', this.state.input, this.result);
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
        let input = jetpack.read(path, 'jsonWithDates');
        console.log(input);
        this.result = input;
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
      // check if result
      if(this.result === null){
        console.log('no result to save');
        return;
      }
      try{
        jetpack.writeAsync(path, this.result);
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

  /** Settings button handler*/
  settingsClicked(){
    ipcRenderer.invoke('settingsButtonClicked');
  }

  /** Settings button handler*/
  detailsClicked(){
    // domain key to display the details for
    let key = document.getElementById('domainSelection').value;
    let cookies;
    if(key === 'all'){
      cookies = this.result.results;
    } else{
      // get cookies of domain
      cookies = this.result.results[key];
    }

    console.log(this.result.results);
    ipcRenderer.invoke('detailsButtonClicked', key, cookies);
  }

  /** render the html elements*/
  render() {
    return html`
      <div class="container-fluid" id="root">
        <div class="row mb-3 mt-3" id="header">
          <div class="col-sm-3 text-center">
            <div class="row">
              <div class="col-sm">
                <button title="Settings" type="button" class="btn prim-btn shadow-none" onClick=${this.settingsClicked}>
                  <img class="icon" src="../assets/bootstrap/bootstrap-icons-1.5.0/gear-fill.svg"/>
                </button>
              </div>
              <div class="col-sm">
                <button title="Load session" type="button" class="btn prim-btn shadow-none" onClick=${this.loadJsonResult}>
                  <img class="icon" src="../assets/bootstrap/bootstrap-icons-1.5.0/folder-fill.svg"/>
                </button>
              </div>
              <div class="col-sm">
                <button title="Save session" type="button" class="btn prim-btn shadow-none" onClick=${this.saveJsonResult}>
                  <img class="icon" src="../assets/bootstrap/bootstrap-icons-1.5.0/file-earmark-fill.svg"/>
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-6 text-center">
          </div>
          <div class="col-sm-3 text-center">
            <div class="row">
              <div class="col-sm text-center">
                <button title="Start session" type="button" class="btn prim-btn shadow-none" onClick=${this.clickButton}>Start</button>
              </div>
              <div class="col-sm text-center">
                <button title="Stop session" type="button" class="btn prim-btn shadow-none" onClick=${this.abortSession}>Stop</button>
              </div>
            </div>
          </div>
        </div>
        <div id="content" class="container">
          <div class="row mb-5">
            <div class="col-sm-2 text-center"></div>
            <div class="col-sm-8 text-center" id="spinner"></div>
            <div class="col-sm-2 text-center"></div>
          </div>
        <div class="row mb-5">
          <div class="col-sm-2 text-center"></div>
          <div class="col-sm-8 text-center">
            <div class="input-group mb-2">
              <div class="input-group-prepend text-center">
                <div class="input-group-text">URL</div>
              </div>
              <input type="text"  class="form-control" id="inlineFormInputGroup" placeholder="URL" value=${this.state.input} onInput=${this.onInput} onkeyup=${this.onKeyUp}/>
            </div>
          </div>
          <div class="col-sm-2 text-center"></div>
        </div>
        <div class="row mb-2">
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick=${this.toggleLog}>
                  Log
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body log" id="log-container">
                  <textarea style="resize: none; width:100%;" rows="4" value=${this.state.html} readonly></textarea>
                </div>
              </div>
            </div>
            </div>
        </div>
        </div>
      </div>
    `;
  }
}
render(html`<${WelcomePage} />`, document.body);
