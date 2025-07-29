# House Budget - 家計簿アプリ

Next.js 14、TypeScript、Prismaを使用した個人向け家計簿アプリケーションです。

## 🚀 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: SQLite (Prisma ORM)
- **バリデーション**: Zod
- **UI コンポーネント**: shadcn/ui
- **日付処理**: date-fns
- **チャート**: Chart.js, Recharts

## 📋 機能

- ✅ 支出の記録・管理
- ✅ カテゴリ別の支出分類
- ✅ 口座残高の自動更新
- ✅ データベーススキーマ設計
- ✅ 型安全なフォーム処理
- ✅ サーバーアクションによるデータ処理

## 🛠️ セットアップ

### 前提条件

- Node.js 18.0.0以上
- npm または yarn

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd house-budget
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **データベースのセットアップ**
   ```bash
   # Prismaクライアントの生成
   npx prisma generate
   
   # データベースの作成とスキーマの適用
   npx prisma db push
   
   # 初期データの投入
   npm run seed
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

5. **ブラウザでアクセス**
   ```
   http://localhost:3000
   ```

## 📁 プロジェクト構造

```
house-budget/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── components/         # クライアントコンポーネント
│   │   │   └── forms/         # フォームコンポーネント
│   │   └── expenses/          # 支出関連ページ
│   ├── components/            # 共通UIコンポーネント
│   ├── lib/                   # ユーティリティ
│   │   ├── actions/           # サーバーアクション
│   │   ├── data/              # データ取得関数
│   │   ├── types/             # TypeScript型定義
│   │   └── validations/       # Zodバリデーション
│   └── prisma/                # Prismaスキーマ
├── scripts/                   # スクリプト
└── prisma/                    # データベース関連
```

## 🗄️ データベーススキーマ

### 主要なモデル

- **Account**: 口座情報（銀行、現金、クレジットカード等）
- **Category**: 支出カテゴリ（食費、交通費、光熱費等）
- **Transaction**: 取引記録（収入・支出・振替）
- **Budget**: 予算設定
- **Simulation**: シミュレーション機能

## 🚀 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# データベースのリセットとシード
npm run seed

# Prisma Studio（データベースGUI）
npx prisma studio
```

## 📝 今後の開発予定

- [ ] 収入記録機能
- [ ] ダッシュボード画面
- [ ] グラフ・チャート表示
- [ ] 予算管理機能
- [ ] 振替機能
- [ ] シミュレーション機能
- [ ] データエクスポート機能

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

問題や質問がある場合は、GitHubのIssuesページでお知らせください。
