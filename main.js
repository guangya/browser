const { app, BrowserWindow } = require('electron');

if(require('electron-squirrel-startup')) {
    return app.quit();
}

const { updateElectronApp } = require('update-electron-app');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            webviewTag: true
        }
    })
  
    win.loadFile('index.html');
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    checkUpdates();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

/**
 * 版本检测
 * @returns Promise
 */
function checkUpdates() {
    return new Promise((resolve, reject) => {
        // Electron 官方手册用法：require('update-electron-app')()
        // 会报错：TypeError: require(...) is not a function，新版的导出内容不一样了
        updateElectronApp();
    });
}