// 🎧 シャドーイング用の英文リスト（全60問・高校文法＆開発現場解説付き）
var SHADOWING_SENTENCES = [
  // --- 元の10問 (1-10) ---
  { 
    text: 'The meeting starts at nine o’clock.', 
    phonetic: '/ðə ˈmiː.tɪŋ stɑːrts æt naɪn əˈklɑːk./', 
    translation: '会議は9時に始まります。',
    grammar: '【時制】確定した未来の予定を表す現在形。確定度の高いスケジュールは現在形を使う。'
  },
  { 
    text: 'Please send the revised schedule by this afternoon.', 
    phonetic: '/pliːz sɛnd ðə rɪˈvaɪzd ˈskedʒ.uːl baɪ ðɪs ˌɑːf.təˈnuːn./', 
    translation: '修正したスケジュールを今日の午後までに送ってください。',
    grammar: '【分詞】過去分詞による名詞修飾。revised（修正された）が schedule を修飾。期限を表す preposition「by」の用法。'
  },
  { 
    text: 'I will follow up with the client tomorrow.', 
    phonetic: '/aɪ wɪl ˈfɒl.oʊ ʌp wɪð ðə ˈklaɪ.ənt təˈmɒr.oʊ./', 
    translation: '明日クライアントにフォローします。',
    grammar: '【時制】未来を表す助動詞 will と、「〜をフォローアップする」という重要群動詞。'
  },
  { 
    text: 'Our team needs to finalize the budget today.', 
    phonetic: '/aʊər tiːm niːdz tə ˈfaɪ.nə.laɪz ðə ˈbʌdʒ.ɪt təˈdeɪ./', 
    translation: '私たちのチームは今日予算を最終決定する必要があります。',
    grammar: '【不定詞】名詞的用法。need to do で「〜する必要がある」という目的語の役割。'
  },
  { 
    text: 'Could you explain the key deliverables once more?', 
    phonetic: '/kʊd juː ɪkˈspleɪn ðə kiː dɪˈlɪv.ər.ə.bəlz wʌns mɔːr?/', 
    translation: '主要な成果物をもう一度説明していただけますか？',
    grammar: '【助動詞】Could you...? による丁寧な依頼表現。deliverables（成果物）はビジネス・開発特有の名詞。'
  },
  { 
    text: 'We are waiting for final approval from the board.', 
    phonetic: '/wiː ɑːr ˈweɪ.tɪŋ fɔːr ˈfaɪ.nəl əˈpruː.vəl frəm ðə bɔːrd./', 
    translation: '取締役会からの最終承認を待っています。',
    grammar: '【時制】現在進行形（be + v-ing）。「wait for A」で「Aを待つ」という頻出表現。'
  },
  { 
    text: 'The product launch has been postponed until next month.', 
    phonetic: '/ðə ˈprɒd.ʌkt lɔːntʃ hæz bɪn pəˈspoʊnd ʌnˈtɪl nɛkst mʌnθ./', 
    translation: '製品の発売は来月まで延期されました。',
    grammar: '【完了形・受動態】現在完了受動態（has been + 過去分詞）。「特定の時点まで継続する期限」を表す until の用法。'
  },
  { 
    text: 'Let’s review the quarterly targets in the next meeting.', 
    phonetic: '/lɛts rɪˈvjuː ðə ˈkwɔːr.tɚ.li ˈtɑːr.ɡəts ɪn ðə nɛkst ˈmiː.tɪŋ./', 
    translation: '次の会議で四半期目標を確認しましょう。',
    grammar: '【助動詞】Let\'s do（〜しましょう）の勧誘。quarterly（四半期の）はTOEIC最頻出の形容詞。'
  },
  { 
    text: 'Our current strategy needs a little more refinement.', 
    phonetic: '/aʊər ˈkʌr.ənt ˈstræt.ə.dʒi niːdz ə ˈlɪt.əl mɔːr rɪˈfaɪn.mənt./', 
    translation: '現在の戦略はもう少し改善が必要です。',
    grammar: '【比較・名詞】a little more ＋ 不可算名詞（refinement: 洗練、改善）による程度の強調。'
  },
  { 
    text: 'I appreciate your prompt response on this issue.', 
    phonetic: '/aɪ əˈpriː.ʃi.eɪt jɔːr prɒmpt rɪˈspɒns ɒn ðɪs ˈɪʃ.uː./', 
    translation: 'この件について迅速なご対応に感謝します。',
    grammar: '【文型】SVOの第3文型。動詞 appreciate の後ろには直接「感謝の対象となる名詞・動名詞」を置く。'
  },

  // --- 助動詞・完了形・受動態 (11-20) ---
  { 
    text: 'We must implement the security patches immediately.', 
    phonetic: '/wiː mʌst ˈɪm.plɪ.ment ðə sɪˈkjʊə.rə.ti pætʃ.ɪz ɪˈmiː.di.ət.li./', 
    translation: '私たちはすぐにセキュリティパッチを実装しなければならない。',
    grammar: '【助動詞】義務・必要性を表す強い助動詞 must。副詞 immediately の位置（文末での強調）。'
  },
  { 
    text: 'The server migration has already been completed successfully.', 
    phonetic: '/ðə ˈsɜː.vər maɪˈɡreɪ.ʃən hæz ɔːlˈred.i biːn kəmˈpliː.tɪd səkˈses.fəl.i./', 
    translation: 'サーバーの移行はすでに正常に完了しています。',
    grammar: '【完了形・受動態】現在完了受動態の「完了（already）」を表す用法。動作の完了と現在の状態を同時に示す。'
  },
  { 
    text: 'This feature should be thoroughly tested by tomorrow.', 
    phonetic: '/ðɪs ˈfiː.tʃər ʃʊd biː ˈθʌr.ə.li ˈtes.tɪd baɪ təˈmɒr.oʊ./', 
    translation: 'この機能は明日までに徹底的にテストされるべきです。',
    grammar: '【助動詞・受動態】助動詞を含む受動態（should be + 過去分詞）。thoroughly（徹底的に）は形容詞 thorough の副詞形。'
  },
  { 
    text: 'The bug has been causing system crashes since yesterday.', 
    phonetic: '/ðə bʌɡ hæz biːn ˈkɔː.zɪŋ ˈsɪs.təm kræʃ.ɪz sɪns ˈjes.tə.deɪ./', 
    translation: '昨日からそのバグが原因でシステムがクラッシュし続けている。',
    grammar: '【完了形】現在完了進行形（have/has been + v-ing）。過去のある時点（since yesterday）から今もなお続いている動作・現象。'
  },
  { 
    text: 'We have just deployed the new version to staging.', 
    phonetic: '/wiː hæv dʒʌst dɪˈplɔɪd ðə njuː ˈvɜː.ʒən tuː ˈsteɪ.dʒɪŋ./', 
    translation: '新しいバージョンをステージング環境にデプロイしたところです。',
    grammar: '【完了形】現在完了形の「完了（just）」。動作がたった今完了したニュアンスを強調する。'
  },
  { 
    text: 'The API specifications were updated by the backend team.', 
    phonetic: '/ðiː eɪ.pi.aɪ ˌspes.ɪ.fɪˈkeɪ.ʃənz wɜːr ʌpˈdeɪ.tɪd baɪ ðə ˈbæk.end tiːm./', 
    translation: 'API仕様書はバックエンドチームによって更新されました。',
    grammar: '【受動態】過去の受動態（was/were + 過去分詞）。行為者を示す「by + 名詞」の基本構造。'
  },
  { 
    text: 'You do not have to modify the database schema.', 
    phonetic: '/juː duː nɒt hæv tuː ˈmɒd.ɪ.faɪ ðə ˈdeɪ.tə.beɪs ˈskiː.mə./', 
    translation: 'データベースのスキーマを変更する必要はありません。',
    grammar: '【助動詞】don\'t have to do で「〜する必要はない（不必要）」を表す（must notの「禁止」との違いに注意）。'
  },
  { 
    text: 'The project manager may change the release schedule tonight.', 
    phonetic: '/ðə ˈprɒdʒ.ekt ˈmæn.ɪ.dʒər meɪ tʃeɪndʒ ðə rɪˈliːs ˈskedʒ.uːl təˈnaɪt./', 
    translation: 'プロジェクトマネージャーは今夜、リリーススケジュールを変更するかもしれません。',
    grammar: '【助動詞】推量（〜かもしれない）を表す助動詞 may。不確実な予定を伝える時に使用。'
  },
  { 
    text: 'The system requirements have changed significantly over time.', 
    phonetic: '/ðə ˈsɪs.təm rɪˈkwaɪə.mənts hæv tʃeɪndʒd sɪɡˈnɪf.ɪ.kənt.li ˈoʊ.vər taɪm./', 
    translation: 'システムの要件は時間の経過とともに大きく変わりました。',
    grammar: '【完了形】現在完了形の「結果・継続」。change は自動詞として使われており、over time（時間の経過とともに）を伴う。'
  },
  { 
    text: 'All code must be reviewed before it is merged.', 
    phonetic: '/ɔːl koʊd mʌst biː rɪˈvjuːd bɪˈfɔːr ɪt ɪz mɜːrdʒd./', 
    translation: 'すべてのコードはマージされる前にレビューされなければならない。',
    grammar: '【助動詞・受動態】接続詞 before の後ろの副詞節内でも受動態（it is merged）が使われている二重受動構造。'
  },

  // --- 不定詞・動名詞・分詞構文 (21-30) ---
  { 
    text: 'I managed to resolve the critical merge conflict.', 
    phonetic: '/aɪ ˈmæn.ɪdʒd tuː rɪˈzɒlv ðə ˈkrɪt.ɪ.kəl mɜːrdʒ ˈkɒn.flɪkt./', 
    translation: '重大なマージ衝突をなんとか解決することができた。',
    grammar: '【不定詞】manage to do で「なんとか〜し遂げる」という、苦労の末の達成を表す定型表現。'
  },
  { 
    text: 'Our main goal is to optimize the query performance.', 
    phonetic: '/aʊər meɪn ɡoʊl ɪz tuː ˈɒp.tɪ.maɪz ðə ˈkwɪə.ri pəˈfɔː.məns./', 
    translation: '私たちの主な目標は、クエリーのパフォーマンスを最適化することです。',
    grammar: '【不定詞】名詞的用法（補語の役割）。SVCのC（補語）として「〜すること」という意味を形成。'
  },
  { 
    text: 'They decided to postpone the deployment until next Tuesday.', 
    phonetic: '/ðeɪ dɪˈsaɪ.dɪd tuː pəˈspoʊn ðə dɪˈplɔɪ.mənt ʌnˈtɪl next ˈtʃuːz.deɪ./', 
    translation: '彼らはデプロイを次の火曜日まで延期することに決めた。',
    grammar: '【不定詞】決定を表す動詞 decide の目的語（名詞的用法）。decide の後ろは動名詞ではなく必ず不定詞。'
  },
  { 
    text: 'We finished refactoring the legacy code this morning.', 
    phonetic: '/wiː ˈfɪn.ɪʃt ˌriːˈfæk.tər.ɪŋ ðə ˈleɡ.ə.si koʊd ðɪs ˈmɔː.nɪŋ./', 
    translation: '今朝、レガシーコードのリファクタリングを終えました。',
    grammar: '【動名詞】finish の目的語としての動名詞（refactoring）。finish の後ろは不定詞ではなく必ず動名詞（MEGAFEPSの法則）。'
  },
  { 
    text: 'Avoid hardcoding confidential information in your program.', 
    phonetic: '/əˈvɔɪd ˈhɑːdˌkoʊd.ɪŋ ˌkɒn.fɪˈden.ʃəl ˌɪn.fəˈmeɪ.ʃən ɪn jɔːr ˈproʊ.ɡræm./', 
    translation: 'プログラム内に機密情報をハードコードすることは避けてください。',
    grammar: '【動名詞】avoid の目的語としての動名詞（hardcoding）。命令文の形を取っている。'
  },
  { 
    text: 'The function used to validate user input has bugs.', 
    phonetic: '/ðə ˈfʌŋk.ʃən juːzd tuː ˈvæl.ɪ.deɪt ˈjuː.zər ˈɪn.pʊt hæz bʌɡz./', 
    translation: 'ユーザー入力を検証するために使われていた関数にバグがあります。',
    grammar: '【分詞・不定詞】過去分詞（used）による名詞修飾と、目的を表す不定詞の副詞的用法（to validate：〜するために）。'
  },
  { 
    text: 'Developing this application requires advanced skills in JavaScript.', 
    phonetic: '/dɪˈvel.ə.pɪŋ ðɪs ˌæp.lɪˈkeɪ.ʃən rɪˈkwaɪəz ədˈvɑːnst skɪlz ɪn ˈdʒɑː.və.skrɪpt./', 
    translation: 'このアプリケーションの開発にはJavaScriptの高度なスキルが必要です。',
    grammar: '【動名詞】動名詞句（Developing this application）が文の主語（S）になっているパターン。三人称単数扱いのため動詞に s がつく。'
  },
  { 
    text: 'Faced with multiple blockers, we requested technical support.', 
    phonetic: '/feɪst wɪð ˈmʌl.tɪ.pəl ˈblɒk.əz, wiː rɪˈkwes.tɪd ˈtek.nɪ.kəl səˈpɔːt./', 
    translation: '複数の障害に直面したため、私たちは技術サポートを要請した。',
    grammar: '【分詞構文】過去分詞から始まる分詞構文。Being faced with... の Being が省略された形で、理由（〜だったので）を表す。'
  },
  { 
    text: 'The team worked hard, keeping the deadline in mind.', 
    phonetic: '/ðə tiːm wɜːkt hɑːd, ˈkiː.pɪŋ ðə ˈded.laɪn ɪn maɪnd./', 
    translation: 'チームは締め切りを念頭に置いて懸命に働いた。',
    grammar: '【分詞構文】付帯状況（〜しながら）を表す分詞構文（, keeping...）。keep A in mind で「Aを頭に入れておく」の重要熟語。'
  },
  { 
    text: 'It is worth upgrading the database to the latest version.', 
    phonetic: '/ɪt ɪz wɜːθ ʌpˈɡreɪ.dɪŋ ðə ˈdeɪ.tə.beɪs tuː ðə ˈleɪ.tɪst ˈvɜː.ʒən./', 
    translation: 'データベースを最新バージョンにアップグレードする価値はあります。',
    grammar: '【動名詞】「be worth + -ing」で「〜する価値がある」という、重要慣用表現・動名詞イディオム。'
  },

  // --- 関係代名詞・関係副詞 (31-40) ---
  { 
    text: 'This is the repository which contains the core logic.', 
    phonetic: '/ðɪs ɪz ðə rɪˈpɒz.ɪ.tər.i wɪtʃ kənˈteɪnz ðə kɔːr ˈlɒdʒ.ɪk./', 
    translation: 'これがコアロジックを含んでいるリポジトリです。',
    grammar: '【関係代名詞】主格の関係代名詞 which。先行詞 repository（貯蔵庫、ソースコード置き場）を後ろから修飾。'
  },
  { 
    text: 'We hired an engineer whose expertise is cloud architecture.', 
    phonetic: '/wiː ˈhaɪəd ən ˌen.dʒɪˈnɪər huːz ˌek.spɜːˈtiːz ɪz klaʊd ˈɑː.kɪ.tek.tʃər./', 
    translation: '私たちはクラウドアーキテクチャを専門とするエンジニアを雇った。',
    grammar: '【関係代名詞】所有格の関係代名詞 whose。「そのエンジニアの（whose）専門知識（expertise）」という所有関係を示す。'
  },
  { 
    text: 'The reason why the application crashed is still unknown.', 
    phonetic: '/ðə ˈriː.zən waɪ ðiː ˌæp.lɪˈkeɪ.ʃən kræʃt ɪz stɪl ʌnˈnoʊn./', 
    translation: 'アプリケーションがクラッシュした理由はまだ不明です。',
    grammar: '【関係副詞】関係副詞 why。先行詞 the reason を修飾し、関係副詞節の中は完全な文（S+V）が続く。'
  },
  { 
    text: 'Please report any issues that you find during testing.', 
    phonetic: '/pliːz rɪˈpɔːt ˈen.i ˈɪʃ.uːz ðæt juː faɪnd ˈdjʊə.rɪŋ ˈtest.ɪŋ./', 
    translation: 'テスト中に見つけた問題はどれでも報告してください。',
    grammar: '【関係代名詞】目的格の関係代名詞 that。先行詞に any が含まれる場合、which より that が好まれる傾向がある。'
  },
  { 
    text: 'That is exactly what the client requested last week.', 
    phonetic: '/ðæt ɪz ɪɡˈzækt.li wɒt ðə ˈklaɪ.ənt rɪˈkwes.tɪd lɑːst wiːk./', 
    translation: 'それこそが、まさにクライアントが先週要求したことです。',
    grammar: '【関係代名詞】先行詞を含む関係代名詞 what（＝the thing which）。「〜すること・もの」という意味の塊（名詞節）を作る。'
  },
  { 
    text: 'The tool we are using simplifies the workflow considerably.', 
    phonetic: '/ðə tuːl wiː ɑːr ˈjuː.zɪŋ ˈsɪm.plɪ.faɪz ðə ˈwɜːk.floʊ kənˈsɪd.ər.ə.bli./', 
    translation: '私たちが使っているツールは、ワークフローをかなり単純化してくれます。',
    grammar: '【関係代名詞】目的格関係代名詞の省略。The tool と we の間に that/which が省略されており、文の主語を修飾している。'
  },
  { 
    text: 'GitHub is the platform where developers share their code.', 
    phonetic: '/ˈɡɪt.hʌb ɪz ðə ˈplæt.fɔːm weər dɪˈvel.ə.pəz ʃeər ðeər koʊd./', 
    translation: 'GitHubは開発者がコードを共有するプラットフォームです。',
    grammar: '【関係副詞】場所を表す関係副詞 where。先行詞 platform（足場、環境）を修飾する。'
  },
  { 
    text: 'Whoever discovers the cause of the bug will get a prize.', 
    phonetic: '/huːˈev.ər dɪˈskʌv.əz ðə kɔːz ɒv ðə bʌɡ wɪl ɡet ə praɪz./', 
    translation: 'バグの原因を発見した人は誰でも賞品を受け取ります。',
    grammar: '【複合関係代名詞】whoever（〜する人は誰でも）。名詞節を形成し、文全体の大きな主語（S）として機能する。'
  },
  { 
    text: 'We fixed the error, which made the system stable.', 
    phonetic: '/wiː fɪkst ðiː ˈer.ər, wɪtʃ meɪd ðə ˈsɪs.təm ˈsteɪ.bəl./', 
    translation: 'エラーを修正した結果、システムが安定しました。',
    grammar: '【関係代名詞】非制限用法（コンマ＋which）。前の文全体（エラーを修正したこと）を先行詞とし、補足説明・結果を表す。'
  },
  { 
    text: 'This is the office environment in which we develop software.', 
    phonetic: '/ðɪs ɪz ðiː ˈɒf.ɪs ɪnˈvaɪ.rən.mənt ɪn wɪtʃ wiː dɪˈvel.əp ˈsɒft.weər./', 
    translation: 'これが私たちがソフトウェアを開発しているオフィス環境です。',
    grammar: '【前置詞＋関係代名詞】in which の構造。where に書き換え可能。develop software in the environment の in が前に出た形。'
  },

  // --- 条件・仮定法 (41-50) ---
  { 
    text: 'If we allocate more resources, we can finish earlier.', 
    phonetic: '/ɪf wiː ˈæl.ə.keɪt mɔːr rɪˈzɔː.sɪz, wiː kæn ˈfɪn.ɪʃ ˈɜː.li.ər./', 
    translation: 'より多くのリソースを割り当てれば、もっと早く終わらせることができます。',
    grammar: '【条件節】現実の可能性を表す条件の If（直説法）。未来のことだが、If節の中は現在形（allocate）にするルール。'
  },
  { 
    text: 'If I were you, I would rewrite this function.', 
    phonetic: '/ɪf aɪ wɜːr juː, aɪ wʊd ˌriːˈraɪt ðɪs ˈfʌŋk.ʃən./', 
    translation: 'もし私があなたなら、この関数を書き直すでしょう。',
    grammar: '【仮定法】現在の事実とは異なる想定を表す仮定法過去。If節のbe動詞は official には were を使い、主節に would を置く。'
  },
  { 
    text: 'Unless we fix this error, we cannot release tomorrow.', 
    phonetic: '/ʌnˈles wiː fɪks ðɪs ˈer.ər, wiː ˈkæn.ɒt rɪˈliːs təˈmɒr.oʊ./', 
    translation: 'このエラーを修正しない限り、明日リリースすることはできません。',
    grammar: '【接続詞】Unless（〜でない限り、もし〜なければ）。if not と同様の否定条件を表す副詞節を作る。'
  },
  { 
    text: 'Had we known the risk, we would have changed plans.', 
    phonetic: '/hæd wiː noʊn ðə rɪsk, wiː wʊd hæv tʃeɪndʒd plænz./', 
    translation: 'もしリスクを知っていたら、計画を変更していただろう。',
    grammar: '【仮定法・倒置】仮定法過去完了（If we had known...）の If が省略され、Had が文頭に飛び出した倒置（強調）表現。'
  },
  { 
    text: 'I wish we had automated the test suite earlier.', 
    phonetic: '/aɪ wɪʃ wiː hæd ˈɔː.tə.meɪt.ɪd ðə test swiːt ˈɜː.li.ər./', 
    translation: 'もっと早くテストスイートを自動化しておけばよかったです。',
    grammar: '【仮定法】「I wish + 過去完了形」で、過去のことに対する現在の後悔や願望（〜だったらよかったのに）を表す。'
  },
  { 
    text: 'As long as the API is stable, development will proceed.', 
    phonetic: '/æz lɒŋ æz ðiː eɪ.pi.aɪ ɪz ˈsteɪ.bəl, dɪˈvel.əp.mənt wɪl prəˈsiːd./', 
    translation: 'APIが安定している限り、開発は進行します。',
    grammar: '【接続詞】as long as（〜する限りは、〜という条件であれば）。期間や条件の限界を限定する表現。'
  },
  { 
    text: 'In case the server goes down, use the backup.', 
    phonetic: '/ɪn keɪs ðə ˈsɜː.vər ɡoʊz daʊn, juːz ðə ˈbæk.ʌp./', 
    translation: 'サーバーがダウンした場合は、バックアップを使用してください。',
    grammar: '【接続詞】in case（〜する場合に備えて、万が一〜なら）。不測の事態への備えを表す副詞節。'
  },
  { 
    text: 'We should document the steps so that anyone can deploy.', 
    phonetic: '/wiː ʃʊd ˈdɒk.jə.ment ðə steps soʊ ðæt ˈen.i.wʌn kæn dɪˈplɔɪ./', 
    translation: '誰でもデプロイできるように、手順をドキュメント化すべきです。',
    grammar: '【接続詞】目的・意図を表す「so that + 主語 + can/may」の構文（〜するために、〜できるように）。'
  },
  { 
    text: 'Even if it takes time, security must be prioritized.', 
    phonetic: '/ˈiː.vən ɪf ɪt teɪks taɪm, sɪˈkjʊə.rə.ti mʌst biː praɪˈɒr.ɪ.taɪzd./', 
    translation: '時間がかかったとしても、セキュリティを最優先しなければならない。',
    grammar: '【接続詞】譲歩を表す even if（たとえ〜だとしても）。must be prioritized（優先されねばならない）の受動態。'
  },
  { 
    text: 'Provided that the budget is approved, we will hire you.', 
    phonetic: '/prəˈvaɪ.dɪd ðæt ðə ˈbʌdʒ.ɪt ɪz əˈpruːvd, wiː wɪl ˈhaɪər juː./', 
    translation: '予算が承認されるという条件で、私たちはあなたを雇用します。',
    grammar: '【接続詞】条件を表す分詞由来の接続詞 provided that（もし〜ならば、〜という条件で）。ifの硬いビジネス表現。'
  },

  // --- 比較・否定・強調・その他重要構文 (51-60) ---
  { 
    text: 'The new algorithm is twice as fast as the old one.', 
    phonetic: '/ðə njuː ˈæl.ɡə.rɪ.ðəm ɪz twaɪs æz fɑːst æz ðiː oʊld wʌn./', 
    translation: '新しいアルゴリズムは古いものの2倍の速さです。',
    grammar: '【比較】倍数表現（倍数詞 + as + 原級 + as）。代名詞 one は algorithm の繰り返しを避けるための代用。'
  },
  { 
    text: 'The more features we add, the more complex it becomes.', 
    phonetic: '/ðə mɔːr ˈfiː.tʃəz wiː æd, ðə mɔːr ˈkɒm.pleks ɪt bɪˈkʌmz./', 
    translation: '機能を追加すればするほど、それはより複雑になります。',
    grammar: '【比較】「The + 比較級, the + 比較級」の構文（〜すればするほど、ますます…になる）。比例関係の強調。'
  },
  { 
    text: 'This is the most critical issue that we have ever faced.', 
    phonetic: '/ðɪs ɪz ðə moʊst ˈkrɪt.ɪ.kəl ˈɪʃ.uː ðæt wiː hæv ˈev.ər feɪst./', 
    translation: 'これは私たちがこれまで直面した中で最も致命的な問題です。',
    grammar: '【比較・完了形】最高級（the most...）＋関係代名詞節内の現在完了（have ever faced：これまで〜した中で）。定番の最上級強調。'
  },
  { 
    text: 'Little did we expect that the system would crash today.', 
    phonetic: '/ˈlɪt.əl dɪd wiː ɪkˈspekt ðæt ðə ˈsɪs.təm wʊd kræʃ təˈdeɪ./', 
    translation: '今日システムがクラッシュするとは夢にも思わなかった。',
    grammar: '【否定・倒置】準否定の副詞 Little（ほとんど〜ない）が文頭に出たため、後ろの疑問文の語順（did we expect）になる倒置構文。'
  },
  { 
    text: 'It was the senior engineer who resolved the connection issue.', 
    phonetic: '/ɪt wɒz ðə ˈsiː.ni.ər ˌen.dʒɪˈnɪər huː rɪˈzɒlvd ðə kəˈnek.ʃən ˈɪʃ.uː./', 
    translation: '接続問題を解決したのは、そのシニアエンジニアだった。',
    grammar: '【強調構文】「It is/was ... that/who」の強調構文。挟まれた「the senior engineer」が文の中で強く強調されている。'
  },
  { 
    text: 'Not only did they find the bug, but they also fixed it.', 
    phonetic: '/nɒt ˈoʊn.li dɪd ðeɪ faɪnd ðə bʌɡ, bʌt ðeɪ ˈɔːl.soʊ fɪkst ɪt./', 
    translation: '彼らはバグを見つけただけでなく、それを修正しさえした。',
    grammar: '【否定・倒置】「Not only A, but also B」の Aの部分に否定語が文頭に出たため、倒置（did they find）が発生している重要構文。'
  },
  { 
    text: 'The code is simple enough for beginners to understand.', 
    phonetic: '/ðə koʊd ɪz ˈsɪm.pəl ɪˈnʌf fɔːr bɪˈɡɪn.əz tuː ˌʌn.dəˈstænd./', 
    translation: 'そのコードは初心者でも理解できるほど十分にシンプルです。',
    grammar: '【不定詞】「形容詞 + enough + for (意味上の主語) + to do」の構文（〜が…するのに十分なほど〜だ）。'
  },
  { 
    text: 'We found it difficult to reproduce the user interface error.', 
    phonetic: '/wiː faʊnd ɪt ˈdɪf.ɪ.kəlt tuː ˌriː.prəˈdʒuːs ðə ˈjuː.zər ˈɪn.tə.feɪs ˈer.ər./', 
    translation: 'ユーザーインターフェースのエラーを再現するのは難しいと分かった。',
    grammar: '【文型・形式目的語】SVOCの第5文型。形式目的語の it を置き、真の目的語を後ろの不定詞（to reproduce...）で示す構文。'
  },
  { 
    text: 'No other task is more important than updating the documentation.', 
    phonetic: '/noʊ ˈʌð.ər tɑːsk ɪz mɔːr ɪmˈpɔː.tənt ðæn ʌpˈdeɪ.tɪŋ ðə ˌdɒk.jə.menˈteɪ.ʃən./', 
    translation: 'ドキュメントの更新ほど重要なタスクは他にありません。',
    grammar: '【比較】否定主語（No other...）を用いた比較級による最上級の意味の表現（Bほど〜なものは他にない＝Bが最高だ）。'
  },
  { 
    text: 'The project was successfully completed ahead of schedule.', 
    phonetic: '/ðə ˈprɒdʒ.ekt wɒz səkˈses.fəl.i kəmˈpliː.tɪd əˈhed ɒv ˈskedʒ.uːl./', 
    translation: 'プロジェクトは予定より早く無事に完了しました。',
    grammar: '【受動態・熟語】過去の受動態。「ahead of schedule（定刻より早く、予定を前倒しして）」というビジネス最重要熟語。'
  }
];