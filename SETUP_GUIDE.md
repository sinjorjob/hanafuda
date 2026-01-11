# すいちゃんの花札 - タブレット導入ガイド

Windows PCで開発したこのアプリを、iPad mini等のタブレットで使えるようにする手順です。

---

## 方法1: GitHub Pages（無料・おすすめ）

インターネット上に公開する方法。一度設定すれば、どこからでもアクセス可能。

### 必要なもの
- GitHubアカウント（無料）
- Git（インストール済みなら不要）

### 手順

#### Step 1: GitHubリポジトリ作成
1. https://github.com にアクセスしてログイン
2. 右上の「+」→「New repository」をクリック
3. Repository name: `hanafuda`（好きな名前でOK）
4. 「Public」を選択（無料で公開するため）
5. 「Create repository」をクリック

#### Step 2: ファイルをアップロード
**方法A: ブラウザから直接アップロード**
1. 作成したリポジトリページで「uploading an existing file」をクリック
2. 以下のファイル/フォルダをドラッグ＆ドロップ:
   ```
   index.html
   manifest.json
   service-worker.js
   icons/ (フォルダごと)
   ```
3. 「Commit changes」をクリック

**方法B: Gitコマンドを使う（上級者向け）**
```bash
cd C:\develop\hanafuda
git init
git add index.html manifest.json service-worker.js icons/
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/hanafuda.git
git push -u origin main
```

#### Step 3: GitHub Pages を有効化
1. リポジトリの「Settings」タブをクリック
2. 左メニューの「Pages」をクリック
3. Source で「Deploy from a branch」を選択
4. Branch で「main」を選択、フォルダは「/ (root)」
5. 「Save」をクリック
6. 数分待つと公開される

#### Step 4: iPadからアクセス
1. 公開URL（例: `https://あなたのユーザー名.github.io/hanafuda/`）にアクセス
2. Safari の共有ボタン → 「ホーム画面に追加」
3. 一度Wi-Fiで開くと、オフラインでも遊べるようになる

---

## 方法2: ローカルサーバー（家庭内LAN）

インターネットに公開せず、家のWi-Fi内だけで使う方法。

### 必要なもの
- Windows PCとタブレットが同じWi-Fiに接続

### 手順

#### Step 1: PCのIPアドレスを確認
コマンドプロンプトで:
```bash
ipconfig
```
「IPv4 アドレス」を確認（例: `192.168.1.100`）

#### Step 2: 簡易サーバーを起動

**方法A: Python（インストール済みの場合）**
```bash
cd C:\develop\hanafuda
python -m http.server 8080
```

**方法B: Node.js（インストール済みの場合）**
```bash
cd C:\develop\hanafuda
npx serve -p 8080
```

**方法C: http-server をインストールして使う**
```bash
npm install -g http-server
cd C:\develop\hanafuda
http-server -p 8080
```

#### Step 3: iPadからアクセス
1. Safari で `http://192.168.1.100:8080`（PCのIPアドレス）にアクセス
2. 共有ボタン → 「ホーム画面に追加」

**注意:** PCを起動してサーバーを動かしている間だけ使えます。

---

## 方法3: ファイル転送（オフライン完全対応）

アプリファイルを直接iPadに転送する方法。

### 手順

#### Step 1: ファイルをZIP圧縮
1. `C:\develop\hanafuda` フォルダを右クリック
2. 「送る」→「圧縮（zip形式）フォルダー」

#### Step 2: iPadに転送
- **iCloud Drive**: ZIPをiCloud Driveにコピー → iPadのファイルアプリで展開
- **AirDrop**: Windows非対応のため使用不可
- **メール**: 自分にメールで送付 → iPadで受信して保存
- **USBケーブル**: iTunes/Finderでファイル共有

#### Step 3: ローカルHTMLビューアで開く
iPadでローカルHTMLを開くには専用アプリが必要:
- **Documents by Readdle**（無料）
- **GoodReader**（有料）

※この方法ではService Workerが動作しないため、外部の花札画像が表示されません。

---

## おすすめ度比較

| 方法 | 難易度 | オフライン | どこでも使える | 備考 |
|------|--------|------------|----------------|------|
| GitHub Pages | ★★☆ | ✅ | ✅ | **おすすめ！** 無料で簡単 |
| ローカルサーバー | ★☆☆ | ❌ | ❌ | PC起動が必要 |
| ファイル転送 | ★★★ | ❌ | ✅ | 画像表示に問題あり |

---

## トラブルシューティング

### Q: ホーム画面に追加できない
- Safari以外のブラウザ（Chrome等）では追加できません
- Safariで開いてください

### Q: オフラインで画像が表示されない
- 最初にWi-Fi接続状態で一度ゲームを開始してください
- 全48枚の花札画像がキャッシュされます

### Q: アイコンが表示されない
- `icons/icon-192.png` が正しく配置されているか確認
- より綺麗なアイコンは `icons/generate-icons.html` をPCで開いて生成

### Q: 更新が反映されない
- Safari の設定 → 「履歴とWebサイトデータを消去」
- または端末からアプリを削除して再度「ホーム画面に追加」

---

## GitHub Pages 公開後のURL例

```
https://あなたのユーザー名.github.io/hanafuda/
```

このURLをiPadのSafariで開いて「ホーム画面に追加」すれば完了です！
