# 進捗管理システム

## 概要
このプロジェクトは、教員と生徒の進捗を管理するためのWebアプリケーションです。

## 技術スタック
- TypeScript
- React 19
- Next.js 15 (App Router)
- Vercel AI SDK
- Shadcn UI
- Radix UI
- Tailwind CSS
- Prisma
- NextAuth.js

## 機能
- 教員アカウント管理
- 生徒の進捗管理
- トースト通知システム
- レスポンシブデザイン
- アクセシビリティ対応

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd progress_management
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env.example`ファイルを`.env`にコピーし、必要な環境変数を設定します。

4. データベースのセットアップ
```bash
npx prisma generate
npx prisma db push
```

5. 開発サーバーの起動
```bash
npm run dev
```

## プロジェクト構造
```
progress_management/
├── app/                 # Next.js アプリケーション
├── components/          # Reactコンポーネント
│   └── ui/             # UIコンポーネント
├── lib/                # ユーティリティ関数
├── prisma/             # Prismaスキーマとマイグレーション
└── public/             # 静的ファイル
```

## ライセンス
MIT

## 貢献
1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成 

# 課題管理システム

3DCG課題の提出・評価を管理するシステム

## 環境構築

1. リポジトリをクローン
```bash
git clone [リポジトリのURL]
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数の設定
`.env` ファイルをプロジェクトのルートに作成し、以下の項目を設定してください。

```
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. データベースのセットアップ
```bash
npx prisma migrate dev
```

5. 開発サーバーの起動
```bash
npm run dev
```

## Google Drive連携の設定

1. Google Cloud Consoleで新しいプロジェクトを作成
2. Google Drive APIを有効化
3. サービスアカウントを作成
   - IAMと管理 > サービスアカウント > 作成
   - 必要な権限を付与（Drive File Creator, Drive Editor）
4. サービスアカウントキーを作成
   - JSON形式のキーファイルをダウンロード
5. 共有フォルダの設定
   - Google Driveでフォルダを作成
   - サービスアカウントのメールアドレスを共有設定に追加（編集者権限）
6. 環境変数の設定
   `.env` ファイルに以下の項目を追加
   ```
   GOOGLE_DRIVE_ROOT_FOLDER_ID="your-folder-id"
   GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email"
   GOOGLE_PRIVATE_KEY="your-private-key"
   ```
   注: プライベートキーは`\n`をエスケープする必要があります。

7. システム設定画面でGoogle DriveのルートフォルダIDを設定

## 機能一覧

- ユーザー管理（学生・教員）
- 課題の作成・管理
- 学生の課題提出
- 教員による採点・評価
- 提出物のGoogle Drive保存
- お知らせ機能

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Prisma
- PostgreSQL
- NextAuth.js
- Google Drive API 