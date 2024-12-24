const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path')

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
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
  
    win.loadFile('index.html');
    if (!app.isPackaged) win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    checkUpdates();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on('main-window-close', confirmQuitApp);
});

async function confirmQuitApp() {
    let options = {
        title: '提示',
        type: 'warning',
        message: '确定要退出程序吗？',
        noLink: true,
        buttons: ['确定', '取消'],
        defaultId: 1,
    };
    let result = await dialog.showMessageBox(options);
    if (result.response === 0) app.quit();
}

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