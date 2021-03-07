const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 900,
    height: 680,
    icon: path.join(__dirname, '/icons/512x512.png'),
  });
  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.maximize();
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});