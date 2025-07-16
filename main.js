const { app, BrowserWindow, globalShortcut, clipboard, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let inputWindow;
let selectedText = ''; // 選択されたテキストを保存
let originalApp = ''; // 元のアプリケーション名を保存
let currentExecutable = ''; // 現在使用する実行ファイル名を保存
const historyFile = path.join(__dirname, 'input_history.json');

// 履歴を読み込む
function loadHistory() {
  try {
    if (fs.existsSync(historyFile)) {
      const data = fs.readFileSync(historyFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('履歴の読み込みエラー:', error);
  }
  return [];
}

// 履歴を保存する
function saveHistory(history) {
  try {
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('履歴の保存エラー:', error);
  }
}

// 履歴に新しい項目を追加
function addToHistory(text) {
  if (!text.trim()) return;
  
  let history = loadHistory();
  // 既存の項目があれば削除
  history = history.filter(item => item !== text);
  // 先頭に追加
  history.unshift(text);
  // 最大100件まで保持
  if (history.length > 100) {
    history = history.slice(0, 100);
  }
  saveHistory(history);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadFile('renderer.html');
}

function createInputWindow() {
  inputWindow = new BrowserWindow({
    width: 500,
    height: 150,
    show: false,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'input_preload.js')
    }
  });
  
  inputWindow.loadFile('input.html');
  
  // 画面中央に配置
  inputWindow.center();
  
  // ウィンドウが閉じられたときの処理
  inputWindow.on('closed', () => {
    inputWindow = null;
  });
}

function showInputWindow() {
  if (!inputWindow) {
    createInputWindow();
  }
  
  inputWindow.show();
  inputWindow.focus();
  
  // 履歴を送信
  const history = loadHistory();
  inputWindow.webContents.send('set-history', history);
  
  // 選択されたテキストも送信
  inputWindow.webContents.send('set-selected-text', selectedText);
}

// 現在のアクティブなアプリケーションを取得
function getCurrentApp() {
  return new Promise((resolve) => {
    const script = spawn('osascript', [
      '-e',
      'tell application "System Events" to get name of first application process whose frontmost is true'
    ]);
    
    let appName = '';
    script.stdout.on('data', (data) => {
      appName += data.toString().trim();
    });
    
    script.on('close', () => {
      resolve(appName);
    });
  });
}

function createConfirmationWindow(result) {
  return new Promise((resolve) => {
    console.log('確認ウィンドウを作成中...');
    
    // preloadファイルの存在確認
    const preloadPath = path.join(__dirname, 'confirmation_preload.js');
    const htmlPath = path.join(__dirname, 'confirmation.html');
    
    console.log('Preload file path:', preloadPath);
    console.log('HTML file path:', htmlPath);
    console.log('Preload file exists:', fs.existsSync(preloadPath));
    console.log('HTML file exists:', fs.existsSync(htmlPath));
    
    const confirmWindow = new BrowserWindow({
      width: 500,
      height: 200,
      show: false,
      alwaysOnTop: true,
      frame: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath
      }
    });
    
    confirmWindow.loadFile('confirmation.html').then(() => {
      console.log('HTMLファイルの読み込み成功');
    }).catch((error) => {
      console.error('HTMLファイルの読み込みエラー:', error);
    });
    
    // 画面中央に配置
    confirmWindow.center();
    
    // ウィンドウが準備できたら表示
    confirmWindow.once('ready-to-show', () => {
      console.log('確認ウィンドウを表示');
      confirmWindow.show();
      confirmWindow.focus();
      
      // 結果を送信
      setTimeout(() => {
        confirmWindow.webContents.send('set-result', result);
        console.log('結果を送信:', result);
      }, 100);
    });
    
    // ウィンドウが閉じられたときの処理
    confirmWindow.on('closed', () => {
      console.log('確認ウィンドウが閉じられました');
      resolve('cancel');
    });
    
    // IPCハンドラー（このウィンドウ専用）
    ipcMain.once('confirm-ok', () => {
      console.log('OK が押されました');
      confirmWindow.close();
      resolve('ok');
    });
    
    ipcMain.once('confirm-cancel', () => {
      console.log('CANCEL が押されました');
      confirmWindow.close();
      resolve('cancel');
    });
  });
}

// 結果を貼り付ける関数
function pasteResult(result) {
  return new Promise((resolve) => {
    console.log('貼り付け開始:', result);
    
    // 結果をクリップボードにセット
    clipboard.writeText(result.trim());
    
    // 元のアプリケーションをアクティブに
    const activateAndPaste = spawn('osascript', [
      '-e',
      `tell application "${originalApp}" to activate`,
      '-e',
      'delay 0.3'
    ]);
    
    activateAndPaste.on('close', (code) => {
      console.log('結果をClipboardに貼り付け完了:', code);
      resolve();
    });
    
    activateAndPaste.on('error', (error) => {
      console.error('貼り付けエラー:', error);
      resolve();
    });
  });
}

// ショートカットハンドラー関数
async function handleShortcut(executableName) {
  console.log(`Shortcut triggered for: ${executableName}`);
  
  // 現在のアプリケーションを取得
  originalApp = await getCurrentApp();
  console.log('元のアプリケーション:', originalApp);
  
  // 使用する実行ファイルを設定
  currentExecutable = executableName;
  
  // まずテキストを取得
  selectedText = clipboard.readText();
  
  // 入力ウィンドウを表示
  showInputWindow();
}

// IPCハンドラー
ipcMain.handle('get-history', () => {
  return loadHistory();
});

ipcMain.handle('submit-input', async (event, userPrompt) => {
  if (inputWindow) {
    inputWindow.hide();
  }
  
  // 履歴に追加
  addToHistory(userPrompt);
  
  // user_promptとselectedTextを結合
  const combinedText = `${userPrompt}---USER_TEXT---${selectedText}`;
  console.log('結合したテキスト:', combinedText);
  
  // 結合したテキストをクリップボードにセット
  clipboard.writeText(combinedText);
  
  // 実行ファイルのパスを決定
  const pyPath = path.join(__dirname, process.platform === 'win32' ? `${currentExecutable}.exe` : currentExecutable);
  console.log('実行ファイル:', pyPath);
  
  // ファイルの存在確認
  if (!fs.existsSync(pyPath)) {
    console.error('実行ファイルが見つかりません:', pyPath);
    return;
  }
  
  const py = spawn(pyPath);
  
  // プロセス起動エラーの処理
  py.on('error', (error) => {
    console.error('Python プロセス起動エラー:', error);
    return;
  });
  
  let result = '';
  
  // Pythonプロセスの標準出力を取得
  py.stdout.on('data', (data) => {
    result += data.toString();
  });
  
  // Pythonプロセスのエラー出力を取得
  py.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
  });
  
  py.on('close', async (code) => {
    console.log(`Python exit code: ${code}`);
    console.log('Python result:', result);
  
    if (result.trim()) {
      const userChoice = await createConfirmationWindow(result);
    
      if (userChoice === 'ok') {
        await pasteResult(result);
      } else {
        clipboard.writeText(selectedText);
        const activateAndPaste = spawn('osascript', [
          '-e',
          `tell application "${originalApp}" to activate`,
          '-e',
          'delay 0.3'
        ]);
        
        activateAndPaste.on('error', (error) => {
          console.error('元のテキスト貼り付けエラー:', error);
        });
      }
    }
  });
});

ipcMain.handle('cancel-input', () => {
  if (inputWindow) {
    inputWindow.hide();
  }
});

app.whenReady().then(() => {
  createWindow();
  
  // Command+Option+Shift+G でDokodemoLLMGをトリガー
  const registeredG = globalShortcut.register('CommandOrControl+Option+Shift+G', async () => {
    await handleShortcut('DokodemoLLMG');
  });
  
  // Command+Option+Shift+O でDokodemoLLMOをトリガー
  const registeredO = globalShortcut.register('CommandOrControl+Option+Shift+O', async () => {
    await handleShortcut('DokodemoLLMO');
  });
  
  if (!registeredG) {
    console.error('Global shortcut registration failed for DokodemoLLMG!');
  } else {
    console.log('Global shortcut registered for DokodemoLLMG (Cmd+Opt+Shift+G).');
  }
  
  if (!registeredO) {
    console.error('Global shortcut registration failed for DokodemoLLMO!');
  } else {
    console.log('Global shortcut registered for DokodemoLLMO (Cmd+Opt+Shift+O).');
  }
});

// アプリ終了時にショートカットを解除
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});