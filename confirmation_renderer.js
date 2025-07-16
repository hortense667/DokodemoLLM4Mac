document.addEventListener('DOMContentLoaded', () => {
  const resultContainer = document.getElementById('resultContainer');
  const okButton = document.getElementById('okButton');
  const cancelButton = document.getElementById('cancelButton');
  
  // 結果を受信
  window.electronAPI.onSetResult((event, result) => {
    resultContainer.textContent = result;
  });
  
  // OKボタンのクリックイベント
  okButton.addEventListener('click', () => {
    window.electronAPI.confirmOk();
  });
  
  // CANCELボタンのクリックイベント
  cancelButton.addEventListener('click', () => {
    window.electronAPI.confirmCancel();
  });
  
  // エスケープキーでキャンセル
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      window.electronAPI.confirmCancel();
    }
  });
  
  // Enterキーでok
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      window.electronAPI.confirmOk();
    }
  });
});