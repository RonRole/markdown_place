# docker-composeのvolumesについて
こう書くと、ボリュームマウント
- docker engineの管理下にファイルを置く
- docker engineを介さないとファイルを触れない
~~~yaml
# docker-compose.yml
services:
  postgres:
    volumes:
      - db_store:/var/lib/postgresql/data
volumes:
    db_store:
~~~

こう書くと、バインドマウント
- ホストとコンテナがファイルを共有するイメージ
- ホストからファイルを触り放題
~~~yaml
# docker-compose.yml
services:
  postgres:
    volumes:
      - ./postgres/data:/var/lib/postgresql/data
~~~

## なぜ書いたか
postgresイメージに初期化用のsqlを渡して...というときに、バインドマウントで書いたら初期化用sqlで作ったデータが全部消えたので