const { app, dialog, Menu, shell, Main, BrowserWindow } = require('electron');

/** Top menu for the application window. */
class SmartCrawlerMenuClass
{
  /** Creates a new top menu template depending on the platform the app is being run on.  */
  constructor()
  {
    const de = app.getLocale().toLocaleLowerCase().startsWith('de');
    const isMac = process.platform === 'darwin';
    this.template = [
      ...(isMac ? [{
          label: app.name,
          submenu: [
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
      }] : []),
      {
        label: de ? 'Datei' : 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' },
          { label: 'DevConsole', accelerator: 'F12', role: 'toggleDevTools'}
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]
      },
      {
        label: de ? 'Fenster' : 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          ...(isMac ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' }
          ] : [
                { role: 'close' }
              ])
        ]
      }
    ];
  }

  /** Initializes & sets the top menu of the application.  */
  set() {
    const menu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(menu);
  }
}

exports.SmartCrawlerMenu = new SmartCrawlerMenuClass(); 
