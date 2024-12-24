const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('browser', {
    ipcRenderer: ipcRenderer
});