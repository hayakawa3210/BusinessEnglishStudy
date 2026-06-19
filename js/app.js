// 辞書データプール
const VOCABULARY_POOL = [
  { w: 'agenda', m: '協議事項、議題', p: '/əˈdʒen.də/', e: 'What is on the agenda for today’s meeting?', j: '今日の会議の議題は何ですか？' },
  { w: 'allocate', m: '配分する、割り当てる', p: '/ˈæl.ə.keɪt/', e: 'We need to allocate resources efficiently.', j: '私たちは資源を効率的に配分する必要がある。' },
  { w: 'collaborate', m: '共同で働く、協力する', p: '/kəˈlæb.ə.reɪt/', e: 'Let’s collaborate on this new project.', j: 'この新しいプロジェクトで協力しましょう。' },
  { w: 'comply', m: '従う、順守する', p: '/kəmˈplaɪ/', e: 'All products must comply with safety standards.', j: 'すべての製品は安全基準を順守しなければならない。' },
  { w: 'negotiate', m: '交渉する', p: '/nəˈɡoʊ.ʃi.eɪt/', e: 'She managed to negotiate a better contract.', j: '彼女はより良い契約を交渉で勝ち取った。' },
  { w: 'revenue', m: '収益、歳入', p: '/ˈrev.ə.nuː/', e: 'The company reported a 10% increase in revenue.', j: 'その会社は収益の10%増加を報告した。' },
  { w: 'implement', m: '実行する、実施する', p: '/ˈɪm.plə.ment/', e: 'We will implement the new strategy next month.', j: '来月、新しい戦略を実施します。' },
  { w: 'feasible', m: '実現可能な', p: '/ˈfiː.zə.bəl/', e: 'The plan is financially feasible.', j: 'その計画は財政的に実現可能だ。' },
  { w: 'discrepancy', m: '不一致、食い違い', p: '/dɪˈskrep.ən.si/', e: 'We found a discrepancy in the financial report.', j: '財務報告書に不一致が見つかりました。' },
  { w: 'incentive', m: '動機、励み、インセンティブ', p: '/ɪnˈsen.tɪv/', e: 'The company offers cash incentives for good performance.', j: '会社は優れた業績に対して現金のインセンティブを提供している。' }
];

const LESSON_STEPS = [
  { id: 1, name: 'Vocabulary', type: 'Lesson 1' },
  { id: 2, name: 'News', type: 'Lesson 2' },
  { id: 3, name: 'Conversation', type: 'Lesson 3' },
  { id: 4, name: 'Writing', type: 'Lesson 4' }
];

let deferredPrompt = null;

const App = {
  state: {
    currentScreen: 'home', currentLessonStep: 1,
    quizList: [], currentQuizIndex: 0, hasAnswered: false, scoreIncrement: 0,
    newsData: null, currentNewsQuizIndex: 0,
    chatTurnCount: 0, chatHistory: [], isChatActive: true,
    todayWords: 0, todayNews: 0, todayConv: 0, todayWriting: 0,
    lessonStartTime: null
  },

  init() {
    this.bindEvents();
    this.renderLessonList();
    this.loadDashboardData();
    this.setupPWAInstallation();
    
    const savedKey = localStorage.getItem('gemini_key');
    if (savedKey) {
      ['apiKeyInput', 'convApiKeyInput', 'writingApiKeyInput'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = savedKey;
      });
    }
  },

  bindEvents() {
    document.body.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action && this.actions[action]) this.actions[action](this);
    });

    document.getElementById('chatInputField').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !document.getElementById('chatSendBtn').disabled) {
        this.handleUserSendMessage();
      }
    });
  },

  switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`${screenName}Screen`).classList.add('active');
    this.state.currentScreen = screenName;
  },

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  setupPWAInstallation() {
    const banner = document.getElementById('pwaBanner');
    const btn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      banner.style.display = 'flex';
    });

    btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      banner.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User choice: ${outcome}`);
      deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
      banner.style.display = 'none';
      console.log('App installed successfully');
    });
  },

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  saveLearningLog(sessionMinutes) {
    const logs = JSON.parse(localStorage.getItem('learningLogs') || '{}');
    const todayStr = this.getTodayDateString();

    if (!logs[todayStr]) {
      logs[todayStr] = { words: 0, news: 0, conversation: 0, writing: 0, minutes: 0 };
    }

    logs[todayStr].words += this.state.todayWords;
    logs[todayStr].news += this.state.todayNews;
    logs[todayStr].conversation += this.state.todayConv;
    logs[todayStr].writing += this.state.todayWriting;
    logs[todayStr].minutes += sessionMinutes;

    localStorage.setItem('learningLogs', JSON.stringify(logs));

    this.state.todayWords = 0; this.state.todayNews = 0; this.state.todayConv = 0; this.state.todayWriting = 0;
    this.loadDashboardData();
  },

  loadDashboardData() {
    const logs = JSON.parse(localStorage.getItem('learningLogs') || '{}');
    let totalMinutes = 0, weeklyMinutes = 0;
    const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    Object.keys(logs).forEach(dateStr => {
      const log = logs[dateStr];
      totalMinutes += log.minutes || 0;
      if (new Date(dateStr) >= oneWeekAgo) weeklyMinutes += log.minutes || 0;
    });

    let streak = 0; let checkDate = new Date();
    while (true) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (logs[checkStr]) {
        streak++; checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (logs[yesStr]) { checkDate.setDate(checkDate.getDate()); continue; }
        }
        break;
      }
    }

    document.getElementById('dashStreak').textContent = streak;
    document.getElementById('dashWeeklyTime').textContent = Math.round(weeklyMinutes);
    document.getElementById('dashTotalTime').textContent = Math.round(totalMinutes);
    document.getElementById('streakValue').textContent = `${streak} days`;
  },

  renderHistoryScreen() {
    const logs = JSON.parse(localStorage.getItem('learningLogs') || '{}');
    const sortedDates = Object.keys(logs).sort((a, b) => new Date(b) - new Date(a));
    const listEl = document.getElementById('historyLogList');

    if(sortedDates.length === 0) {
      listEl.innerHTML = `<p style="text-align:center; padding:40px; color:var(--color-text-muted);">学習履歴がまだありません</p>`;
      return;
    }

    listEl.innerHTML = sortedDates.map(dateStr => {
      const log = logs[dateStr];
      return `
        <div class="history-card">
          <div class="history-date">${dateStr}</div>
          <div class="history-grid">
            <div>単語クリア: <span class="history-item-metric">${log.words || 0}問</span></div>
            <div>ニュース読了: <span class="history-item-metric">${log.news || 0}本</span></div>
            <div>会話ターン: <span class="history-item-metric">${log.conversation || 0}回</span></div>
            <div>英作文添削: <span class="history-item-metric">${log.writing || 0}回</span></div>
            <div style="grid-column: span 2; margin-top: 4px; padding-top:4px; border-top:1px dashed var(--color-border); font-weight:700;">
              学習時間: <span style="color:var(--color-primary);">${Math.round(log.minutes || 0)} 分</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

async callGeminiAPI(apiKey, contents, isJson = false) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ contents: contents })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    const errorMsg = errorData.error?.message || errorData.message || 'API request failed';
    throw new Error(`API Error (${response.status}): ${errorMsg}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.[0]?.text || data.text || '';
},

  startTodayLessonWorkflow() { this.state.lessonStartTime = new Date(); this.switchScreen('lesson'); },
  renderLessonList() {
    document.getElementById('lessonList').innerHTML = LESSON_STEPS.map(lesson => `
      <div class="lesson-item" id="item-${lesson.id}">
        <div class="step-number">${lesson.id}</div>
        <div class="lesson-info"><span class="lesson-label">${lesson.type}</span><span class="lesson-name">${lesson.name}</span></div>
      </div>
    `).join('');
    this.updateLessonUI();
  },

  updateLessonUI() {
    const { currentLessonStep } = this.state;
    document.getElementById('progressBar').style.width = `${(currentLessonStep / LESSON_STEPS.length) * 100}%`;
    LESSON_STEPS.forEach(lesson => {
      const el = document.getElementById(`item-${lesson.id}`); if(!el) return;
      el.classList.remove('active', 'completed');
      if (lesson.id < currentLessonStep) { el.classList.add('completed'); el.querySelector('.step-number').innerHTML = '✓'; }
      else if (lesson.id === currentLessonStep) { el.classList.add('active'); el.querySelector('.step-number').innerHTML = lesson.id; }
    });
    const btn = document.getElementById('completeBtn');
    btn.classList.toggle('ready', currentLessonStep > LESSON_STEPS.length); btn.disabled = currentLessonStep <= LESSON_STEPS.length;
  },

  startVocabulary() {
    let doublePool = [...VOCABULARY_POOL, ...VOCABULARY_POOL].map(item => ({...item}));
    this.state.quizList = this.shuffle(doublePool).slice(0, 20);
    this.state.currentQuizIndex = 0; this.state.scoreIncrement = 0;
    this.switchScreen('vocab'); this.loadQuiz();
  },

  loadQuiz() {
    this.state.hasAnswered = false; const currentQuiz = this.state.quizList[this.state.currentQuizIndex]; if(!currentQuiz) return;
    document.getElementById('quizProgressInfo').textContent = `Question ${this.state.currentQuizIndex + 1} / 20`;
    document.getElementById('vocabProgressBar').style.width = `${(this.state.currentQuizIndex / 20) * 100}%`;
    document.getElementById('quizWord').textContent = currentQuiz.w;
    const wrongOptions = VOCABULARY_POOL.filter(v => v.w !== currentQuiz.w);
    const selectedOptions = this.shuffle([currentQuiz.m, wrongOptions[0]?.m, wrongOptions[1]?.m, wrongOptions[2]?.m].filter(Boolean));
    document.getElementById('optionsContainer').innerHTML = selectedOptions.map(option => `<button class="btn-option" onclick="App.handleAnswer(this, '${option}')">${option}</button>`).join('');
    document.getElementById('resultBox').style.display = 'none'; document.getElementById('quizActions').style.display = 'none';
    document.getElementById('vocabNextBtn').textContent = this.state.currentQuizIndex === 19 ? '結果を見る' : '次へ';
  },

  handleAnswer(btnElement, val) {
    if (this.state.hasAnswered) return; this.state.hasAnswered = true;
    const currentQuiz = this.state.quizList[this.state.currentQuizIndex];
    const isCorrect = val === currentQuiz.m; document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
    
    this.state.todayWords++;

    if (isCorrect) {
      btnElement.classList.add('correct'); document.getElementById('resultHeader').innerHTML = '〇 正解'; document.getElementById('resultHeader').className = 'result-header correct'; this.state.scoreIncrement += 10;
    } else {
      btnElement.classList.add('wrong'); document.getElementById('resultHeader').innerHTML = '× 不正解'; document.getElementById('resultHeader').className = 'result-header wrong'; document.querySelectorAll('.btn-option').forEach(b => { if(b.textContent === currentQuiz.m) b.classList.add('correct'); });
    }
    document.getElementById('quizPhonetic').textContent = currentQuiz.p; document.getElementById('quizSentenceEn').textContent = currentQuiz.e; document.getElementById('quizSentenceJa').textContent = currentQuiz.j;
    document.getElementById('resultBox').style.display = 'block'; document.getElementById('quizActions').style.display = 'flex';
  },

  retryCurrentQuiz() { this.loadQuiz(); },
  nextQuiz() {
    if (this.state.currentQuizIndex < 19) { this.state.currentQuizIndex++; this.loadQuiz(); }
    else {
      alert(`Vocabulary終了! スコア: +${this.state.scoreIncrement} pts`); this.addGlobalScore(this.state.scoreIncrement);
      this.state.currentLessonStep = 2; this.renderLessonList(); this.switchScreen('lesson');
    }
  },

  async handleNewsGeneration() {
    const key = document.getElementById('apiKeyInput').value.trim(); if(!key) return alert('APIキーを入力してください');
    localStorage.setItem('gemini_key', key); document.getElementById('apiKeyBlock').style.display = 'none'; document.getElementById('newsLoader').style.display = 'block';

    const promptText = "Generate one short English business news article. Output strictly in JSON format matching this schema: { 'title': 'English Title', 'body': 'English news body text (about 3 sentences)', 'summary_ja': 'Detailed Japanese summary', 'difficulty': 'Intermediate', 'toeic': '700+', 'words': [ {'word': 'word1', 'meaning': 'meaning1'}, {'word': 'word2', 'meaning': 'meaning2'}, {'word': 'word3', 'meaning': 'meaning3'}, {'word': 'word4', 'meaning': 'meaning4'}, {'word': 'word5', 'meaning': 'meaning5'} ], 'quizzes': [ {'question': 'Question1?', 'options': ['A', 'B', 'C', 'D'], 'answer': 'A'}, {'question': 'Question2?', 'options': ['A','B','C','D'], 'answer': 'B'}, {'question': 'Question3?', 'options': ['A','B','C','D'], 'answer': 'C'} ] }";
    try {
      const jsonText = await this.callGeminiAPI(key, [{ role: "user", parts: [{ text: promptText }] }], true);
      this.state.newsData = JSON.parse(jsonText); this.state.currentNewsQuizIndex = 0; this.state.todayNews++;
      this.renderNewsContent();
    } catch (e) {
      alert(`ニュース取得エラー:\n${e.message}`); document.getElementById('apiKeyBlock').style.display = 'flex'; document.getElementById('newsLoader').style.display = 'none';
    }
  },

  renderNewsContent() {
    const data = this.state.newsData; document.getElementById('newsLoader').style.display = 'none'; document.getElementById('newsContentBody').style.display = 'block';
    document.getElementById('newsDiff').textContent = `Level: ${data.difficulty}`; document.getElementById('newsToeic').textContent = `TOEIC: ${data.toeic}`;
    document.getElementById('newsTitleEn').textContent = data.title; document.getElementById('newsBodyEn').textContent = data.body; document.getElementById('newsSummaryJa').textContent = data.summary_ja;
    document.getElementById('newsVocabList').innerHTML = data.words.map(w => `<div class="vocab-row-item"><span class="vocab-word-bold">${w.word}</span><span>${w.meaning}</span></div>`).join('');
    this.loadNewsQuiz();
  },

  loadNewsQuiz() {
    const quizData = this.state.newsData.quizzes[this.state.currentNewsQuizIndex];
    document.getElementById('newsQuizNumber').textContent = `Question ${this.state.currentNewsQuizIndex + 1} / 3`;
    document.getElementById('newsQuizContainer').innerHTML = `
      <div class="news-quiz-box active">
        <p class="news-quiz-q">${quizData.question}</p>
        <div class="options-container">
          ${quizData.options.map(opt => `<button class="btn-option" onclick="App.handleNewsQuizAnswer(this, '${opt}', '${quizData.answer}')">${opt}</button>`).join('')}
        </div>
      </div>
    `;
  },

  handleNewsQuizAnswer(btn, selected, correct) {
    document.querySelectorAll('.news-quiz-section .btn-option').forEach(b => b.disabled = true);
    if(selected === correct) { btn.classList.add('correct'); this.addGlobalScore(20); }
    else { btn.classList.add('wrong'); document.querySelectorAll('.news-quiz-section .btn-option').forEach(b => { if(b.textContent === correct) b.classList.add('correct'); }); }
    setTimeout(() => {
      if(this.state.currentNewsQuizIndex < 2) { this.state.currentNewsQuizIndex++; this.loadNewsQuiz(); }
      else { alert('News学習完了！'); this.state.currentLessonStep = 3; this.renderLessonList(); this.switchScreen('lesson'); }
    }, 1500);
  },

  async startConversationLesson() {
    const key = document.getElementById('convApiKeyInput').value.trim(); if(!key) return alert('APIキーを入力してください');
    localStorage.setItem('gemini_key', key); document.getElementById('convApiKeyBlock').style.display = 'none'; document.getElementById('convLoader').style.display = 'block';

    this.state.chatTurnCount = 0; this.state.chatHistory = []; this.state.isChatActive = true;
    document.getElementById('chatMessages').innerHTML = ''; document.getElementById('convFeedbackArea').style.display = 'none';

    const systemInitPrompt = { role: "user", parts: [{ text: "You are an elite business English teacher. Start a realistic business chat conversation suitable for a TOEIC 600 level student. Speak only 1-2 simple sentences and ask a clear question at the end. Speak ONLY in English." }] };
    try {
      const aiResponse = await this.callGeminiAPI(key, [systemInitPrompt]);
      document.getElementById('convLoader').style.display = 'none'; document.getElementById('chatWrapper').style.display = 'flex';
      this.state.chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
      this.appendChatBubble(aiResponse, 'ai'); this.appendChatBubble('第1往復 / 全5回', 'system');
    } catch(e) {
      alert(`講師の起動に失敗:\n${e.message}`); document.getElementById('convApiKeyBlock').style.display = 'flex'; document.getElementById('convLoader').style.display = 'none';
    }
  },

  appendChatBubble(text, sender) {
    const msgContainer = document.getElementById('chatMessages');
    const bubble = document.createElement('div'); bubble.className = `chat-bubble ${sender}`; bubble.textContent = text;
    msgContainer.appendChild(bubble); msgContainer.scrollTop = msgContainer.scrollHeight;
  },

  async handleUserSendMessage() {
    if(!this.state.isChatActive) return;
    const inputEl = document.getElementById('chatInputField'); const userText = inputEl.value.trim(); if(!userText) return;

    inputEl.value = ''; this.state.chatTurnCount++;
    this.appendChatBubble(userText, 'user');
    this.state.chatHistory.push({ role: "user", parts: [{ text: userText }] });
    
    this.state.todayConv++;

    document.getElementById('chatSendBtn').disabled = true; inputEl.disabled = true;
    const key = localStorage.getItem('gemini_key');

    try {
      if (this.state.chatTurnCount < 5) {
        const promptContext = [
          { role: "user", parts: [{ text: "Context: Business English coach, TOEIC 600 level. Reply naturally in 1-2 sentences and ask a follow-up question. Speak ONLY in English." }] },
          ...this.state.chatHistory
        ];
        const aiResponse = await this.callGeminiAPI(key, promptContext);
        this.state.chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
        this.appendChatBubble(aiResponse, 'ai'); this.appendChatBubble(`第${this.state.chatTurnCount + 1}往復 / 全5回', 'system'`);
      } else {
        this.state.isChatActive = false;
        this.appendChatBubble("5往復終了。フィードバックを抽出中...", "system");
        document.getElementById('chatInputBar').style.display = 'none';

        const feedbackPrompt = [
          ...this.state.chatHistory,
          { role: "user", parts: [{ text: "Output strict JSON format with exactly 4 keys explaining everything in Japanese: 'pronunciation', 'grammar', 'naturalness', and 'better_examples'." }] }
        ];
        const jsonResponse = await this.callGeminiAPI(key, feedbackPrompt, true);
        const fb = JSON.parse(jsonResponse);

        document.getElementById('fbPron').textContent = fb.pronunciation;
        document.getElementById('fbGrammar').textContent = fb.grammar;
        document.getElementById('fbNatural').textContent = fb.naturalness;
        document.getElementById('fbExample').textContent = fb.better_examples;
        document.getElementById('convFeedbackArea').style.display = 'flex';
      }
    } catch(e) { console.error(e); alert(`エラー:\n${e.message}`); }
    finally { document.getElementById('chatSendBtn').disabled = false; inputEl.disabled = false; if(this.state.isChatActive) inputEl.focus(); }
  },

  finishConvLesson() { this.addGlobalScore(50); this.state.currentLessonStep = 4; this.renderLessonList(); this.switchScreen('lesson'); },

  startWritingMode() { document.getElementById('writingInitBlock').style.display = 'none'; document.getElementById('writingArea').style.display = 'flex'; document.getElementById('writingFeedbackArea').style.display = 'none'; },
  async submitWritingLesson() {
    const userText = document.getElementById('writingInputField').value.trim(); if(!userText) return alert('英文を入力してください');
    const key = localStorage.getItem('gemini_key'); document.getElementById('writingArea').style.display = 'none'; document.getElementById('writingLoader').style.display = 'block';

    const systemWritingPrompt = [{
      role: "user", parts: [{
        text: `Proofread this business text: "${userText}". Output strict JSON with 6 keys. Explain in Japanese. Schema: { "score": 80, "corrected": "...", "errors": "...", "reason": "...", "naturalness": "...", "business_use": "..." }`
      }]
    }];

    try {
      const jsonResponse = await this.callGeminiAPI(key, systemWritingPrompt, true);
      const result = JSON.parse(jsonResponse);

      document.getElementById('wtScore').textContent = `${result.score} / 100`;
      document.getElementById('wtCorrected').textContent = result.corrected;
      document.getElementById('wtErrors').textContent = result.errors;
      document.getElementById('wtReason').textContent = result.reason;
      document.getElementById('wtNatural').textContent = result.naturalness;
      document.getElementById('wtBusiness').textContent = result.business_use;

      this.state.todayWriting++;

      document.getElementById('writingLoader').style.display = 'none'; document.getElementById('writingFeedbackArea').style.display = 'flex';
    } catch(e) {
      alert(`添削エラー:\n${e.message}`); document.getElementById('writingLoader').style.display = 'none'; document.getElementById('writingArea').style.display = 'flex';
    }
  },

  finishWritingLesson() {
    this.addGlobalScore(100); this.state.currentLessonStep = 5; this.updateLessonUI(); this.switchScreen('lesson');
    alert('🎉 今日の全レッスンステップをクリアしました！素晴らしい集中力です！');
  },

  addGlobalScore(pts) { const el = document.getElementById('scoreValue'); el.textContent = `${parseInt(el.textContent) + pts} pts`; },

  actions: {
    'go-lesson': (ctx) => ctx.startTodayLessonWorkflow(),
    'go-vocab': (ctx) => ctx.startVocabulary(),
    'go-news': (ctx) => ctx.switchScreen('news'),
    'go-conv': (ctx) => ctx.switchScreen('conv'),
    'go-writing': (ctx) => ctx.switchScreen('writing'),
    'go-history': (ctx) => { ctx.renderHistoryScreen(); ctx.switchScreen('history'); },
    'go-home': (ctx) => ctx.switchScreen('home'),
    'vocab-retry': (ctx) => ctx.retryCurrentQuiz(),
    'vocab-next': (ctx) => ctx.nextQuiz(),
    'fetch-news-api': (ctx) => ctx.handleNewsGeneration(),
    'start-chat-api': (ctx) => ctx.startConversationLesson(),
    'send-chat-msg': (ctx) => ctx.handleUserSendMessage(),
    'finish-conv-lesson': (ctx) => ctx.finishConvLesson(),
    'start-writing-mode': (ctx) => ctx.startWritingMode(),
    'submit-writing': (ctx) => ctx.submitWritingLesson(),
    'finish-writing-lesson': (ctx) => ctx.finishWritingLesson(),
    'complete-lesson': (ctx) => {
      let diffMinutes = 10;
      if (ctx.state.lessonStartTime) {
        diffMinutes = (new Date() - ctx.state.lessonStartTime) / 1000 / 60;
      }
      ctx.saveLearningLog(diffMinutes);
      alert('Congratulations! Today\'s Lesson Completed!');
      ctx.state.currentLessonStep = 1; ctx.renderLessonList(); ctx.switchScreen('home');
    },
    'progress': () => alert('Progress Menu'),
    'settings': () => alert('Settings Menu')
  }
};

// アプリの起動
App.init();

// Service Worker の登録
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('ServiceWorker registered with scope: ', reg.scope))
      .catch((err) => console.error('ServiceWorker registration failed: ', err));
  });
}