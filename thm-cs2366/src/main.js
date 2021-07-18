const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { SmartCrawlerMenu } = require('./menu.js');
const { SmartCrawler } = require('./crawler.js');

/** Main class to initialize the window & control the flow of the application */
class Main {

  constructor() {
    app.on('activate', this.onActivate.bind(this));
    app.on('ready', this.onReady.bind(this));
    app.on('window-all-closed', this.onAllWindowsClosed.bind(this));

    ipcMain.handle('buttonClicked', this.onButtonClicked);
    ipcMain.handle('abortButtonClicked', this.onAbortButtonClicked);
    ipcMain.handle('settingsButtonClicked', this.onSettingsButtonClicked);
    ipcMain.handle('detailsButtonClicked', this.onDetailsButtonClicked);
  }

  /**
   * Creates a new application window.
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
      icon: path.join(__dirname, '../assets/icons/png/64x64.png'),
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
  }

    /**
     * Event handler to handle the "ready" event when the DOM is ready.
     * Creates a new application window & set the application menu.
     */
    onReady() {
      SmartCrawlerMenu.set();
      this.createWindow();
    }

    /**
     * Event handler to handle the "activate" event when app was activated.
     * The app is being activate on start-up and when the taskbar icon is pressed.
     */
    onActivate() {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    }

    /**
     * Event handler to quit the application when all windows are closed if the application is not run on macOS.
     */
    onAllWindowsClosed() {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    }

    /**
     * Event handler to handle the "click" event when the button was clicked.
     * @param {any} e - reference to the event
     * @param {string} input - input of input field
     * @param {any} result - input of textarea
     */
     async onButtonClicked(e, input, result) {
      try{
        let session;
        if(result){
          session = SmartCrawler.continueSession(input, result);
        } else if(input !== undefined){
          session = SmartCrawler.createSession(input);
        }else {
          throw new Error('Input & Result were undefined');
        }
        console.log(`start crawling`);
        if(session === undefined){
          console.log('Session is undefined\nAborting...!');
          return;
        }
        session = await SmartCrawler.crawl(e, session);

        // display result in frontend
        e.sender.send('resultReceived', session);
      }catch(err){
        console.error(err);
      }
    }

    /**
     * Abort the crawling session.
     * @param {*} e - reference to event
     */
    onAbortButtonClicked(e){
      SmartCrawler.abortSession();
    }

  /**
   * Open new settings modal window
   * @param {*} e - reference to event
   */
  onSettingsButtonClicked(e){
      console.log('settings clicked');
      let parent= BrowserWindow.getFocusedWindow();
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
        icon: path.join(__dirname, '../assets/icons/png/64x64.png'),
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
        child.show()
      });
    }

  /**
   * Open new details modal window
   * @param {*} e - reference to event
   */
  onDetailsButtonClicked(e, title, cookies){
    console.log('details clicked');
    let parent= BrowserWindow.getFocusedWindow();
    // create new child window
    const child = new BrowserWindow({
      width: 500,
      height: 460,
      useContentSize: true,
      minimizable: false,
      resizable: false,
      fullscreenable: false,
      show: false,
      autoHideMenuBar: true,
      parent: parent,
      icon: path.join(__dirname, '../assets/icons/png/64x64.png'),
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
      console.log('main...' + title +' '+ cookies);
      child.webContents.send('detailsReceived', title, cookies);
    });
  }
}
const main = new Main();
