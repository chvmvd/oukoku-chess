# おうこくチェス

4歳から遊べるシンプルな子ども向けチェス。

## 開発

環境構築はExpo公式ガイド（[iOS](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=development-build&buildEnv=local)／[Android](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build&buildEnv=local)）を参照してください。Node.jsは`.nvmrc`のバージョンを使用します。

初回は開発用アプリをビルドします。

```sh
npm ci
npx expo run:ios
```

Androidでは`npx expo run:android`を実行します。

普段は`npx expo start`で開発用サーバーを起動し、`i`キーを押してアプリを開きます。Androidでは`a`キーを押します。

## ネイティブ設定の反映

ネイティブライブラリや設定の変更後は、対象のネイティブディレクトリを再生成してビルドします。

```sh
npx expo prebuild --clean
npx expo run:ios
```

Androidでは`npx expo run:android`を実行します。

## コードの整形・確認

```sh
npm run format
npm run format:check
npm run lint
npm run type-check
```
