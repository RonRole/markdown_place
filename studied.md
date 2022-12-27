# docker-compose の volumes について

こう書くと、ボリュームマウント

- docker engine の管理下にファイルを置く
- docker engine を介さないとファイルを触れない

```yaml
# docker-compose.yml
services:
  postgres:
    volumes:
      - db_store:/var/lib/postgresql/data
volumes:
  db_store:
```

こう書くと、バインドマウント

- ホストとコンテナがファイルを共有するイメージ
- ホストからファイルを触り放題

```yaml
# docker-compose.yml
services:
  postgres:
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
```

## なぜ書いたか

postgres イメージに初期化用の sql を渡して...というときに、バインドマウントで書いたら初期化用 sql で作ったデータが全部消えたので

# docker-compose up postgres で no space left on device エラー

docker の使ってないイメージなどが溜まりすぎてたせい
開発環境なら、docker system prune で掃除
