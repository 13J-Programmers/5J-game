# 5J game

Pandemic + Puzzle = Puzzdemic（パズデミック）

+ Feature
    - 2048 (パズルゲーム) のようなゲーム感
    - パズルでワクチンを作って、パンデミックを抑えることが目的
    - 協力型マルチプレイ
    - 4プレイヤはそれぞれ (赤)東アジア・オセアニア, (青)ヨーロッパ, (黄)中東・アフリカ, (緑)アメリカ を担当する
    - パズルでは4種類（赤・青・黄・緑）のタイルを使う
    - 各プレイヤはパズルを行い、自分の担当エリアの色のワクチンを作る
    - 自分の担当エリアではない色をまとめると「知識」になり、他のプレイヤのパズルの助けになる。
      なお「知識」を受け取ったプレイヤは、細胞数が4のタイルの出る確率を（知識の個数）x（5%）で上昇させる（上限は100%）
    - 細胞数が20のタイルは「知識」になり、細胞数が30のタイルはワクチンになる
    - いずれかのプレイヤがパズルで詰み状態になると、OUTBREAKが1つ進行する
    - OUTBREAKが8回起こるとゲームオーバ
    - あるプレイヤがワクチンが完成してもゲームは終わらず、4種類のワクチンが完成するとゲームクリアとなる
    - 自分の担当の色のワクチンが完成すると、それ以降は担当の色のタイルは細胞数20以上で自分の「知識」になる
    - ある種類のワクチンが完成して、かつ自分のパズル画面にその種類が存在しない場合は「撲滅」したことになり、
      対応する色のタイルは自分のパズルに出現しなくなる
    - 時間経過と共にINFECTION RATEが上昇する
    - INFECTION RATEが6ステップ目まで来るとゲームオーバ
    - 2人しかいなくても遊べる2プレイヤモード（それぞれが2地域を担当する）もあると当日安心。もしくはCPUにおまかせモードを追加する
+ Env
    - Chrome >= 58
    - node >= 7.6
    - express 4.x -- フレームワーク
    - ejs -- テンプレートエンジン
    - socket.io 2.x -- 他のプレイヤとの同期
    - mongodb -- ランキング（優先度低）
    - jquery 3.x
    - async/await
    - EventEmitter -- https://github.com/Olical/EventEmitter


### GUI

~~~
    +--------------------------------------------------------+
    |                                                        |
    |   +-----+                             created vaccines |
    |   | b   |                                 _    _       |
    |   |     |     +--------------------+     (r)  (b)      |
    |   +-----+     | a                  |      _    _       |
    |               |                    |     (y)  (g)      |
    |   +-----+     |                    |                   |
    |   | c   |     |   puzzle window    |                   |
    |   |     |     |                    |   progress bar    |
    |   +-----+     |                    |    r [===>    ]   |
    |               |                    |    b [====>   ]   |
    |   +-----+     |                    |    y [==>     ]   |
    |   | d   |     +--------------------+    g [=====>  ]   |
    |   |     |                                              |
    |   +-----+                                              |
    | other players' puzzle                                  |
    | window (read only)                                     |
    +--------------------------------------------------------+
~~~

+ 真ん中には自分のパズル
+ 左側では他のプレイヤのパズルの様子が見れる
+ プレイヤがパズルで得た「知識」は他のプレイヤの窓に向かうようなアニメーション
+ 他のプレイヤから「知識」が送られてくるときは、自分の窓に向かってくるアニメーション
+ 右上には完成したワクチンのリスト
+ 右下には各プレイヤのワクチン完成までの進捗状況


### Getting Started
- npm

~~~
$ npm install
$ npm start
~~~

- yarn

~~~
$ yarn
$ yarn start
~~~
