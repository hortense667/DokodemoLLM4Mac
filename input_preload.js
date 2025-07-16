const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('inputAPI', {
  getHistory: () => ipcRenderer.invoke('get-history'),
  submitInput: (userPrompt) => ipcRenderer.invoke('submit-input', userPrompt),
  cancelInput: () => ipcRenderer.invoke('cancel-input'),
  onSetHistory: (callback) => ipcRenderer.on('set-history', callback)
});
