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