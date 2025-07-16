let history = [];
let historyIndex = -1;

const userInput = document.getElementById('userInput');
const okButton = document.getElementById('okButton');
const cancelButton = document.getElementById('cancelButton');

// 履歴を受信
window.inputAPI.onSetHistory((event, historyData) => {
  history = historyData;
  historyIndex = -1;
});

// 初期化時に履歴を取得
window.inputAPI.getHistory().then(historyData => {
  history = historyData;
  historyIndex = -1;
});

// IMEの状態を追跡
let isComposing = false;

// IME開始イベント
userInput.addEventListener('compositionstart', () => {
  isComposing = true;
  console.log('IME入力開始');
});

// IME終了イベント
userInput.addEventListener('compositionend', () => {
  isComposing = false;
  console.log('IME入力終了');
});

// キーボードイベント
userInput.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'Enter':
      // IME入力中（日本語変換中）の場合は無視
      if (isComposing) {
        console.log('IME入力中のEnterキーは無視');
        return;
      }
      e.preventDefault();
      submitInput();
      break;
      
    case 'Escape':
      e.preventDefault();
      cancelInput();
      break;
      
    case 'ArrowUp':
      // IME入力中でない場合のみ履歴ナビゲーション
      if (!isComposing) {
        e.preventDefault();
        navigateHistory('up');
      }
      break;
      
    case 'ArrowDown':
      // IME入力中でない場合のみ履歴ナビゲーション
      if (!isComposing) {
        e.preventDefault();
        navigateHistory('down');
      }
      break;
  }
});

// 履歴ナビゲーション
function navigateHistory(direction) {
  if (history.length === 0) return;
  
  if (direction === 'up') {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      userInput.value = history[historyIndex];
    }
  } else if (direction === 'down') {
    if (historyIndex > 0) {
      historyIndex--;
      userInput.value = history[historyIndex];
    } else if (historyIndex === 0) {
      historyIndex = -1;
      userInput.value = '';
    }
  }
  
  // カーソルを末尾に移動
  setTimeout(() => {
    userInput.selectionStart = userInput.selectionEnd = userInput.value.length;
  }, 0);
}

// 入力を送信
function submitInput() {
  const userPrompt = userInput.value.trim();
  if (userPrompt) {
    window.inputAPI.submitInput(userPrompt);
  }
}

// キャンセル
function cancelInput() {
  window.inputAPI.cancelInput();
}

// ボタンイベント
okButton.addEventListener('click', submitInput);
cancelButton.addEventListener('click', cancelInput);

// ウィンドウが表示されたときに入力フィールドにフォーカス
window.addEventListener('load', () => {
  userInput.focus();
});
