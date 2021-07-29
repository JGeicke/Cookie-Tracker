const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron');
const path = require('path');
const { SmartCrawlerMenu } = require('./menu.js');
const { SmartCrawler } = require('./crawler.js');
const Session = require('./session.js');
const jetpack = require('fs-jetpack');

/** 
 * Main class to initialize the window & control the flow of the application 
 */
class Main {
  constructor() {
    app.on('activate', this.onActivate.bind(this));
    app.on('ready', this.onReady.bind(this));
    app.on('window-all-closed', this.onAllWindowsClosed.bind(this));

    ipcMain.handle('buttonClicked', this.onButtonClicked);
    ipcMain.handle('abortButtonClicked', this.onAbortButtonClicked);
    ipcMain.handle('settingsButtonClicked', this.onSettingsButtonClicked);
    ipcMain.handle('detailsButtonClicked', this.onDetailsButtonClicked);
    ipcMain.handle('saveButtonClicked', this.onSaveButtonClicked);
    this.session = null;

    this.loadSettings();
  }

  /**
   * Load settings if config file is present
   */
  loadSettings(){
    let result = {};
    // check if config file exists
    if(jetpack.exists('settings.ini')){
      try{
        // load settings.ini
        let settings = jetpack.read('settings.ini');
        // split settings string
        const pairs = settings.split('\n');
        pairs.forEach((pair) => {
          if(!pair.startsWith('#')){
            pair = pair.trim();
            // check if pair is empty
            if(pair.length > 0){
              // split key value pair
              let keyValue = pair.split('=');

              // parse key value pair
              if(keyValue[0]==='USER-AGENT'){
                // parse user agent settings
                switch(keyValue[1]){
                  case '/':
                    result['Generic']=true;
                    result['Special']=false;
                    break;
                  default:
                    result['Generic']=false;
                    result['Special']=true;
                    result['custom_ua']=keyValue[1];
                    break;
                }
              }else if(keyValue[0]==='HEADER'){
                // parse header settings
                switch(keyValue[1]){
                  case '0':
                    result['DNT']=true;
                    result['GPC']=false;
                    break;
                  case '1':
                    result['DNT']=false;
                    result['GPC']=true;
                    break;
                  default:
                    console.error('unknown header value!');
                    return;
                }
              }else if(keyValue[0]==='MODE'){
                // parse mode settings
                switch(keyValue[1]){
                  case '0':
                    result['Breadth']=true;
                    result['Single']=false;
                    break;
                  case '1':
                    result['Breadth']=false;
                    result['Single']=true;
                    break;
                  default:
                    console.error('unknown mode value!');
                    return;
                }
              }else{
                console.error('unknown key for settings!');
              }
            }
          }
        });
        SmartCrawler.setSettings(result);
      }catch(err){
        console.error(err);
      }
    }
  }

  /**
   * Saves the settings in config file.
   * @param {*} ua_generic Generic user agent
   * @param {*} custom_ua The custom user agent string
   * @param {*} isDNT Do Not Track Header
   * @param {*} isBreadth Breadth search
   */
  static saveSettings(ua_generic, custom_ua, isDNT, isBreadth){
    // construct string to write
    let settingsToWrite = '';

    // add comments
    settingsToWrite = '# user agent used for request\n# / - Standard User Agent, else Cookie Tracker uses the supplied user agent.\n'

    // user agent
    if(ua_generic){
      //add generic user agent
      settingsToWrite = settingsToWrite + 'USER-AGENT=/';
    } else {
      //add custom user agent
      settingsToWrite = settingsToWrite + 'USER-AGENT=' + custom_ua;
    }

    // add comments
    settingsToWrite = settingsToWrite + '\n# header to use for tracking cookies\n# 0 = DNT-Header\n# 1 = GPC-Header\n';

    // header
    if(isDNT){
      //add dnt header
      settingsToWrite = settingsToWrite + 'HEADER=0';
    } else {
      //add gpc header
      settingsToWrite = settingsToWrite + 'HEADER=1';
    }

    // add comments
    settingsToWrite = settingsToWrite + '\n# crawler mode\n# 0 = breadth search - cookie tracker searches for external links, follows them and analyzes the website.\n# 1 = single page - cookie tracker just follows the supplied urls and analyzes the website. After the analysis was completed, cookie tracker stops.\n';

    // crawler mode
    if(isBreadth){
      //add breadth mode
      settingsToWrite = settingsToWrite + 'MODE=0';
    } else {
      //add single page mode
      settingsToWrite = settingsToWrite + 'MODE=1';
    }

    // write in config file
    try{
      jetpack.writeAsync('settings.ini', settingsToWrite, {mode: '700'});
    } catch(err){
      console.error(err);
    }
  }

  /**
   * Creates a new application window
   */
  createWindow() {
    this.win = new BrowserWindow({
      width: 800,
      height: 460,
      useContentSize: true,
      minimizable: false,
      resizable: false,
      fullscreenable: false,
      show: false,
      backgroundColor: '#c4c6c4',
      icon: path.join(__dirname, '../assets/icons/cookie-jar.png'),
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
      }
    });
    this.win.loadFile('view/welcome.html');

    this.win.once('ready-to-show', () => {
      this.win.show();
    });

    this.win.on('close', function(e){
      const choice = dialog.showMessageBoxSync(this,
          {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Are you sure you want to quit? All unsaved sessions will be lost!'
          });
      if(choice == 1){
        e.preventDefault();
      }
    });
  }

  /**
   * Event handler to handle the "ready" event when the DOM is ready
   * Creates a new application window & set the application menu
   */
  onReady() {
    SmartCrawlerMenu.set();
    this.createWindow();
  }

  /**
   * Event handler to handle the "activate" event when app was activated
   * The app is being activate on start-up and when the taskbar icon is pressed
   */
  onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  /**
   * Event handler to quit the application when all windows are closed if the application is not run on macOS
   */
  onAllWindowsClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  /**
   * Event handler to handle the "click" event when the button was clicked
   * 
   * @param {any} e reference to the event
   * @param {string} input input of input field
   * @param {any} result input of textarea
   */
  async onButtonClicked(e, input, result) {
    try {
      let session;
      if (result) {
        session = Session.continueSession(input, result);
        if (session === undefined) {
          e.sender.send('onAlert', 'Loaded session is not valid!');
          console.error('Session is undefined\nAborting...!');
          return;
        }
      } else if (input !== undefined) {
        session = Session.createSession(input);
        if (session === undefined) {
          e.sender.send('onAlert', 'Invalid URL!');
          return;
        }
      } else {
        console.error('Input & Result were undefined');
        // display error
        e.sender.send('onAlert', 'Please supply input or load exisiting session!');
        return;
      }
      session = await SmartCrawler.crawl(e, session);

      // display result in frontend
      e.sender.send('resultReceived', session);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Abort the crawling session
   * 
   * @param {*} e reference to event
   */
  onAbortButtonClicked(e) {
    SmartCrawler.abortSession();
  }

  /**
   * Open new settings modal window
   * 
   * @param {*} e reference to event
   */
  onSettingsButtonClicked(e) {
    let parent = BrowserWindow.getFocusedWindow();
    // create new child window
    const child = new BrowserWindow({
      width: 400,
      height: 460,
      useContentSize: true,
      minimizable: false,
      resizable: false,
      fullscreenable: false,
      show: false,
      autoHideMenuBar: true,
      parent: parent,
      icon: path.join(__dirname, '../assets/icons/setting.png'),
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
      }
    });

    // load setting html
    child.loadFile('view/settings.html');

    // show if ready
    child.once('ready-to-show', () => {
      child.show();
      child.webContents.send('settings', SmartCrawler.createSettings());
    });
  }

  /**
   * Sets the values given in the settings page
   *
   * @param {*} e Reference to the event
   * @param {*} ua_generic Generic user agent
   * @param {*} ua_special Special user agent
   * @param {*} custom_ua The custom user agent string
   * @param {*} isDNT Do Not Track Header
   * @param {*} isGPC GPC Header
   * @param {*} isBreadth Breadth search
   * @param {*} isSingle Single page search
   */
  onSaveButtonClicked(e, ua_generic, ua_special, custom_ua, isDNT, isGPC, isBreadth, isSingle) {
    SmartCrawler.isUaGeneric = ua_generic;
    SmartCrawler.isUaSpecial = ua_special;
    SmartCrawler.custom_ua = custom_ua;
    SmartCrawler.isDNT = isDNT;
    SmartCrawler.isGPC = isGPC;
    SmartCrawler.isBreadth = isBreadth;
    SmartCrawler.isSingle = isSingle;

    // save settings in config file
    Main.saveSettings(ua_generic, custom_ua, isDNT, isBreadth);
    // Close window on save button click
    BrowserWindow.getFocusedWindow().close();
  }

  /**
   * Open new details modal window
   * 
   * @param {*} e reference to event
   */
  onDetailsButtonClicked(e, title, cookies) {
    let parent = BrowserWindow.getFocusedWindow();
    // create new child window
    const child = new BrowserWindow({
      width: 600,
      height: 560,
      useContentSize: true,
      minimizable: false,
      resizable: false,
      fullscreenable: false,
      show: false,
      autoHideMenuBar: true,
      parent: parent,
      icon: path.join(__dirname, '../assets/icons/cookie.png'),
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
      }
    });
    // load setting html
    child.loadFile('view/details.html');

    // show if ready
    child.once('ready-to-show', () => {
      child.show()
      child.webContents.send('detailsReceived', title, cookies);
    });
  }
}
const main = new Main();