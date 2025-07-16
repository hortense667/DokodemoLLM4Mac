# DokodemoLLM4Mac
The Mac version of DodekodemoLLM
(c)2025 Satoshi Endo

DokodemoLLM is a utility application that runs on Mac. It provides powerful support for your tasks by allowing you to summon AI (such as OpenAI's GPT or Google's Gemini) with a single shortcut key while using various applications like email creation, document editing, and website browsing. The app prompts the AI based on the content of your clipboard and returns the results back to the clipboard.

DokodemoLLMは、Mac上で動作するユーティリティアプリケーションです。メール作成、ドキュメント編集、ウェブサイト閲覧など、様々なアプリケーションを使用中にショートカットキー一つでAI（OpenAIのGPTやGoogleのGemini）を呼び出し、クリップボードの内容に基づいてプロンプトを与え、その結果をクリップボードに返すことで、あなたの作業を強力にサポートします。

### DokodemoLLMとは？

DokodemoLLM is a tool that combines the prompt you input with the text currently copied to the clipboard, sends it to the AI for processing, and returns the result to the clipboard. This allows you to efficiently perform various tasks such as summarization, translation, paraphrasing, and brainstorming with the help of AI.

DokodemoLLMは、現在クリップボードにコピーされているテキストに対して、あなたが入力したプロンプトを組み合わせてAIに渡し、その処理結果を再びクリップボードに返すツールです。これにより、文章の要約、翻訳、言い換え、アイデア出しなど、様々なタスクをAIの力を借りて効率的に行うことができます。

### 使い方

1.  **処理したいテキストのコピー**: まず、AIに処理させたい文字列をMacのクリップボードにコピーします。
2.  **DokodemoLLMの起動**:
      * OpenAIのGPTを利用したい場合は、**Command (⌘) + Option (⌥) + Shift (⇧) + G** キーを押します。
      * GoogleのGeminiを利用したい場合は、**Command (⌘) + Option (⌥) + Shift (⇧) + O** キーを押します。
3.  **プロンプトの入力**: ショートカットキーを押すと、小さな入力ウィンドウが表示されます。このウィンドウに、クリップボードの内容に対してAIにどのような処理をしてほしいか、具体的なプロンプトを入力します。
      * **履歴機能**: 過去に入力したプロンプトは最大100件まで保存されており、上下カーソルキー（↑ ↓）で呼び出して再利用できます。
      * **実行**: プロンプトの入力が完了したら、`Enter` キーを押してAIに処理を依頼します。
      * **キャンセル**: 入力をキャンセルしたい場合は、`Esc` キーを押します。
4.  **結果の確認とクリップボードへの反映**: AIによる処理が完了すると、結果を確認するためのウィンドウが表示されます。
      * **クリップボードへコピー**: 表示された結果で問題なければ、「OK」ボタンをクリックするか、`Enter` キーを押します。AIから返された結果がクリップボードに設定されます。
      * **キャンセル**: AIの結果をクリップボードにコピーしたくない場合は、「CANCEL」ボタンをクリックするか、`Esc` キーを押します。この場合、DokodemoLLM起動時にクリップボードにあった元のテキストがそのまま保持されます。

### 使い始めるための設定

DokodemoLLMは、ソースコードのまま配布することを想定しています。以下の手順に従って設定を行ってください。

1.  **ファイルの配置**:
    ダウンロードしたDokodemoLLMのファイル一式（`main.js`, `package.json`, `confirmation.html`, `input_preload.js`, `input_renderer.js`, `input.html`, `confirmation_preload.js`, `renderer.html`, `confirmation_renderer.js`）と、AIを呼び出す実行ファイルである`DokodemoLLMG`および`DokodemoLLMO`を、任意のフォルダにまとめて配置します。
    例えば、`~/Documents/DokodemoLLM` のような分かりやすい場所に置いてください。
    なお、`DokodemoLLMG`および`DokodemoLLMO`は、ファイルサイズが大きいため一連の他のファイルと異なり「Releases」にアップロードされていますので、そちらからダウンロードしてください。`DokodemoLLMG.py`および`DokodemoLLMO.py`は、その元になるPythonのソースコードで実行するだけなら不要のものです。
    
3.  **Node.jsとnpmのインストール**:
    DokodemoLLMはElectronフレームワークを使用しており、Node.jsとnpm（Node Package Manager）が必要です。まだインストールしていない場合は、以下の手順でインストールしてください。

      * [Node.jsの公式サイト](https://nodejs.org/)からインストーラーをダウンロードし、指示に従ってインストールします。npmはNode.jsと共にインストールされます。
      * インストール後、ターミナルを開き、以下のコマンドを実行してバージョンを確認し、正しくインストールされていることを確認します。
        ```bash
        node -v
        npm -v
        ```

4.  **依存関係のインストール**:
    DokodemoLLMを配置したフォルダ（例: `~/Documents/DokodemoLLM`）にターミナルで移動し、必要な依存関係をインストールします。

    ```bash
    cd ~/Documents/DokodemoLLM
    npm install
    ```

    このコマンドは、`package.json`に記載されているElectronなどの依存関係をダウンロードしてインストールします。

5.  **実行ファイルのパーミッション設定（macOSの場合）**:
    `DokodemoLLMG`と`DokodemoLLMO`は実行ファイルであるため、実行権限が必要です。ターミナルで以下のコマンドを実行し、実行権限を付与してください。

    ```bash
    chmod +x bin/DokodemoLLMG
    chmod +x bin/DokodemoLLMO
    ```

6.  **セキュリティ設定（macOSの場合）**:
    macOSのセキュリティ機能により、ダウンロードした実行ファイルやスクリプトはそのままでは実行できない場合があります。

      * **Developer IDが未設定の場合**: もし`DokodemoLLMG`や`DokodemoLLMO`が署名されていない場合、初回実行時にmacOSのGatekeeperによってブロックされる可能性があります。その場合、「開発元を検証できないため開けません」のようなメッセージが表示されます。
        この場合、システム設定の「プライバシーとセキュリティ」から、ブロックされたアプリケーションの「このまま開く」ボタンをクリックして実行を許可する必要があります。
      * **フルディスクアクセス**: クリップボードへのアクセスや他のアプリケーションのアクティベートには、通常Electronアプリとして特別な設定は不要ですが、もし動作がおかしい場合は、「システム設定」\>「プライバシーとセキュリティ」\>「フルディスクアクセス」を確認し、DokodemoLLM（またはElectronアプリ）にアクセス権限を付与する必要があるかもしれません。ただし、通常はそこまで必要ありません。
      * **アクセシビリティ**: 他のアプリケーションのコントロールや、キーボードショートカットの登録には、「アクセシビリティ」の許可が必要になる場合があります。「システム設定」\>「プライバシーとセキュリティ」\>「アクセシビリティ」で、DokodemoLLMを許可されたアプリケーションのリストに追加する必要があるかもしれません。

7.  **DokodemoLLMの起動**:
    すべての設定が完了したら、ターミナルでDokodemoLLMのフォルダにいる状態で、以下のコマンドを実行してアプリケーションを起動します。

    ```bash
    npm start
    ```

    これによりDokodemoLLMがバックグラウンドで起動し、指定されたショートカットキーが有効になります。
    こののターミナル、およびターミナル上で実行されているプログラムは、本プログラムを使用する場合にはそのままにしておいてください。

    プログラムとしての設定は異常ですが、実際にLLMから答えをもらうには次に述べる「APIキー」の設定が必要となります。
    
### APIキーの設定

AIツールであるDokodemoLLMを利用するには、OpenAIとGoogle GeminiのAPIキーが必要です。これらのAPIキーを取得し、適切に環境変数として設定することで、DokodemoLLMが各AIサービスと連携できるようになります。

DokodemoLLMでは、有料版のOpenAIのAPIキーと無料版のGeminiのAPIキーを使い分けられます。なお、言語モデルは、現在のバージョンではOpenAIが「gpt-4o」、Geminiが「gemini-2.5-flash」を使用しています。有料版であるOpenAIの言語モデルの課金は従量制です。有料版といってもこのツールで使う程度であれば毎日頻繁に使ってもなかなか1カ月の課金が1000円を超えることはないと思われます。もちろん、使い方にもよるわけですがOpenAIのAPIキーはさまざまな活用ができるので、未取得の方は、この機会に取得されても良いともいます。

### OpenAI APIキーの取得と設定

OpenAIのGPTモデルを利用するためのAPIキーです。

1.  **OpenAIアカウントの作成**:
    まだOpenAIのアカウントを持っていない場合は、[OpenAIの公式サイト](https://platform.openai.com/signup) にアクセスし、アカウントを作成してください。

2.  **APIキーの作成**:

      * アカウントにログイン後、[API Keysページ](https://platform.openai.com/api-keys) にアクセスします。
      * 「Create new secret key」ボタンをクリックします。
      * キーの名前（例: `DokodemoLLM_key`）を入力し、「Create secret key」をクリックします。
      * 生成されたAPIキー（`sk-`で始まる文字列）を**必ずコピーしてください**。このキーは一度しか表示されません。もしコピーし忘れた場合は、再度新しいキーを生成する必要があります。

3.  **環境変数の設定**:
    取得したAPIキーを環境変数として設定します。DokodemoLLMは、`OPENAI_API_KEY`という環境変数からキーを読み込むように設計されています。

    Macで環境変数を設定する一般的な方法はいくつかあります。

      * **`.zshrc` または `.bashrc` ファイルに追加（推奨）**:
        ターミナルを開き、以下のコマンドを実行して設定ファイルを開きます（使用しているシェルによってファイル名が異なります。macOS Catalina以降のデフォルトはzshです）。

        ```bash
        # zshを使用している場合
        open -e ~/.zshrc

        # bashを使用している場合
        open -e ~/.bashrc
        ```

        開いたファイルの一番最後に以下の行を追加し、`your_openai_api_key_here`の部分をあなたが取得した実際のAPIキーに置き換えて保存します。

        ```bash
        export OPENAI_API_KEY="your_openai_api_key_here"
        ```

        ファイルを保存したら、以下のコマンドを実行して設定を反映させます。

        ```bash
        # zshを使用している場合
        source ~/.zshrc

        # bashを使用している場合
        source ~/.bashrc
        ```

        この方法で設定すると、新しいターミナルセッションを開いたとき、またはMacを再起動したときに自動的に環境変数が読み込まれます。

      * **一時的な設定（推奨されません）**:
        ターミナルでDokodemoLLMを起動する前に、以下のコマンドを実行することでも一時的に環境変数を設定できます。ただし、これはそのターミナルセッションの間のみ有効で、新しいセッションを開くと再度設定が必要です。

        ```bash
        export OPENAI_API_KEY="your_openai_api_key_here"
        npm start
        ```

### Google Gemini APIキーの取得と設定

Google Geminiモデルを利用するためのAPIキーです。

1.  **Google Cloud Projectの作成（または既存プロジェクトの利用）**:
    Google Gemini APIを利用するには、Google Cloudプロジェクトが必要です。

      * [Google Cloud Console](https://console.cloud.google.com/) にアクセスします。
      * 既存のプロジェクトを選択するか、新しいプロジェクトを作成します。

2.  **Generative Language APIの有効化**:

      * Google Cloud Consoleのナビゲーションメニューから「APIとサービス」\>「ライブラリ」を選択します。
      * 検索バーで「Generative Language API」を検索し、そのAPIページに移動します。
      * 「有効にする」ボタンをクリックして、APIをプロジェクトで有効にします。

3.  **APIキーの作成**:

      * Google Cloud Consoleのナビゲーションメニューから「APIとサービス」\>「認証情報」を選択します。
      * 「認証情報を作成」ドロップダウンメニューをクリックし、「APIキー」を選択します。
      * 新しいAPIキーが生成されます。生成されたキーを**必ずコピーしてください**。
      * 必要に応じて、APIキーの使用を制限（例: 特定のIPアドレスからのアクセスのみ許可、特定のAPIのみ許可）することができます。セキュリティのため、適切な制限を設定することを強く推奨します。

4.  **環境変数の設定**:
    取得したAPIキーを環境変数として設定します。DokodemoLLMは、`GEMINI_API_KEY`という環境変数からキーを読み込むように設計されています。

    OpenAIのAPIキーと同様に、`.zshrc`または`.bashrc`ファイルに以下の行を追加して設定することを推奨します。

    ```bash
    export GEMINI_API_KEY="your_gemini_api_key_here"
    ```

    `your_gemini_api_key_here`の部分を、あなたが取得した実際のAPIキーに置き換えて保存します。

    ファイルを保存したら、以下のコマンドを実行して設定を反映させます。

    ```bash
    # zshを使用している場合
    source ~/.zshrc

    # bashを使用している場合
    source ~/.bashrc
    ```

### 環境変数の確認

設定した環境変数が正しく読み込まれているかを確認するには、ターミナルで以下のコマンドを実行します。

```bash
echo $OPENAI_API_KEY
echo $GEMINI_API_KEY
```

設定したAPIキーが表示されれば、正しく設定されています。もし何も表示されない場合は、上記の手順を再度確認してください。

### セキュリティに関する注意

  * **APIキーは秘密に保つ**: APIキーはあなたの利用料金に直結する重要な情報です。絶対に公開された場所（GitHubなど）に直接書き込んだり、他人に教えたりしないでください。
  * **環境変数の利用**: APIキーを直接コードに書き込むのではなく、環境変数として設定することはセキュリティ上のベストプラクティスです。
  * **不要なAPIキーの削除**: 使用しなくなったAPIキーは、各プラットフォームの管理画面から削除することを検討してください。
  * **APIキーのローテーション**: 定期的にAPIキーを更新（新しいキーを生成し、古いキーを削除）することもセキュリティ対策として有効です。

これらの手順に従うことで、DokodemoLLMがOpenAIとGoogle GeminiのAIサービスと安全に連携できるようになります。


### 履歴ファイルについて

DokodemoLLMは、あなたが入力したプロンプトの履歴を保存します。この履歴は、アプリケーションが保存されているフォルダ内に`input_history.json`というファイル名で自動的に作成・更新されます。このファイルには、直近100件のプロンプトが保存されており、アプリケーションを再起動しても以前の履歴を利用することができます。

### 配布ファイルについて

DokodemoLLMは、以下のファイル群で配布します。

  * `main.js`
  * `package.json`
  * `confirmation.html`
  * `confirmation_preload.js`
  * `confirmation_renderer.js`
  * `input.html`
  * `input_preload.js`
  * `input_renderer.js`
  * `renderer.html`
  * `DokodemoLLMO` (AIを呼び出す実行ファイル)
  * `DokodemoLLMG` (AIを呼び出す実行ファイル)
  * `DokodemoLLMO.py` (DokodemoLLMOのソースコード)
  * `DokodemoLLMG.py` (DokodemoLLMGのソースコード)

ユーザーは上記の手順に従ってDokodemoLLMをセットアップし、実行することができます。なお、`input_history.json`はアプリケーションが自動生成するため、配布に含めていません。


### ショートカットキーの変更方法

DokodemoLLMのショートカットキーは、`main.js`ファイル内で設定されており、これを変更することで好みのショートカットキーを設定できます。

1.  **`main.js` ファイルを開く**:
    DokodemoLLMを配置したフォルダ内にある`main.js`ファイルをお好みのテキストエディタで開きます。

2.  **ショートカットキーの記述を探す**:
    ファイル内の以下の部分を探します。これはショートカットキーの登録を行っている箇所です。

    ```javascript
    // Command+Option+Shift+G でDokodemoLLMGをトリガー
    const registeredG = globalShortcut.register('CommandOrControl+Option+Shift+G', async () => {
      await handleShortcut('DokodemoLLMG');
    });

    // Command+Option+Shift+O でDokodemoLLMOをトリガー
    const registeredO = globalShortcut.register('CommandOrControl+Option+Shift+O', async () => {
      await handleShortcut('DokodemoLLMO');
    });
    ```

3.  **ショートカットキーを変更する**:
    `globalShortcut.register()`関数の第一引数に指定されている文字列がショートカットキーの設定です。この文字列をあなたの希望するキーの組み合わせに変更します。

    **変更例**:

      * `DokodemoLLMG`を **Control + Alt + P** に変更したい場合:
        `'CommandOrControl+Option+Shift+G'` を `'CommandOrControl+Alt+P'` に変更します。

    **利用可能なキー**:
    Electronで利用できるキーの修飾子とキーコードは以下の通りです。

      * **修飾子 (Modifier)**:

          * `Command` または `Cmd` (macOSのみ)
          * `Control` または `Ctrl`
          * `CommandOrControl` (macOSでは`Command`、Windows/Linuxでは`Control`として機能)
          * `Alt` または `Option` (macOSでは`Option`、Windows/Linuxでは`Alt`として機能)
          * `Shift`
          * `Super` (Windowsの`Windows`キー、Linuxの`Meta`キー)

      * **キーコード**:

          * 文字キー: `A`, `B`, `C`, ... `Z`
          * 数字キー: `0`, `1`, `2`, ... `9`
          * ファンクションキー: `F1`, `F2`, ... `F24`
          * 特殊キー: `Plus`, `Space`, `Tab`, `Capslock`, `Numlock`, `Scrolllock`, `PageUp`, `PageDown`, `Home`, `End`, `Delete`, `Insert`, `Escape`, `VolumeUp`, `VolumeDown`, `VolumeMute`, `MediaNextTrack`, `MediaPreviousTrack`, `MediaStop`, `MediaPlayPause`, `PrintScreen` など。
          * 矢印キー: `Up`, `Down`, `Left`, `Right`

    **複数の修飾子の組み合わせ**:
    修飾子を組み合わせる場合は`+`でつなげます。例: `'Control+Shift+A'`。

4.  **ファイルを保存する**:
    変更を保存します。

5.  **DokodemoLLMを再起動する**:
    変更を適用するには、現在実行中のDokodemoLLMを終了し、再度起動する必要があります。ターミナルで`Ctrl + C`を押して現在のプロセスを停止し、再度`npm start`を実行してください。

### １度設定すれば次回からOKなこと

ショートカットキーの変更や、必要な依存関係のインストール（`npm install`）は、**一度行えば次回から再度行う必要はありません**。ファイルの内容を変更しない限り、設定は維持されます。

### Mac起動時に自動実行する方法

DokodemoLLMはElectronアプリケーションであり、`npm start`コマンドで起動します。Macの起動時に自動的にこのコマンドを実行させることで、手動での起動の手間を省くことができます。

最も一般的な方法は、Automatorアプリケーションを使用して起動スクリプトを作成し、ログイン項目に登録することです。

1.  **Automatorアプリケーションを開く**:
    「アプリケーション」フォルダから「Automator.app」を探して開きます。

2.  **新しい書類を作成**:
    Automatorの起動画面で「新規書類」をクリックします。

3.  **「アプリケーション」を選択**:
    書類の種類として「アプリケーション」を選択し、「選択」をクリックします。

4.  **「シェルスクリプトを実行」アクションを追加**:
    左側のライブラリから「ユーティリティ」を選択し、右側のワークフロー領域に「シェルスクリプトを実行」をドラッグ＆ドロップします。

5.  **シェルスクリプトを設定**:

      * 「シェル」が`/bin/bash`であることを確認します。
      * 「入力の引き渡し方法」を「入力なし」に変更します。
      * テキストエリアに、DokodemoLLMを起動するための以下のコマンドを入力します。
        ```bash
        #!/bin/bash
        cd /Users/あなたのユーザー名/Documents/DokodemoLLM # ここはDokodemoLLMを配置したパスに置き換えてください
        npm start > /dev/null 2>&1 &
        ```
          * `/Users/あなたのユーザー名/Documents/DokodemoLLM` の部分は、あなたが実際にDokodemoLLMを配置したフォルダのフルパスに置き換えてください。
          * `> /dev/null 2>&1` は、コマンドの標準出力と標準エラー出力を破棄し、ターミナルに余計なメッセージが表示されないようにします。
          * `&` は、コマンドをバックグラウンドで実行し、Automatorのプロセスが終了してもDokodemoLLMが実行し続けるようにします。

6.  **アプリケーションとして保存**:
    「ファイル」メニューから「保存」を選択します。

      * 「名前」に例えば「Start DokodemoLLM」と入力します。
      * 「場所」は、例えば「アプリケーション」フォルダなど、分かりやすい場所に保存してください。

7.  **ログイン項目に登録**:

      * 「システム設定」（macOS Ventura以降）または「システム環境設定」（macOS Monterey以前）を開きます。
      * 「一般」（Ventura以降）または「ユーザーとグループ」（Monterey以前）を選択します。
      * 「ログイン項目」タブ（または「ログイン時に開く」セクション）をクリックします。
      * 左下の「＋」ボタンをクリックし、先ほどAutomatorで保存したアプリケーション（例: 「Start DokodemoLLM.app」）を選択して「追加」をクリックします。

これで、Macを起動するたびにDokodemoLLMが自動的にバックグラウンドで実行されるようになります。

DokodemoLLMの配布について、免責事項となる文章とタイトルを作成します。

---

## 免責事項：DokodemoLLMのご利用にあたって

このDokodemoLLMは、個人の作業効率化を目的として開発されたユーティリティツールであり、現状有姿（as-is）で提供されます。

開発者は、本ソフトウェアの正確性、完全性、信頼性、特定の目的への適合性について、いかなる保証も行いません。また、本ソフトウェアの使用または使用不能から生じるいかなる直接的、間接的、偶発的、派生的損害（利益の損失、データの損失、事業の中断などを含むがこれらに限定されない）に対しても、一切の責任を負いません。

本ソフトウェアは、開発者による積極的なサポート提供を前提としておりません。したがって、操作方法、不具合、環境依存の問題などに関する個別の問い合わせに対して、迅速な対応や解決策の提供をお約束することはできません。

本ソフトウェアは、ユーザー自身の責任においてご利用ください。ご利用に際して生じた一切の問題、損害、紛争について、開発者は責任を負いかねますことをご了承ください。

AIサービスの利用に関しては、各AIプロバイダー（OpenAI, Googleなど）の利用規約およびプライバシーポリシーに従う必要があります。APIキーの管理、利用料金、データプライバシーに関する事項は、ユーザーご自身の責任において適切にご対応ください。

本ソフトウェアをダウンロードし、利用を開始した時点で、上記の免責事項に同意したものとみなされます。

