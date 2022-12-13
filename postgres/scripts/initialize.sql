-- データベース作成
CREATE DATABASE sample_db;

-- データベース切り替え
\c sample_db

-- スキーマ作成
CREATE SCHEMA sample_schema;

-- ロール作成
CREATE ROLE sample_role WITH LOGIN PASSWORD 'sample_role';

-- 権限付与
GRANT ALL PRIVILEGES ON SCHEMA sample_schema TO sample_role;