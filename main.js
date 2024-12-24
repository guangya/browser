const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const path = require('node:path')

if(require('electron-squirrel-startup')) {
    return app.quit();
}

const { updateElectronApp } = require('update-electron-app');

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.bounds;
    const win = new BrowserWindow({
        width: width,
        height: height,
        frame: false,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            webviewTag: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    
    // 等 DOM 元素 ready 之后再显示窗口，避免闪屏
    win.webContents.on('dom-ready', function() {
        win.show();
    });
    
    if (!app.isPackaged) win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    checkUpdates();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    ipcMain.on('window-min', windowMinListener);
    ipcMain.handle('window-max', windowMaxHandle);
    ipcMain.handle('window-restore', windowRestoreHandle);
    ipcMain.on('window-close', windowCloseListener);
});

function windowMinListener(event) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.minimize();
    event.returnValue = true;
    return true;
}

function windowMaxHandle(event) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.maximize();
    event.returnValue = true;
    return true;
}

function windowRestoreHandle(event) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.unmaximize();
    event.returnValue = true;
    return true;
}

async function windowCloseListener(event) {
    let options = {
        title: '提示',
        type: 'warning',
        message: '确定要退出程序吗？',
        noLink: true,
        buttons: ['确定', '取消'],
        defaultId: 1,
    };
    let result = await dialog.showMessageBox(options);
    if (result.response === 0) {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win.close();
    }
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