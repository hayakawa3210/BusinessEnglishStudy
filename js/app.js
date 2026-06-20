// `VOCABULARY_POOL` is loaded from `js/vocab.js` (global `VOCABULARY_POOL` var)


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

  ttsVoices: [],

  init() {
    this.bindEvents();
    this.renderLessonList();
    this.loadDashboardData();
    this.setupPWAInstallation();
    this.prepareTTS();
    
    const savedKey = localStorage.getItem('gemini_key');
    if (savedKey) {
      ['apiKeyInput', 'convApiKeyInput', 'writingApiKeyInput'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = savedKey;
      });
    }
    // 💡 ここを追加！スピーカーボタンを押したら現在の単語を読み上げる
    document.getElementById('btnPlayQuizAudio')?.addEventListener('click', () => {
      const currentWord = document.getElementById('quizWord').textContent;
      if (currentWord) this.speakEnglish(currentWord);
    });
    // 例文を読み上げるボタン
    document.getElementById('btnPlaySentenceAudio')?.addEventListener('click', () => {
      const sentence = document.getElementById('quizSentenceEn')?.textContent || '';
      if (sentence) this.speakEnglish(sentence);
    });
  },

  prepareTTS() {
    if (!('speechSynthesis' in window)) {
      console.warn('TTS is not available in this browser');
      return;
    }

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length) {
        this.ttsVoices = voices;
        console.debug('TTS voices loaded:', voices.map(v => `${v.name} (${v.lang})`));
      }
    };

    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    setTimeout(updateVoices, 2000);
  },

  // 英語のテキストを音声で読み上げる共通関数
  speakEnglish(text, opts = {}) {
    if (!('speechSynthesis' in window)) { console.warn('TTS not supported in this browser'); return; }
    if (!text) return;

    const lang = opts.lang || 'en-US';
    const rate = typeof opts.rate === 'number' ? opts.rate : 0.95;
    let fallbackTried = false;

    const voices = this.ttsVoices.length ? this.ttsVoices : window.speechSynthesis.getVoices() || [];
    const findVoice = (predicate) => voices.find(predicate);
    const preferredNames = [
      'google us english',
      'google uk english',
      'english (us)',
      'english',
    ];
    const preferredVoice = voices.find(v => {
      const name = (v.name || '').toLowerCase();
      const lang = (v.lang || '').toLowerCase();
      return preferredNames.some(keyword => name.includes(keyword) || lang.includes(keyword));
    });
    const chosenVoice = preferredVoice ||
                        findVoice(v => v.lang && v.lang.toLowerCase().startsWith('en-us') && v.localService) ||
                        findVoice(v => v.lang && v.lang.toLowerCase().startsWith('en-us')) ||
                        findVoice(v => v.lang && v.lang.toLowerCase().startsWith('en') && v.localService) ||
                        findVoice(v => v.lang && v.lang.toLowerCase().startsWith('en')) ||
                        voices[0];

    const createUtterance = (voice) => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = rate;
      utter.volume = 1.0;
      utter.pitch = 1.0;
      if (voice) utter.voice = voice;
      return utter;
    };

    const speakRaw = (utter) => {
      utter.onstart = () => console.debug('TTS onstart', utter.voice?.name || 'default');
      utter.onend = () => console.debug('TTS onend');
      utter.onpause = () => console.debug('TTS onpause');
      utter.onresume = () => console.debug('TTS onresume');
      utter.onboundary = (event) => console.debug('TTS onboundary', event.name, event.charIndex, event.charLength);
      utter.onerror = (ev) => {
        console.error('TTS onerror', ev, 'voice:', utter.voice?.name, utter.voice?.lang);
        if (!fallbackTried) {
          fallbackTried = true;
          if (utter.voice) {
            console.warn('Retrying without explicit voice selection');
            speakRaw(createUtterance());
          } else {
            console.warn('TTS failed even without explicit voice');
          }
        }
      };
      try {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          window.speechSynthesis.speak(utter);
          console.debug('TTS speak invoked', { voice: utter.voice?.name, lang: utter.voice?.lang, pitch: utter.pitch, rate: utter.rate, volume: utter.volume });
        }, 20);
      } catch (e) {
        console.error('TTS speak threw', e);
        if (!fallbackTried) {
          fallbackTried = true;
          speakRaw(createUtterance());
        }
      }
    };

    const initial = createUtterance(chosenVoice);
    if (chosenVoice) {
      console.debug('Selected voice:', chosenVoice.name, chosenVoice.lang, 'local:', chosenVoice.localService);
    } else {
      console.warn('No English voice available, speaking with default voice');
    }
    speakRaw(initial);
  },

  playNewsAudio() {
    if (!this.state.newsData) {
      alert('先にニュースを取得してください。');
      return;
    }
    const { title, body } = this.state.newsData;
    this.speakEnglish(`${title}. ${body}`);
  },

  playChatAudio() {
    const latestAi = [...this.state.chatHistory].reverse().find(item => item.role === 'model');
    if (!latestAi) {
      alert('まだAIのメッセージがありません。');
      return;
    }
    const text = latestAi.parts.map(part => part.text).join('');
    this.speakEnglish(text);
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

async callGeminiAPI(apiKey, contents, isJson = false, genConfig = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
  // sensible defaults to increase variation
  const defaultGenConfig = {
    temperature: 0.9,
    topP: 0.95,
    maxOutputTokens: 800,
    candidateCount: 1
  };
  const generationConfig = Object.assign({}, defaultGenConfig, genConfig);
  if (isJson) generationConfig.responseMimeType = "application/json";

  const response = await fetch(url, {
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({ contents: contents, generationConfig })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }
  
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
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
    // Show phonetic under the word for quick reference
    const phonEl = document.getElementById('quizPhoneticInline'); if (phonEl) phonEl.textContent = currentQuiz.p || '';
    const wrongOptions = VOCABULARY_POOL.filter(v => v.w !== currentQuiz.w);
    const selectedOptions = this.shuffle([currentQuiz.m, wrongOptions[0]?.m, wrongOptions[1]?.m, wrongOptions[2]?.m].filter(Boolean));
    document.getElementById('optionsContainer').innerHTML = selectedOptions.map(option => `<button class="btn-option" onclick="App.handleAnswer(this, '${option}')">${option}</button>`).join('');
    document.getElementById('resultBox').style.display = 'none'; document.getElementById('quizActions').style.display = 'none';
    // this.speakEnglish(currentQuiz.w);
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
    // Add a small random jitter to the prompt so the model produces varied output each call
    const jitter = Math.random().toString(36).slice(2,8);
    let promptText = "Generate one short English business news article. Output strictly in JSON format matching this schema: { 'title': 'English Title', 'body': 'English news body text (about 3 sentences)', 'summary_ja': 'Detailed Japanese summary', 'difficulty': 'Intermediate', 'toeic': '700+', 'words': [ {'word': 'word1', 'meaning': 'meaning1'}, {'word': 'word2', 'meaning': 'meaning2'}, {'word': 'word3', 'meaning': 'meaning3'}, {'word': 'word4', 'meaning': 'meaning4'}, {'word': 'word5', 'meaning': 'meaning5'} ], 'quizzes': [ {'question': 'Question1?', 'options': ['A', 'B', 'C', 'D'], 'answer': 'A'}, {'question': 'Question2?', 'options': ['A','B','C','D'], 'answer': 'B'}, {'question': 'Question3?', 'options': ['A','B','C','D'], 'answer': 'C'} ] }";
    promptText += `\n\nVariation seed: ${jitter} — please vary names, numbers, and details accordingly.`;
    try {
      const jsonText = await this.callGeminiAPI(key, [{ role: "user", parts: [{ text: promptText }] }], true, { temperature: 0.9, topP: 0.95 });
      let parsed;
      try {
        parsed = this.safeParseJson(jsonText);
      } catch (parseErr) {
        console.error('Failed to parse JSON from model output:', parseErr, '\nRaw output:\n', jsonText);
        alert('ニュース取得エラー:\n生成結果がJSONとして解析できませんでした。コンソールログを確認してください。');
        document.getElementById('apiKeyBlock').style.display = 'flex'; document.getElementById('newsLoader').style.display = 'none';
        return;
      }

      this.state.newsData = parsed; this.state.currentNewsQuizIndex = 0; this.state.todayNews++;
      // save generated news into local cache for later reading
      try { this.saveNewsToCache(this.state.newsData); } catch(e) { console.warn('failed to cache news', e); }
      this.renderNewsContent();
    } catch (e) {
      alert(`ニュース取得エラー:\n${e.message}`); document.getElementById('apiKeyBlock').style.display = 'flex'; document.getElementById('newsLoader').style.display = 'none';
    }
  },

  // Try to safely extract JSON object/array from a potentially noisy text
  safeParseJson(text) {
    if (!text || typeof text !== 'string') throw new Error('empty response');
    // quick try
    try { return JSON.parse(text); } catch (e) {
      // clean code fences and common wrappers
      let cleaned = text.replace(/```json|```/g, '').trim();
      // attempt to find the largest {...} block
      const firstObj = cleaned.indexOf('{');
      const lastObj = cleaned.lastIndexOf('}');
      if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
        const sub = cleaned.slice(firstObj, lastObj + 1);
        try { return JSON.parse(sub); } catch (e2) { /* fallthrough */ }
      }
      // attempt to find array
      const firstArr = cleaned.indexOf('[');
      const lastArr = cleaned.lastIndexOf(']');
      if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
        const sub2 = cleaned.slice(firstArr, lastArr + 1);
        try { return JSON.parse(sub2); } catch (e3) { /* fallthrough */ }
      }
      // As a last resort, try to extract using a regex for {...}
      const match = cleaned.match(/\{[\s\S]*\}/m);
      if (match) {
        try { return JSON.parse(match[0]); } catch (e4) { /* fallthrough */ }
      }
      const err = new Error('Unable to parse JSON from response');
      err.raw = cleaned;
      throw err;
    }
  },

  highlightKeywords(text, words) {
    const sortedWords = [...words].map(w => w.word).sort((a, b) => b.length - a.length);
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return sortedWords.reduce((result, word) => {
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      return result.replace(regex, (match) => `<strong>${match}</strong>`);
    }, text);
  },

  renderNewsContent() {
    const data = this.state.newsData; document.getElementById('newsLoader').style.display = 'none'; document.getElementById('newsContentBody').style.display = 'block';
    document.getElementById('newsDiff').textContent = `Level: ${data.difficulty}`; document.getElementById('newsToeic').textContent = `TOEIC: ${data.toeic}`;
    document.getElementById('newsTitleEn').textContent = data.title;
    document.getElementById('newsBodyEn').innerHTML = this.highlightKeywords(data.body, data.words || []);
    document.getElementById('newsSummaryJa').textContent = data.summary_ja;
    document.getElementById('newsVocabList').innerHTML = data.words.map(w => `<div class="vocab-row-item"><span class="vocab-word-bold">${w.word}</span><span>${w.meaning}</span></div>`).join('');
    this.loadNewsQuiz();
  },

  // --- Cached news utilities ---------------------------------------------
  saveNewsToCache(news) {
    try {
      const key = 'cachedNews';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const entry = {
        id: `news_${Date.now()}`,
        savedAt: new Date().toISOString(),
        title: news.title || '(no title)',
        body: news.body || '',
        difficulty: news.difficulty || '',
        toeic: news.toeic || '',
        words: news.words || [],
        quizzes: news.quizzes || [],
        raw: news
      };
      list.unshift(entry);
      // keep recent 50
      if (list.length > 50) list.length = 50;
      localStorage.setItem(key, JSON.stringify(list));
      console.log('News cached:', entry.id, entry.title);
      return entry.id;
    } catch (e) {
      console.error('saveNewsToCache error', e);
      return null;
    }
  },

  getCachedNewsList() {
    try {
      return JSON.parse(localStorage.getItem('cachedNews') || '[]');
    } catch (e) {
      console.error('getCachedNewsList error', e);
      return [];
    }
  },

  renderCachedNewsList() {
    const list = this.getCachedNewsList();
    const container = document.getElementById('cachedNewsList');
    if (!container) {
      // If no UI, just log and return
      console.log('Cached news list:', list);
      alert(`保存済みニュース件数: ${list.length} 件（コンソール参照）`);
      return;
    }

    // Ensure news content area is visible so the list can be seen
    const newsBody = document.getElementById('newsContentBody');
    if (newsBody && newsBody.style.display === 'none') {
      newsBody.style.display = 'block';
    }

    // make sure container is visible
    container.style.display = 'block';

    if (list.length === 0) {
      container.innerHTML = '<p style="text-align:center; padding:20px; color:var(--color-text-muted);">保存済みニュースがありません</p>';
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="cached-news-item" style="border-bottom:1px solid var(--color-border); padding:8px 0;">
        <div class="cached-news-meta" style="font-size:0.8rem; color:var(--color-text-muted);">${item.savedAt} · ${item.difficulty} · ${item.toeic}</div>
        <div class="cached-news-title" style="font-weight:700; margin:4px 0;">${item.title}</div>
        <div class="cached-news-actions"><button class="btn" onclick="App.loadCachedNews('${item.id}')">表示</button></div>
      </div>
    `).join('');
    // scroll into view
    container.scrollIntoView({ behavior: 'smooth' });
  },

  loadCachedNews(id) {
    const list = this.getCachedNewsList();
    const entry = list.find(i => i.id === id);
    if (!entry) return alert('指定のニュースが見つかりません');
    // restore into state.newsData using the original raw object if present
    this.state.newsData = entry.raw || { title: entry.title, body: entry.body, words: entry.words, quizzes: entry.quizzes, difficulty: entry.difficulty, toeic: entry.toeic, summary_ja: '' };
    this.state.currentNewsQuizIndex = 0;
    this.renderNewsContent();
    this.switchScreen('news');
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
        this.appendChatBubble(aiResponse, 'ai'); this.appendChatBubble(`第${this.state.chatTurnCount + 1}往復 / 全5回`, 'system');
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
    'play-news-audio': (ctx) => ctx.playNewsAudio(),
    'start-chat-api': (ctx) => ctx.startConversationLesson(),
    'play-chat-audio': (ctx) => ctx.playChatAudio(),
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