-- データベース作成
CREATE DATABASE markdown_place_db;

-- データベース切り替え
\c markdown_place_db

-- スキーマ作成
CREATE SCHEMA markdown_place_schema;

-- ロール作成
CREATE ROLE markdown_place_role WITH LOGIN PASSWORD 'markdown_place_role';

-- 権限付与
GRANT ALL PRIVILEGES ON SCHEMA markdown_place_schema TO markdown_place_role;

-- テスト用データベース作成
CREATE DATABASE test_db;

-- データベース切り替え
\c test_db

-- スキーマ作成
CREATE SCHEMA markdown_place_schema;

-- ロール作成
CREATE ROLE markdown_place_role WITH LOGIN PASSWORD 'markdown_place_role';

-- 権限付与
GRANT ALL PRIVILEGES ON SCHEMA markdown_place_schema TO markdown_place_role;