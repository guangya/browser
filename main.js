const { app, BrowserWindow } = require('electron');



const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    win.loadFile('index.html');
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
        // 这个会报错：TypeError: require(...) is not a function
        require('update-electron-app').updateElectronApp();
    });
}