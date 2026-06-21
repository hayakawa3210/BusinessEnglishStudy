// シャドーイング用の英文リスト
var SHADOWING_SENTENCES = [
  { text: 'The meeting starts at nine o’clock.', phonetic: '/ðə ˈmiː.tɪŋ stɑːrts æt naɪn əˈklɑːk./', translation: '会議は9時に始まります。' },
  { text: 'Please send the revised schedule by this afternoon.', phonetic: '/pliːz sɛnd ðə rɪˈvaɪzd ˈskedʒ.uːl baɪ ðɪs ˌɑːf.təˈnuːn./', translation: '修正したスケジュールを今日の午後までに送ってください。' },
  { text: 'I will follow up with the client tomorrow.', phonetic: '/aɪ wɪl ˈfɒl.oʊ ʌp wɪð ðə ˈklaɪ.ənt təˈmɒr.oʊ./', translation: '明日クライアントにフォローします。' },
  { text: 'Our team needs to finalize the budget today.', phonetic: '/aʊər tiːm niːdz tə ˈfaɪ.nə.laɪz ðə ˈbʌdʒ.ɪt təˈdeɪ./', translation: '私たちのチームは今日予算を最終決定する必要があります。' },
  { text: 'Could you explain the key deliverables once more?', phonetic: '/kʊd juː ɪkˈspleɪn ðə kiː dɪˈlɪv.ər.ə.bəlz wʌns mɔːr?/', translation: '主要な成果物をもう一度説明していただけますか？' },
  { text: 'We are waiting for final approval from the board.', phonetic: '/wiː ɑːr ˈweɪ.tɪŋ fɔːr ˈfaɪ.nəl əˈpruː.vəl frəm ðə bɔːrd./', translation: '取締役会からの最終承認を待っています。' },
  { text: 'The product launch has been postponed until next month.', phonetic: '/ðə ˈprɒd.ʌkt lɔːntʃ hæz bɪn pəˈspoʊnd ʌnˈtɪl nɛkst mʌnθ./', translation: '製品の発売は来月まで延期されました。' },
  { text: 'Let’s review the quarterly targets in the next meeting.', phonetic: '/lɛts rɪˈvjuː ðə ˈkwɔːr.tɚ.li ˈtɑːr.ɡəts ɪn ðə nɛkst ˈmiː.tɪŋ./', translation: '次の会議で四半期目標を確認しましょう。' },
  { text: 'Our current strategy needs a little more refinement.', phonetic: '/aʊər ˈkʌr.ənt ˈstræt.ə.dʒi niːdz ə ˈlɪt.əl mɔːr rɪˈfaɪn.mənt./', translation: '現在の戦略はもう少し改善が必要です。' },
  { text: 'I appreciate your prompt response on this issue.', phonetic: '/aɪ əˈpriː.ʃi.eɪt jɔːr prɒmpt rɪˈspɒns ɒn ðɪs ˈɪʃ.uː./', translation: 'この件について迅速なご対応に感謝します。' },

  // 追加するシャドーイング用の英文リスト（50問）
  // --- 助動詞・完了形・受動態 (1-10) ---
  { text: 'We must implement the security patches immediately.', phonetic: '/wiː mʌst ˈɪm.plɪ.ment ðə sɪˈkjʊə.rə.ti pætʃ.ɪz ɪˈmiː.di.ət.li./', translation: '私たちはすぐにセキュリティパッチを実装しなければならない。' },
  { text: 'The server migration has already been completed successfully.', phonetic: '/ðə ˈsɜː.vər maɪˈɡreɪ.ʃən hæz ɔːlˈred.i biːn kəmˈpliː.tɪd səkˈses.fəl.i./', translation: 'サーバーの移行はすでに正常に完了しています。' },
  { text: 'This feature should be thoroughly tested by tomorrow.', phonetic: '/ðɪs ˈfiː.tʃər ʃʊd biː ˈθʌr.ə.li ˈtes.tɪd baɪ təˈmɒr.oʊ./', translation: 'この機能は明日までに徹底的にテストされるべきです。' },
  { text: 'The bug has been causing system crashes since yesterday.', phonetic: '/ðə bʌɡ hæz biːn ˈkɔː.zɪŋ ˈsɪs.təm kræʃ.ɪz sɪns ˈjes.tə.deɪ./', translation: '昨日からそのバグが原因でシステムがクラッシュし続けている。' },
  { text: 'We have just deployed the new version to staging.', phonetic: '/wiː hæv dʒʌst dɪˈplɔɪd ðə njuː ˈvɜː.ʒən tuː ˈsteɪ.dʒɪŋ./', translation: '新しいバージョンをステージング環境にデプロイしたところです。' },
  { text: 'The API specifications were updated by the backend team.', phonetic: '/ðiː eɪ.pi.aɪ ˌspes.ɪ.fɪˈkeɪ.ʃənz wɜːr ʌpˈdeɪ.tɪd baɪ ðə ˈbæk.end tiːm./', translation: 'API仕様書はバックエンドチームによって更新されました。' },
  { text: 'You do not have to modify the database schema.', phonetic: '/juː duː nɒt hæv tuː ˈmɒd.ɪ.faɪ ðə ˈdeɪ.tə.beɪs ˈskiː.mə./', translation: 'データベースのスキーマを変更する必要はありません。' },
  { text: 'The project manager may change the release schedule tonight.', phonetic: '/ðə ˈprɒdʒ.ekt ˈmæn.ɪ.dʒər meɪ tʃeɪndʒ ðə rɪˈliːs ˈskedʒ.uːl təˈnaɪt./', translation: 'プロジェクトマネージャーは今夜、リリーススケジュールを変更するかもしれません。' },
  { text: 'The system requirements have changed significantly over time.', phonetic: '/ðə ˈsɪs.təm rɪˈkwaɪə.mənts hæv tʃeɪndʒd sɪɡˈnɪf.ɪ.kənt.li ˈoʊ.vər taɪm./', translation: 'システムの要件は時間の経過とともに大きく変わりました。' },
  { text: 'All code must be reviewed before it is merged.', phonetic: '/ɔːl koʊd mʌst biː rɪˈvjuːd bɪˈfɔːr ɪt ɪz mɜːrdʒd./', translation: 'すべてのコードはマージされる前にレビューされなければならない。' },

  // --- 不定詞・動名詞・分詞構文 (11-20) ---
  { text: 'I managed to resolve the critical merge conflict.', phonetic: '/aɪ ˈmæn.ɪdʒd tuː rɪˈzɒlv ðə ˈkrɪt.ɪ.kəl mɜːrdʒ ˈkɒn.flɪkt./', translation: '重大なマージ衝突をなんとか解決することができた。' },
  { text: 'Our main goal is to optimize the query performance.', phonetic: '/aʊər meɪn ɡoʊl ɪz tuː ˈɒp.tɪ.maɪz ðə ˈkwɪə.ri pəˈfɔː.məns./', translation: '私たちの主な目標は、クエリーのパフォーマンスを最適化することです。' },
  { text: 'They decided to postpone the deployment until next Tuesday.', phonetic: '/ðeɪ dɪˈsaɪ.dɪd tuː pəˈspoʊn ðə dɪˈplɔɪ.mənt ʌnˈtɪl next ˈtʃuːz.deɪ./', translation: '彼らはデプロイを次の火曜日まで延期することに決めた。' },
  { text: 'We finished refactoring the legacy code this morning.', phonetic: '/wiː ˈfɪn.ɪʃt ˌriːˈfæk.tər.ɪŋ ðə ˈleɡ.ə.si koʊd ðɪs ˈmɔː.nɪŋ./', translation: '今朝、レガシーコードのリファクタリングを終えました。' },
  { text: 'Avoid hardcoding confidential information in your program.', phonetic: '/əˈvɔɪd ˈhɑːdˌkoʊd.ɪŋ ˌkɒn.fɪˈden.ʃəl ˌɪn.fəˈmeɪ.ʃən ɪn jɔːr ˈproʊ.ɡræm./', translation: 'プログラム内に機密情報をハードコードすることは避けてください。' },
  { text: 'The function used to validate user input has bugs.', phonetic: '/ðə ˈfʌŋk.ʃən juːzd tuː ˈvæl.ɪ.deɪt ˈjuː.zər ˈɪn.pʊt hæz bʌɡz./', translation: 'ユーザー入力を検証するために使われていた関数にバグがあります。' },
  { text: 'Developing this application requires advanced skills in JavaScript.', phonetic: '/dɪˈvel.ə.pɪŋ ðɪs ˌæp.lɪˈkeɪ.ʃən rɪˈkwaɪəz ədˈvɑːnst skɪlz ɪn ˈdʒɑː.və.skrɪpt./', translation: 'このアプリケーションの開発にはJavaScriptの高度なスキルが必要です。' },
  { text: 'Faced with multiple blockers, we requested technical support.', phonetic: '/feɪst wɪð ˈmʌl.tɪ.pəl ˈblɒk.əz, wiː rɪˈkwes.tɪd ˈtek.nɪ.kəl səˈpɔːt./', translation: '複数の障害に直面したため、私たちは技術サポートを要請した。' },
  { text: 'The team worked hard, keeping the deadline in mind.', phonetic: '/ðə tiːm wɜːkt hɑːd, ˈkiː.pɪŋ ðə ˈded.laɪn ɪn maɪnd./', translation: 'チームは締め切りを念頭に置いて懸命に働いた。' },
  { text: 'It is worth upgrading the database to the latest version.', phonetic: '/ɪt ɪz wɜːθ ʌpˈɡreɪ.dɪŋ ðə ˈdeɪ.tə.beɪs tuː ðə ˈleɪ.tɪst ˈvɜː.ʒən./', translation: 'データベースを最新バージョンにアップグレードする価値はあります。' },

  // --- 関係代名詞・関係副詞 (21-30) ---
  { text: 'This is the repository which contains the core logic.', phonetic: '/ðɪs ɪz ðə rɪˈpɒz.ɪ.tər.i wɪtʃ kənˈteɪnz ðə kɔːr ˈlɒdʒ.ɪk./', translation: 'これがコアロジックを含んでいるリポジトリです。' },
  { text: 'We hired an engineer whose expertise is cloud architecture.', phonetic: '/wiː ˈhaɪəd ən ˌen.dʒɪˈnɪər huːz ˌek.spɜːˈtiːz ɪz klaʊd ˈɑː.kɪ.tek.tʃər./', translation: '私たちはクラウドアーキテクチャを専門とするエンジニアを雇った。' },
  { text: 'The reason why the application crashed is still unknown.', phonetic: '/ðə ˈriː.zən waɪ ðiː ˌæp.lɪˈkeɪ.ʃən kræʃt ɪz stɪl ʌnˈnoʊn./', translation: 'アプリケーションがクラッシュした理由はまだ不明です。' },
  { text: 'Please report any issues that you find during testing.', phonetic: '/pliːz rɪˈpɔːt ˈen.i ˈɪʃ.uːz ðæt juː faɪnd ˈdjʊə.rɪŋ ˈtest.ɪŋ./', translation: 'テスト中に見つけた問題はどれでも報告してください。' },
  { text: 'That is exactly what the client requested last week.', phonetic: '/ðæt ɪz ɪɡˈzækt.li wɒt ðə ˈklaɪ.ənt rɪˈkwes.tɪd lɑːst wiːk./', translation: 'それこそが、まさにクライアントが先週要求したことです。' },
  { text: 'The tool we are using simplifies the workflow considerably.', phonetic: '/ðə tuːl wiː ɑːr ˈjuː.zɪŋ ˈsɪm.plɪ.faɪz ðə ˈwɜːk.floʊ kənˈsɪd.ər.ə.bli./', translation: '私たちが使っているツールは、ワークフローをかなり単純化してくれます。' },
  { text: 'GitHub is the platform where developers share their code.', phonetic: '/ˈɡɪt.hʌb ɪz ðə ˈplæt.fɔːm weər dɪˈvel.ə.pəz ʃeər ðeər koʊd./', translation: 'GitHubは開発者がコードを共有するプラットフォームです。' },
  { text: 'Whoever discovers the cause of the bug will get a prize.', phonetic: '/huːˈev.ər dɪˈskʌv.əz ðə kɔːz ɒv ðə bʌɡ wɪl ɡet ə praɪz./', translation: 'バグの原因を発見した人は誰でも賞品を受け取ります。' },
  { text: 'We fixed the error, which made the system stable.', phonetic: '/wiː fɪkst ðiː ˈer.ər, wɪtʃ meɪd ðə ˈsɪs.təm ˈsteɪ.bəl./', translation: 'エラーを修正した結果、システムが安定しました。' },
  { text: 'This is the office environment in which we develop software.', phonetic: '/ðɪs ɪz ðiː ˈɒf.ɪs ɪnˈvaɪ.rən.mənt ɪn wɪtʃ wiː dɪˈvel.əp ˈsɒft.weər./', translation: 'これが私たちがソフトウェアを開発しているオフィス環境です。' },

  // --- 条件・仮定法 (31-40) ---
  { text: 'If we allocate more resources, we can finish earlier.', phonetic: '/ɪf wiː ˈæl.ə.keɪt mɔːr rɪˈzɔː.sɪz, wiː kæn ˈfɪn.ɪʃ ˈɜː.li.ər./', translation: 'より多くのリソースを割り当てれば、もっと早く終わらせることができます。' },
  { text: 'If I were you, I would rewrite this function.', phonetic: '/ɪf aɪ wɜːr juː, aɪ wʊd ˌriːˈraɪt ðɪs ˈfʌŋk.ʃən./', translation: 'もし私があなたなら、この関数を書き直すでしょう。' },
  { text: 'Unless we fix this error, we cannot release tomorrow.', phonetic: '/ʌnˈles wiː fɪks ðɪs ˈer.ər, wiː ˈkæn.ɒt rɪˈliːs təˈmɒr.oʊ./', translation: 'このエラーを修正しない限り、明日リリースすることはできません。' },
  { text: 'Had we known the risk, we would have changed plans.', phonetic: '/hæd wiː noʊn ðə rɪsk, wiː wʊd hæv tʃeɪndʒd plænz./', translation: 'もしリスクを知っていたら、計画を変更していただろう。' },
  { text: 'I wish we had automated the test suite earlier.', phonetic: '/aɪ wɪʃ wiː hæd ˈɔː.tə.meɪt.ɪd ðə test swiːt ˈɜː.li.ər./', translation: 'もっと早くテストスイートを自動化しておけばよかったです。' },
  { text: 'As long as the API is stable, development will proceed.', phonetic: '/æz lɒŋ æz ðiː eɪ.pi.aɪ ɪz ˈsteɪ.bəl, dɪˈvel.əp.mənt wɪl prəˈsiːd./', translation: 'APIが安定している限り、開発は進行します。' },
  { text: 'In case the server goes down, use the backup.', phonetic: '/ɪn keɪs ðə ˈsɜː.vər ɡoʊz daʊn, juːz ðə ˈbæk.ʌp./', translation: 'サーバーがダウンした場合は、バックアップを使用してください。' },
  { text: 'We should document the steps so that anyone can deploy.', phonetic: '/wiː ʃʊd ˈdɒk.jə.ment ðə steps soʊ ðæt ˈen.i.wʌn kæn dɪˈplɔɪ./', translation: '誰でもデプロイできるように、手順をドキュメント化すべきです。' },
  { text: 'Even if it takes time, security must be prioritized.', phonetic: '/ˈiː.vən ɪf ɪt teɪks taɪm, sɪˈkjʊə.rə.ti mʌst biː praɪˈɒr.ɪ.taɪzd./', translation: '時間がかかったとしても、セキュリティを最優先しなければならない。' },
  { text: 'Provided that the budget is approved, we will hire you.', phonetic: '/prəˈvaɪ.dɪd ðæt ðə ˈbʌdʒ.ɪt ɪz əˈpruːvd, wiː wɪl ˈhaɪər juː./', translation: '予算が承認されるという条件で、私たちはあなたを雇用します。' },

  // --- 比較・否定・強調・その他重要構文 (41-50) ---
  { text: 'The new algorithm is twice as fast as the old one.', phonetic: '/ðə njuː ˈæl.ɡə.rɪ.ðəm ɪz twaɪs æz fɑːst æz ðiː oʊld wʌn./', translation: '新しいアルゴリズムは古いものの2倍の速さです。' },
  { text: 'The more features we add, the more complex it becomes.', phonetic: '/ðə mɔːr ˈfiː.tʃəz wiː æd, ðə mɔːr ˈkɒm.pleks ɪt bɪˈkʌmz./', translation: '機能を追加すればするほど、それはより複雑になります。' },
  { text: 'This is the most critical issue that we have ever faced.', phonetic: '/ðɪs ɪz ðə moʊst ˈkrɪt.ɪ.kəl ˈɪʃ.uː ðæt wiː hæv ˈev.ər feɪst./', translation: 'これは私たちがこれまで直面した中で最も致命的な問題です。' },
  { text: 'Little did we expect that the system would crash today.', phonetic: '/ˈlɪt.əl dɪd wiː ɪkˈspekt ðæt ðə ˈsɪs.təm wʊd kræʃ təˈdeɪ./', translation: '今日システムがクラッシュするとは夢にも思わなかった。' },
  { text: 'It was the senior engineer who resolved the connection issue.', phonetic: '/ɪt wɒz ðə ˈsiː.ni.ər ˌen.dʒɪˈnɪər huː rɪˈzɒlvd ðə kəˈnek.ʃən ˈɪʃ.uː./', translation: '接続問題を解決したのは、そのシニアエンジニアだった（強調）。' },
  { text: 'Not only did they find the bug, but they also fixed it.', phonetic: '/nɒt ˈoʊn.li dɪd ðeɪ faɪnd ðə bʌɡ, bʌt ðeɪ ˈɔːl.soʊ fɪkst ɪt./', translation: '彼らはバグを見つけただけでなく、それを修正しさえした。' },
  { text: 'The code is simple enough for beginners to understand.', phonetic: '/ðə koʊd ɪz ˈsɪm.pəl ɪˈnʌf fɔːr bɪˈɡɪn.əz tuː ˌʌn.dəˈstænd./', translation: 'そのコードは初心者でも理解できるほど十分にシンプルです。' },
  { text: 'We found it difficult to reproduce the user interface error.', phonetic: '/wiː faʊnd ɪt ˈdɪf.ɪ.kəlt tuː ˌriː.prəˈdʒuːs ðə ˈjuː.zər ˈɪn.tə.feɪs ˈer.ər./', translation: 'ユーザーインターフェースのエラーを再現するのは難しいと分かった。' },
  { text: 'No other task is more important than updating the documentation.', phonetic: '/noʊ ˈʌð.ər tɑːsk ɪz mɔːr ɪmˈpɔː.tənt ðæn ʌpˈdeɪ.tɪŋ ðə ˌdɒk.jə.menˈteɪ.ʃən./', translation: 'ドキュメントの更新ほど重要なタスクは他にありません。' },
  { text: 'The project was successfully completed ahead of schedule.', phonetic: '/ðə ˈprɒdʒ.ekt wɒz səkˈses.fəl.i kəmˈpliː.tɪd əˈhed ɒv ˈskedʒ.uːl./', translation: 'プロジェクトは予定より早く無事に完了しました。' }
];
