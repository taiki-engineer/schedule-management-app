# 📅 Schedule Management App

ログイン機能付きのスケジュール・タスク管理アプリです。

## 🌐 Demo

https://schedule-management-front.onrender.com

## 📖 開発背景

日々の予定とタスクを一つのアプリでまとめて管理できるようにしたいと考え、このアプリを開発しました。

CRUD機能だけでなく、ユーザー認証やデータベース連携まで実装し、実際に利用できるWebアプリケーションを目指しました。



## 📸 スクリーンショット

### ログイン
（画像）

### ホーム
（画像）


### スケジュール
（画像）


### 予定一覧
（画像）



### タスク一覧
（画像）



## ✨ 主な機能

- ユーザー登録・ログイン（JWT認証）
- ホーム画面で今日の予定・タスク・完了／未完了／総タスクの数値を表示
- スケジュール追加
- スケジュール編集
- スケジュール削除
- 予定一覧表示
- タスク追加
- タスク完了チェック
- タスク削除
- カレンダー表示
- カテゴリーごとの色分け
- レスポンシブ対応（PC・スマホ）
  

## 🛠 使用技術

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express

### Database

- PostgreSQL

### Deploy

- Render

## 🔒 認証

JWTを利用したログイン認証を実装しています。
ユーザーごとに予定・タスクを管理できるようになっています。



## 💡 工夫したポイント

### ユーザーごとのデータ管理

JWT認証を利用し、ログインしたユーザーの情報から`user_id`を取得して予定・タスクを管理しています。

これにより、他のユーザーのデータを取得・編集・削除できない構成にしました。

### レスポンシブ対応

PC・スマートフォンの両方で快適に利用できるようレイアウトを調整しました。

スマートフォンではハンバーガーメニューやモーダルを採用し、限られた画面でも操作しやすいUIを意識しました。

### 見やすいUI

カテゴリーごとに色分けを行い、ホーム画面では今日の予定やタスク数をカード形式で表示することで、一目で状況を把握できるよう工夫しました。

---

## 🏗 システム構成

```text
Frontend
     │
 　Login 
     │
 JWT Token取得
     │
localStorage保存
     │
Authorization: Bearer Token
     │
     ▼
Express API
(auth middleware)
     │
req.user.id
     │
PostgreSQL
(users / schedules / tasks)
     │
JSON
     │
Frontend表示
```


## 📂 ディレクトリ構成

```
schedule-management-app
├── index.html
├── login.html
├── register.html
├── main.js
├── login.js
├── server.js
├── style.css
├── login.css
├── package.json
```

## 🚀 今後追加したい機能

- 検索機能
- カテゴリー追加機能
- 通知機能
- ダークモード
