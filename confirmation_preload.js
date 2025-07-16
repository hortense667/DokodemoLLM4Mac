const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onSetResult: (callback) => ipcRenderer.on('set-result', callback),
  confirmOk: () => ipcRenderer.send('confirm-ok'),
  confirmCancel: () => ipcRenderer.send('confirm-cancel')
});