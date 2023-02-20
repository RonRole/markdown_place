# markdown_place
## アプリケーションの概要
Markdownのプレビューや保存ができるアプリケーションです  
メインはMarkdownの管理で、「ファイルの保存場所をどこにするか」など整理に関する部分を自動化して、「テキストを作成する」ことに集中できる環境を提供したいという方針で開発しています。

# 開発の動機
仕事の手順書やメモなどを作成することが多いのですが、時間が経ってからまた確認しようと思った時に、どこに保存したか分からなくなってしまい、時間をかけて探すということが多々発生したことが動機です。

文章を作成することと、それを整理することは全く別分野の仕事だと感じたので、どちらかに集中できるようなものを作ろうと思った次第です。

# 機能
- ユーザー作成
- ログイン/ログアウト
- MarkdownテキストのリアルタイムHTMLプレビュー
- テキスト新規作成
- テキスト保存
- テキスト削除(単数/複数)
- テキスト検索機能

# 今後の方針
- テキストへのタグ付け機能
- テキストのタグ検索機能
- 自動タグ付け機能(保存時、文章が特定のワードを含む場合にタグを付与する)
- 下書きの保存機能

# 使用技術
## フロントエンド
- 言語: TypeScript
- フレームワーク、ライブラリ: Next.js, React.js, Material-UI

## サーバーサイド
- 言語: PHP
- フレームワーク、ライブラリ: Laravel
- データベース: PostgreSQL

## インフラ
- GCP

## その他
- ソースコード管理: Github
- 開発/ビルド環境構築: Docker
- CI: Github Actions
- CD: GCP Cloud Deploy

# 開発環境構築手順
## 前提
- gitがインストール済み
- Dockerがインストール済み
## ソースのダウンロード
git cloneなどでソースコードを取得

## 環境変数の設定
1. laravel/src/.env.exampleをコピーして、.envにリネーム
    ~~~bash
    cd laravel/src
    cp .env.example .env
    ~~~
1. nextjs/src/.env.exampleをコピーして、.envにリネーム
    ~~~bash
    cd nextjs/src
    cp .env.example .env
    ~~~
## コンテナ起動
~~~bash
cd $PROJECT_ROOT
docker-compose up -d
~~~
## laravelの初期設定
1. laravelコンテナに入る
    ~~~bash
    docker-compose exec laravel bash
    ~~~
    以下、laravelコンテナ内で操作する

1. APP_KEYの取得
    ~~~bash
    # laravelコンテナ内
    # cd /app
    php artisan key:generate
    ~~~
1. マイグレーションの実行
    ~~~bash
    # laravelコンテナ内
    # cd /app
    php artisan migrate
    ~~~
1. 初期データの作成
    ~~~bash
    # laravelコンテナ内
    # cd /app
    php artisan db:seed
    ~~~

## 確認
http://localhost:3000にアクセスし、画面が表示されれば完了