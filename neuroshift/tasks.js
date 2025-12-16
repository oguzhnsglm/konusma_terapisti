/**
 * TASK SYSTEM
 * Üç katmanlı görev sistemi:
 * 1. Refleks katmanı
 * 2. Dil katmanı (gizli)
 * 3. Kaos katmanı
 */

class TaskManager {
  constructor() {
    this.activeTasks = [];
    this.taskContainer = document.getElementById('task-container');
    this.taskTypes = ['reflex', 'language', 'pattern'];
    this.taskId = 0;
    
    // Görev veritabanı
    this.taskDatabase = {
      reflex: [
        { type: 'color-match', prompt: 'Select the matching color', difficulty: 1 },
        { type: 'shape-sort', prompt: 'Pick the different shape', difficulty: 1 },
        { type: 'number-sequence', prompt: 'Continue the sequence', difficulty: 2 }
      ],
      language: [
        { type: 'word-pair', prompt: 'Which words sound similar?', difficulty: 1 },
        { type: 'complete-phrase', prompt: 'Complete the phrase', difficulty: 2 },
        { type: 'rhyme-match', prompt: 'Find the rhyming word', difficulty: 1 }
      ],
      pattern: [
        { type: 'visual-pattern', prompt: 'What comes next?', difficulty: 2 },
        { type: 'missing-piece', prompt: 'Find the missing piece', difficulty: 1 }
      ]
    };
  }

  /**
   * Yeni görev oluştur
   * @param {string} category - Görev kategorisi
   * @param {number} duration - Görev süresi (ms)
   */
  createTask(category = null, duration = 10000) {
    // Rastgele kategori seç
    if (!category) {
      category = this.taskTypes[Math.floor(Math.random() * this.taskTypes.length)];
    }

    // Kategori veritabanından görev seç
    const tasks = this.taskDatabase[category];
    const taskTemplate = tasks[Math.floor(Math.random() * tasks.length)];

    // Görev verisini oluştur
    const task = this.generateTaskData(taskTemplate);
    task.id = ++this.taskId;
    task.category = category;
    task.startTime = Date.now();
    task.duration = duration;

    // DOM'a ekle
    this.renderTask(task);
    
    // Aktif görevlere ekle
    this.activeTasks.push(task);

    return task;
  }

  /**
   * Görev verisini oluştur
   */
  generateTaskData(template) {
    switch(template.type) {
      case 'color-match':
        return this.generateColorMatch(template);
      case 'word-pair':
        return this.generateWordPair(template);
      case 'rhyme-match':
        return this.generateRhymeMatch(template);
      case 'shape-sort':
        return this.generateShapeSort(template);
      case 'visual-pattern':
        return this.generateVisualPattern(template);
      default:
        return this.generateColorMatch(template);
    }
  }

  /**
   * Renk eşleştirme görevi
   */
  generateColorMatch(template) {
    const colors = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
    const target = colors[Math.floor(Math.random() * colors.length)];
    const options = [target];
    
    while (options.length < 4) {
      const option = colors[Math.floor(Math.random() * colors.length)];
      if (!options.includes(option)) options.push(option);
    }
    
    // Karıştır
    options.sort(() => Math.random() - 0.5);
    
    return {
      ...template,
      target,
      options,
      correctAnswer: target
    };
  }

  /**
   * Kelime çifti görevi
   */
  generateWordPair(template) {
    const pairs = [
      { words: ['cat', 'hat'], prompt: 'Which words sound similar?' },
      { words: ['sun', 'run'], prompt: 'Find the rhyming pair' },
      { words: ['big', 'small'], prompt: 'Which are opposites?' },
      { words: ['apple', 'orange'], prompt: 'Which are fruits?' }
    ];
    
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const distractors = ['tree', 'car', 'book', 'shoe'];
    const options = [...pair.words];
    
    while (options.length < 4) {
      const distractor = distractors[Math.floor(Math.random() * distractors.length)];
      if (!options.includes(distractor)) options.push(distractor);
    }
    
    options.sort(() => Math.random() - 0.5);
    
    return {
      ...template,
      prompt: pair.prompt,
      options,
      correctAnswer: pair.words[0] // İlk kelime doğru cevap
    };
  }

  /**
   * Kafiye eşleştirme görevi
   */
  generateRhymeMatch(template) {
    const rhymes = [
      { base: 'kedi', matches: ['pedi', 'gedi'], distractors: ['köpek', 'kuş'] },
      { base: 'masa', matches: ['kasa', 'pasa'], distractors: ['sandalye', 'lamba'] },
      { base: 'top', matches: ['kop', 'hop'], distractors: ['kalem', 'defter'] }
    ];
    
    const rhyme = rhymes[Math.floor(Math.random() * rhymes.length)];
    const correctMatch = rhyme.matches[Math.floor(Math.random() * rhyme.matches.length)];
    const options = [correctMatch, ...rhyme.distractors];
    
    // 4 seçenek olana kadar ekle
    while (options.length < 4) {
      const extra = rhyme.distractors[Math.floor(Math.random() * rhyme.distractors.length)];
      if (!options.includes(extra)) options.push(extra);
    }
    
    options.sort(() => Math.random() - 0.5);
    
    return {
      ...template,
      prompt: `Which rhymes with "${rhyme.base}"?`,
      options,
      correctAnswer: correctMatch
    };
  }

  /**
   * Şekil sıralama görevi
   */
  generateShapeSort(template) {
    const shapes = ['⬛', '🔺', '🔵', '⭐', '❤️'];
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    
    // 3 aynı şekil, 1 farklı
    const options = [target, target, target];
    let different;
    do {
      different = shapes[Math.floor(Math.random() * shapes.length)];
    } while (different === target);
    options.push(different);
    
    options.sort(() => Math.random() - 0.5);
    
    return {
      ...template,
      prompt: 'Pick the different one',
      options,
      correctAnswer: different
    };
  }

  /**
   * Görsel desen görevi
   */
  generateVisualPattern(template) {
    const patterns = [
      { sequence: ['🔴', '🔵', '🔴', '🔵'], next: '🔴', options: ['🔴', '🔵', '🟢', '🟡'] },
      { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], next: '🌙', options: ['⭐', '🌙', '☀️', '🌟'] },
      { sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'], next: '5️⃣', options: ['5️⃣', '3️⃣', '1️⃣', '6️⃣'] }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
      ...template,
      prompt: `Pattern: ${pattern.sequence.join(' ')} ?`,
      options: pattern.options,
      correctAnswer: pattern.next
    };
  }

  /**
   * Görevi DOM'a render et
   */
  renderTask(task) {
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.dataset.taskId = task.id;
    
    // Prompt
    const prompt = document.createElement('div');
    prompt.className = 'task-prompt';
    prompt.textContent = task.prompt;
    taskCard.appendChild(prompt);
    
    // Options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'task-options';
    
    task.options.forEach(option => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'task-option';
      optionBtn.textContent = option;
      optionBtn.dataset.value = option;
      
      optionBtn.addEventListener('click', () => {
        this.handleTaskAnswer(task.id, option, optionBtn);
      });
      
      optionsContainer.appendChild(optionBtn);
    });
    
    taskCard.appendChild(optionsContainer);
    
    // Timer bar
    const timer = document.createElement('div');
    timer.className = 'task-timer';
    timer.style.setProperty('--duration', `${task.duration}ms`);
    taskCard.appendChild(timer);
    
    this.taskContainer.appendChild(taskCard);
    
    // Süre dolunca otomatik kaldır
    setTimeout(() => {
      this.removeTask(task.id, true);
    }, task.duration);
  }

  /**
   * Görev cevabını işle
   */
  handleTaskAnswer(taskId, answer, buttonElement) {
    const task = this.activeTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const correct = answer === task.correctAnswer;
    const responseTime = Date.now() - task.startTime;
    
    // Görsel geri bildirim
    if (correct) {
      buttonElement.classList.add('correct');
    } else {
      buttonElement.classList.add('incorrect');
    }
    
    // Görevi kaldır
    setTimeout(() => {
      this.removeTask(taskId, false);
    }, 300);
    
    // Event fırlat
    const event = new CustomEvent('taskCompleted', {
      detail: { taskId, correct, responseTime, task }
    });
    document.dispatchEvent(event);
  }

  /**
   * Görevi kaldır
   */
  removeTask(taskId, timeout = false) {
    const taskCard = this.taskContainer.querySelector(`[data-task-id="${taskId}"]`);
    if (taskCard) {
      taskCard.style.opacity = '0';
      taskCard.style.transform = 'scale(0.9)';
      setTimeout(() => taskCard.remove(), 300);
    }
    
    this.activeTasks = this.activeTasks.filter(t => t.id !== taskId);
    
    // Timeout olarak bittiyse event fırlat
    if (timeout) {
      const task = this.activeTasks.find(t => t.id === taskId) || { id: taskId };
      const event = new CustomEvent('taskCompleted', {
        detail: { taskId, correct: false, responseTime: 0, task, timeout: true }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Tüm görevleri temizle
   */
  clearAll() {
    this.taskContainer.innerHTML = '';
    this.activeTasks = [];
  }
}
