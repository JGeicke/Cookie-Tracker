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
      backgroundColor: '#0ae80a',
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
        e.sender.send('htmlReceived', JSON.stringify(session, null, 2));
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
}
const main = new Main();
