// 配置常量
const CONFIG = {
    API_KEY: 'sk-b81145b7b55543c1a65360667b8ebb80', // 通义千问 API密钥
    API_URL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    MAX_QUESTIONS: 20, // 最大题目数量
    DIGIT_RANGES: {
        1: {min: 1, max: 9},
        2: {min: 10, max: 99},
        3: {min: 100, max: 999},
        4: {min: 1000, max: 9999}
    }
};

// 全局状态管理
class TrainingState {
    constructor () {
        this.reset();
    }

    reset () {
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.startTime = null;
        this.currentAnswer = null;
        this.isTraining = false;
        this.timer = null;
    }

    start () {
        this.reset();
        this.isTraining = true;
        this.startTime = Date.now();
        this.startTimer();
    }

    stop () {
        this.isTraining = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    startTimer () {
        this.timer = setInterval(() => {
            if (this.isTraining) {
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    updateTimerDisplay () {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    nextQuestion () {
        this.currentQuestion++;
        this.updateStats();
    }

    submitQuestion () {
        this.totalQuestions++;
        this.updateStats();
    }

    correctAnswer () {
        this.correctAnswers++;
        this.updateStats();
    }

    updateStats () {
        document.getElementById('question-number').textContent = this.currentQuestion;
        const accuracy = this.totalQuestions > 0 ?
            Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
    }

    getResults () {
        const totalTime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        const accuracy = this.totalQuestions > 0 ?
            Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;

        return {
            totalQuestions: this.totalQuestions,
            correctAnswers: this.correctAnswers,
            accuracy: accuracy,
            totalTime: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        };
    }
}

// 题目生成器
class QuestionGenerator {
    constructor () {
        this.selectedOperation = null;
        this.selectedDigits = null;
    }

    setOperation (operation) {
        this.selectedOperation = operation;
    }

    setDigits (digits) {
        this.selectedDigits = digits;
    }

    async generateQuestion () {
        try {
            return await this.generateQuestionWithAI();
        } catch (error) {
            console.warn('AI生成题目失败，使用本地生成:', error);
            return this.generateLocalQuestion();
        }
    }

    // 批量生成题目（一次性生成多道题目）
    async generateBatchQuestions (count = 20) {
        try {
            const prompt = this.createBatchPrompt(count);
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                body: JSON.stringify({
                    model: 'qwen-turbo',
                    messages: [{
                        role: 'system',
                        content: prompt
                    }],
                    temperature: 0.9, // 提高随机性
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();

            return this.parseBatchAIResponse(content, count);
        } catch (error) {
            console.error('AI批量生成失败:', error);
            throw error; // 抛出错误，让调用方处理
        }
    }

    // 使用qwen API生成题目
    async generateQuestionWithAI () {
        try {
            const prompt = this.createPrompt();
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                body: JSON.stringify({
                    model: 'qwen-turbo',
                    messages: [{
                        role: 'system',
                        content: prompt
                    }],
                    temperature: 0.7,
                    max_tokens: 100
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();

            return this.parseAIResponse(content);
        } catch (error) {
            console.warn('AI生成题目失败，使用本地生成:', error);
            return this.generateLocalQuestion();
        }
    }

    createPrompt () {
        const range = CONFIG.DIGIT_RANGES[this.selectedDigits];
        const operationName = {
            '+': '加法',
            '-': '减法',
            '*': '乘法',
            '/': '除法'
        }[this.selectedOperation];

        const timestamp = Date.now();
        const randomSeed = Math.random().toString(36).substring(7);

        return `请生成一道${operationName}计算题，要求如下：
1. 数字范围：${range.min}到${range.max}
2. 运算符：${this.selectedOperation}
3. 确保结果为整数
4. 只返回算式，格式如：123 ${this.selectedOperation} 456
5. 不要包含等号和答案
6. 除法运算确保能整除
7. 请生成随机的不同数字，避免重复
8. 生成的算式不能与前一次相同
9. 随机种子：${randomSeed}_${timestamp}`;
    }

    // 创建批量生成的提示
    createBatchPrompt (count) {
        const range = CONFIG.DIGIT_RANGES[this.selectedDigits];
        const operationName = {
            '+': '加法',
            '-': '减法',
            '*': '乘法',
            '/': '除法'
        }[this.selectedOperation];

        const timestamp = Date.now();
        const randomSeed = Math.random().toString(36).substring(7);

        return `请一次性生成${count}道不同的${operationName}计算题，要求如下：
1. 数字范围：${range.min}到${range.max}
2. 运算符：${this.selectedOperation}
3. 确保结果为整数
4. 每道题只返回算式，格式如：123 ${this.selectedOperation} 456
5. 不要包含等号和答案
6. 除法运算确保能整除
7. 每道题的数字都要完全随机，确保${count}道题目完全不同
8. 每行一道题，总共${count}行
9. 不要添加题号或其他文字
10. 随机种子：${randomSeed}_${timestamp}

示例输出格式：
${range.min + Math.floor(Math.random() * (range.max - range.min))} ${this.selectedOperation} ${range.min + Math.floor(Math.random() * (range.max - range.min))}
${range.min + Math.floor(Math.random() * (range.max - range.min))} ${this.selectedOperation} ${range.min + Math.floor(Math.random() * (range.max - range.min))}
...`;
    }

    parseAIResponse (content) {
        // 提取数学表达式
        const match = content.match(/([0-9]+)\s*([+\-*/])\s*([0-9]+)/);
        if (match) {
            const [, num1, operator, num2] = match;
            const question = `${num1} ${operator} ${num2}`;
            const answer = this.calculateAnswer(parseInt(num1), operator, parseInt(num2));
            return {question, answer};
        }

        // 如果解析失败，使用本地生成
        return this.generateLocalQuestion();
    }

    // 解析AI批量生成的响应
    parseBatchAIResponse (content, expectedCount) {
        const questions = [];
        const lines = content.split('\n').filter(line => line.trim());

        for (const line of lines) {
            const match = line.match(/([0-9]+)\s*([+\-*/])\s*([0-9]+)/);
            if (match) {
                const [, num1, operator, num2] = match;
                const question = `${num1} ${operator} ${num2}`;
                const answer = this.calculateAnswer(parseInt(num1), operator, parseInt(num2));

                // 验证答案的合理性
                if (this.isValidAnswer(answer, operator)) {
                    questions.push({question, answer});
                }
            }

            // 如果已经获得足够的题目，停止解析
            if (questions.length >= expectedCount) {
                break;
            }
        }

        // 如果解析出的题目数量不足，用本地生成补充
        while (questions.length < expectedCount) {
            const localQuestion = this.generateLocalQuestion();
            questions.push(localQuestion);
        }

        return questions.slice(0, expectedCount); // 确保返回正确数量的题目
    }

    // 验证答案的合理性
    isValidAnswer (answer, operator) {
        // 检查答案是否为正整数
        if (!Number.isInteger(answer) || answer < 0) {
            return false;
        }

        // 除法特殊检查：确保能整除
        if (operator === '/' && answer === 0) {
            return false;
        }

        return true;
    }

    // 本地题目生成（备用方案）
    generateLocalQuestion () {
        const range = CONFIG.DIGIT_RANGES[this.selectedDigits];
        const operation = this.selectedOperation;

        let num1, num2, answer;

        switch (operation) {
            case '+':
                num1 = this.randomNumber(range.min, range.max);
                num2 = this.randomNumber(range.min, range.max);
                answer = num1 + num2;
                break;
            case '-':
                num1 = this.randomNumber(range.min, range.max);
                num2 = this.randomNumber(range.min, Math.min(num1, range.max));
                answer = num1 - num2;
                break;
            case '*':
                // 对于乘法，适当限制数字大小以避免结果过大
                const maxForMultiply = this.selectedDigits <= 2 ? range.max : Math.min(Math.sqrt(range.max * 10), range.max);
                num1 = this.randomNumber(range.min, maxForMultiply);
                num2 = this.randomNumber(range.min, maxForMultiply);
                answer = num1 * num2;
                break;
            case '/':
                // 对于除法，先生成答案再生成被除数
                const maxAnswer = this.selectedDigits <= 2 ? range.max : Math.min(range.max, 999);
                answer = this.randomNumber(range.min, maxAnswer);
                num2 = this.randomNumber(2, Math.min(this.selectedDigits <= 1 ? 9 : 20, range.max));
                num1 = answer * num2;
                break;
        }

        const question = `${num1} ${operation} ${num2}`;
        return {question, answer};
    }

    randomNumber (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    calculateAnswer (num1, operator, num2) {
        switch (operator) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return Math.floor(num1 / num2);
            default: return 0;
        }
    }

    // 移除难度调整方法，现在由用户选择位数
}

// 界面管理器
class UIManager {
    constructor () {
        this.elements = {
            startScreen: document.getElementById('start-screen'),
            operationSelection: document.querySelector('.operation-selection'),
            digitSelection: document.querySelector('.digit-selection'),
            startButtonContainer: document.querySelector('.start-button-container')
        };
    }

    showScreen (screenName) {
        // 目前只需要处理start屏幕
        if (screenName === 'start') {
            this.elements.startScreen.classList.add('active');
        }
    }

    // 训练相关UI方法已移至training.js

    // 这些方法已移至training.js或不再需要

    // 显示运算类型选择
    showOperationSelection () {
        this.elements.operationSelection.style.display = 'block';
        this.elements.digitSelection.style.display = 'none';
        this.elements.startButtonContainer.style.display = 'none';
        // 隐藏进度条
        document.getElementById('preparation-status').style.display = 'none';
    }

    // 显示位数选择
    showDigitSelection () {
        this.elements.operationSelection.style.display = 'none';
        this.elements.digitSelection.style.display = 'block';
        this.elements.startButtonContainer.style.display = 'none';
        // 隐藏进度条
        document.getElementById('preparation-status').style.display = 'none';
    }

    // 显示开始按钮
    showStartButton () {
        this.elements.operationSelection.style.display = 'none';
        this.elements.digitSelection.style.display = 'none';
        this.elements.startButtonContainer.style.display = 'block';
        // 隐藏进度条
        document.getElementById('preparation-status').style.display = 'none';
    }

    // 显示准备状态
    showPreparationStatus () {
        this.elements.operationSelection.style.display = 'none';
        this.elements.digitSelection.style.display = 'none';
        this.elements.startButtonContainer.style.display = 'none';
        document.getElementById('preparation-status').style.display = 'block';
    }

    // 显示训练界面
    showTrainingScreen () {
        // 隐藏开始界面
        document.getElementById('start-screen').classList.remove('active');
        // 显示训练界面
        document.getElementById('training-screen').classList.add('active');
    }

    // 显示结果界面
    showResultScreen () {
        // 隐藏训练界面
        document.getElementById('training-screen').classList.remove('active');
        // 显示结果界面
        document.getElementById('result-screen').classList.add('active');
    }

    // 返回开始界面
    showStartScreen () {
        // 隐藏其他界面
        document.getElementById('training-screen').classList.remove('active');
        document.getElementById('result-screen').classList.remove('active');
        // 显示开始界面
        document.getElementById('start-screen').classList.add('active');
    }

    // 更新位数选择中的示例
    updateDigitExamples (operation) {
        const examples = {
            '+': ['5 + 3', '25 + 18', '125 + 238', '1250 + 2380'],
            '-': ['8 - 3', '45 - 18', '325 - 138', '2450 - 1380'],
            '*': ['3 × 4', '12 × 8', '25 × 16', '125 × 24'],
            '/': ['8 ÷ 2', '48 ÷ 6', '144 ÷ 12', '2400 ÷ 15']
        };

        const digitBtns = document.querySelectorAll('.digit-btn');
        digitBtns.forEach((btn, index) => {
            const exampleDiv = btn.querySelector('.digit-example');
            if (exampleDiv && examples[operation]) {
                exampleDiv.textContent = `例：${examples[operation][index]}`;
            }
        });
    }
}

// 主应用类
class MathTrainingApp {
    constructor () {
        this.state = new TrainingState();
        this.generator = new QuestionGenerator();
        this.ui = new UIManager();
        this.questionQueue = []; // 题目队列
        this.isGeneratingQuestions = false; // 是否正在生成题目
        this.selectedOperation = null;
        this.selectedDigits = null;
        this.initEventListeners();
        this.ui.showOperationSelection(); // 显示运算类型选择
    }

    initEventListeners () {
        // 运算类型选择
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectOperation(e.target.closest('.operation-btn').dataset.operation);
            });
        });

        // 位数选择
        document.querySelectorAll('.digit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDigits(parseInt(e.target.closest('.digit-btn').dataset.digits));
            });
        });

        // 返回运算选择
        document.getElementById('back-to-operation').addEventListener('click', () => {
            this.backToOperationSelection();
        });

        // 开始训练
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startTraining();
        });

        // 训练界面事件监听器
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitAnswer();
        });

        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('exit-btn').addEventListener('click', () => {
            this.endTraining();
        });

        // 显示答案按钮
        document.getElementById('show-answer-btn').addEventListener('click', () => {
            this.showAnswer();
        });

        // 结果界面事件监听器
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartTraining();
        });

        document.getElementById('back-home-btn').addEventListener('click', () => {
            this.backToHome();
        });
    }

    // 选择运算类型
    selectOperation (operation) {
        this.selectedOperation = operation;

        // 更新UI选中状态
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-operation="${operation}"]`).classList.add('selected');

        // 显示位数选择
        this.ui.showDigitSelection();
        this.ui.updateDigitExamples(operation);
    }

    // 选择位数
    selectDigits (digits) {
        this.selectedDigits = digits;

        // 更新UI选中状态
        document.querySelectorAll('.digit-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-digits="${digits}"]`).classList.add('selected');

        // 显示开始按钮
        this.ui.showStartButton();
    }

    // 返回运算类型选择
    backToOperationSelection () {
        this.selectedDigits = null;
        document.querySelectorAll('.digit-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.ui.showOperationSelection();
    }

    async startTraining () {
        // 显示准备状态
        this.ui.showPreparationStatus();

        // 设置生成器参数
        this.generator.setOperation(this.selectedOperation);
        this.generator.setDigits(this.selectedDigits);

        // 预生成题目
        await this.preGenerateQuestions();

        // 切换到训练界面
        this.ui.showTrainingScreen();

        // 开始训练状态
        this.state.start();

        // 显示第一题
        this.showNextQuestion();
    }

    async preGenerateQuestions () {
        this.questionQueue = [];
        const totalQuestions = 20; // 每个题型20题

        try {
            // 尝试AI批量生成20道题目
            const aiQuestions = await this.generator.generateBatchQuestions(totalQuestions);
            this.questionQueue = aiQuestions;

            // 更新进度到100%
            this.updatePreparationProgress(totalQuestions, totalQuestions);
        } catch (error) {
            console.error('AI批量生成失败，使用本地生成:', error);
            // 如果AI批量生成失败，使用本地生成
            for (let i = 0; i < totalQuestions; i++) {
                const questionData = this.generator.generateLocalQuestion();
                this.questionQueue.push(questionData);

                // 更新进度
                this.updatePreparationProgress(i + 1, totalQuestions);
            }
        }

        // 将题目存储到localStorage，使用运算类型和位数作为键的一部分
        const storageKey = `preGeneratedQuestions_${this.selectedOperation}_${this.selectedDigits}`;
        localStorage.setItem(storageKey, JSON.stringify(this.questionQueue));
    }

    updatePreparationProgress (current, total) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        if (progressFill && progressText) {
            const percentage = (current / total) * 100;
            progressFill.style.width = percentage + '%';
            progressText.textContent = `${current}/${total}`;
        }
    }

    // 显示下一题
    showNextQuestion () {
        if (this.state.currentQuestion >= this.questionQueue.length) {
            this.endTraining();
            return;
        }

        const questionData = this.questionQueue[this.state.currentQuestion];
        this.state.currentAnswer = questionData.answer;

        // 更新界面
        document.getElementById('question-number').textContent = this.state.currentQuestion + 1;
        document.getElementById('question-text').textContent = questionData.question;
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';

        // 重置按钮状态 - 允许用户随时点击下一题
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('next-btn').disabled = false;

        // 隐藏显示答案按钮
        document.querySelector('.show-answer-section').style.display = 'none';

        // 显示题目内容，隐藏加载状态
        document.getElementById('loading').style.display = 'none';
        document.getElementById('question-content').style.display = 'block';
    }

    // 显示答案
    showAnswer() {
        const feedback = document.getElementById('feedback');
        feedback.textContent = `正确答案是 ${this.state.currentAnswer}`;
        feedback.className = 'feedback answer';
        
        // 隐藏显示答案按钮
        document.querySelector('.show-answer-section').style.display = 'none';
    }

    // 提交答案
    submitAnswer () {
        const userAnswer = parseInt(document.getElementById('answer-input').value);
        const feedback = document.getElementById('feedback');

        if (isNaN(userAnswer)) {
            feedback.textContent = '请输入有效的数字';
            feedback.className = 'feedback error';
            return;
        }

        const isCorrect = userAnswer === this.state.currentAnswer;

        if (isCorrect) {
            this.state.correctAnswers++;
            feedback.textContent = '✅ 回答正确！';
            feedback.className = 'feedback success';

            // 更新统计
            this.state.currentQuestion++;
            this.updateStats();

            // 更新按钮状态 - 答对也允许手动下一题
            document.getElementById('submit-btn').disabled = true;
            document.getElementById('next-btn').disabled = false;

            // 答对自动进入下一题
            setTimeout(() => {
                this.showNextQuestion();
            }, 1000);
        } else {
            feedback.textContent = '❌ 回答错误';
            feedback.className = 'feedback error';

            // 显示"显示答案"按钮
            document.querySelector('.show-answer-section').style.display = 'block';

            // 更新统计
            this.state.currentQuestion++;
            this.updateStats();

            // 更新按钮状态
            document.getElementById('submit-btn').disabled = true;
            document.getElementById('next-btn').disabled = false;
        }
    }

    // 下一题
    nextQuestion () {
        const answerInput = document.getElementById('answer-input');
        const inputValue = answerInput.value.trim();
        const submitBtn = document.getElementById('submit-btn');

        // 检查是否已经通过submitAnswer处理过答案
        const alreadySubmitted = submitBtn.disabled;

        if (!alreadySubmitted && inputValue !== '') {
            // 如果还没有提交过答案且有输入内容，需要先判断
            const userAnswer = parseInt(inputValue);
            const feedback = document.getElementById('feedback');

            if (isNaN(userAnswer)) {
                // 格式有误算错误
                feedback.textContent = '❌ 格式有误';
                feedback.className = 'feedback error';
                this.state.currentQuestion++;
                this.updateStats();
            } else {
                const isCorrect = userAnswer === this.state.currentAnswer;

                if (isCorrect) {
                    this.state.correctAnswers++;
                    feedback.textContent = '✅ 回答正确！';
                    feedback.className = 'feedback success';
                } else {
                    feedback.textContent = '❌ 回答错误';
                    feedback.className = 'feedback error';
                }

                // 更新统计
                this.state.currentQuestion++;
                this.updateStats();
            }
        } else if (!alreadySubmitted && inputValue === '') {
            // 输入框为空时，直接跳过不计分
            const feedback = document.getElementById('feedback');
            feedback.textContent = '⏭️ 跳过此题';
            feedback.className = 'feedback info';
            this.state.currentQuestion++;
            this.updateStats();
        }

        // 直接进入下一题，不需要延迟
        this.showNextQuestion();
    }

    // 查看答案功能已移除

    // 更新统计信息
    updateStats () {
        const accuracy = this.state.currentQuestion > 0 ?
            Math.round((this.state.correctAnswers / this.state.currentQuestion) * 100) : 0;
        document.getElementById('accuracy').textContent = accuracy + '%';
    }

    // 结束训练
    endTraining () {
        this.state.stop();
        this.showResults();
        this.ui.showResultScreen();
    }

    // 显示结果
    showResults () {
        const totalTime = Date.now() - this.state.startTime;
        const minutes = Math.floor(totalTime / 60000);
        const seconds = Math.floor((totalTime % 60000) / 1000);
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const accuracy = this.state.currentQuestion > 0 ?
            Math.round((this.state.correctAnswers / this.state.currentQuestion) * 100) : 0;

        const avgTime = this.state.currentQuestion > 0 ?
            Math.round(totalTime / this.state.currentQuestion / 1000) : 0;

        document.getElementById('total-questions').textContent = this.state.currentQuestion;
        document.getElementById('correct-answers').textContent = this.state.correctAnswers;
        document.getElementById('final-accuracy').textContent = accuracy + '%';
        document.getElementById('total-time').textContent = timeStr;
    }

    // 重新开始训练
    restartTraining () {
        this.state.reset();
        this.ui.showStartScreen();
        this.ui.showOperationSelection();
        this.selectedOperation = null;
        this.selectedDigits = null;
        this.questionQueue = [];
    }

    // 返回首页
    backToHome () {
        this.restartTraining();
    }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    window.mathApp = new MathTrainingApp();

    // 详细信息切换功能
    const toggleBtn = document.getElementById('toggle-detail-btn');
    const detailSection = document.getElementById('detail-info-section');
    const toggleIcon = toggleBtn?.querySelector('.toggle-icon');
    const toggleText = toggleBtn?.querySelector('.toggle-text');
    const footerReadmeLink = document.getElementById('footer-readme-link');

    // 显示详细信息的函数
    function showDetailInfo () {
        if (detailSection) {
            detailSection.style.display = 'block';
            if (toggleBtn) {
                toggleBtn.classList.add('expanded');
                if (toggleText) toggleText.textContent = '📖 隐藏详细信息';
                if (toggleIcon) toggleIcon.textContent = '▲';
            }

            // 平滑滚动到详细信息区域
            setTimeout(() => {
                detailSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // 隐藏详细信息的函数
    function hideDetailInfo () {
        if (detailSection) {
            detailSection.style.display = 'none';
            if (toggleBtn) {
                toggleBtn.classList.remove('expanded');
                if (toggleText) toggleText.textContent = '📖 查看详细信息';
                if (toggleIcon) toggleIcon.textContent = '▼';
            }
        }
    }

    // 切换按钮点击事件
    if (toggleBtn && detailSection) {
        toggleBtn.addEventListener('click', function () {
            const isVisible = detailSection.style.display !== 'none';

            if (isVisible) {
                hideDetailInfo();
            } else {
                showDetailInfo();
            }
        });
    }

    // 生成README的HTML内容
    function generateReadmeHTML () {
        return `
         <!DOCTYPE html>
         <html lang="zh-CN">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>数量关系训练系统 - 使用说明</title>
             <style>
                 * {
                     margin: 0;
                     padding: 0;
                     box-sizing: border-box;
                 }
                 body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      line-height: 1.6;
                      color: #333;
                      background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                      min-height: 100vh;
                      padding: 20px;
                  }
                 .readme-container {
                      max-width: 900px;
                      margin: 0 auto;
                      background: white;
                      border-radius: 15px;
                      box-shadow: 0 10px 30px rgba(76, 175, 80, 0.15);
                      overflow: hidden;
                      border: 1px solid #e8f5e8;
                  }
                 .readme-header {
                     background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                     color: white;
                     padding: 30px;
                     text-align: center;
                 }
                 .readme-header h1 {
                     font-size: 2.5em;
                     margin-bottom: 10px;
                     text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                 }
                 .readme-header p {
                     font-size: 1.2em;
                     opacity: 0.9;
                 }
                 .readme-content {
                     padding: 40px;
                 }
                 .back-button {
                     position: fixed;
                     top: 20px;
                     left: 20px;
                     background: #4CAF50;
                     color: white;
                     border: none;
                     padding: 12px 20px;
                     border-radius: 25px;
                     cursor: pointer;
                     font-size: 16px;
                     box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                     transition: all 0.3s ease;
                     z-index: 1000;
                 }
                 .back-button:hover {
                     background: #45a049;
                     transform: translateY(-2px);
                     box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
                 }
                 h2 {
                     color: #4CAF50;
                     font-size: 1.8em;
                     margin: 30px 0 15px 0;
                     border-bottom: 2px solid #e8f5e8;
                     padding-bottom: 10px;
                 }
                 h3 {
                     color: #666;
                     font-size: 1.4em;
                     margin: 25px 0 10px 0;
                 }
                 h4 {
                     color: #777;
                     font-size: 1.2em;
                     margin: 20px 0 8px 0;
                 }
                 p {
                     margin-bottom: 15px;
                     text-align: justify;
                 }
                 ul, ol {
                     margin: 15px 0 15px 30px;
                 }
                 li {
                     margin-bottom: 8px;
                 }
                 .feature-grid {
                     display: grid;
                     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                     gap: 20px;
                     margin: 20px 0;
                 }
                 .feature-card {
                      background: linear-gradient(135deg, #f8fff8 0%, #f0f8f0 100%);
                      padding: 20px;
                      border-radius: 10px;
                      border-left: 4px solid #4CAF50;
                      border: 1px solid #e8f5e8;
                      transition: all 0.3s ease;
                  }
                  .feature-card:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
                  }
                 .feature-card h4 {
                     color: #4CAF50;
                     margin-top: 0;
                 }
                 code {
                      background: #e8f5e8;
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-family: 'Courier New', monospace;
                      color: #2e7d32;
                      border: 1px solid #c8e6c9;
                  }
                 pre {
                      background: linear-gradient(135deg, #f8fff8 0%, #f0f8f0 100%);
                      padding: 20px;
                      border-radius: 8px;
                      overflow-x: auto;
                      margin: 15px 0;
                      border-left: 4px solid #4CAF50;
                      border: 1px solid #e8f5e8;
                  }
                 pre code {
                     background: none;
                     border: none;
                     padding: 0;
                     color: #333;
                 }
                 .emoji {
                     font-size: 1.2em;
                 }
                 .highlight-box {
                     background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                     padding: 20px;
                     border-radius: 10px;
                     margin: 20px 0;
                     border: 1px solid #d4edda;
                 }
                 .tech-stack {
                     display: flex;
                     flex-wrap: wrap;
                     gap: 10px;
                     margin: 15px 0;
                 }
                 .tech-item {
                     background: #4CAF50;
                     color: white;
                     padding: 8px 15px;
                     border-radius: 20px;
                     font-size: 0.9em;
                 }
                 @media (max-width: 768px) {
                     .readme-content {
                         padding: 20px;
                     }
                     .readme-header h1 {
                         font-size: 2em;
                     }
                     .feature-grid {
                         grid-template-columns: 1fr;
                     }
                 }
             </style>
         </head>
         <body>
             <button class="back-button" onclick="window.location.reload()">返回应用</button>
             
             <div class="readme-container">
                 <div class="readme-header">
                     <h1><span class="emoji">🧮</span> 数量关系训练系统</h1>
                     <p>一个专为行政能力测试设计的数量关系训练项目，帮助用户提升速算能力，轻松应对公务员考试中的数量关系题目。</p>
                 </div>
                 
                 <div class="readme-content">
                     <h2><span class="emoji">🌟</span> 项目特色</h2>
                     <div class="feature-grid">
                         <div class="feature-card">
                             <h4><span class="emoji">🤖</span> 智能出题</h4>
                             <p>集成Qwen AI，自动生成高质量的数学计算题</p>
                         </div>
                         <div class="feature-card">
                             <h4><span class="emoji">⚡</span> 实时反馈</h4>
                             <p>答对自动跳转下一题，答错清空输入并提示</p>
                         </div>
                         <div class="feature-card">
                             <h4><span class="emoji">🎯</span> 难度递进</h4>
                             <p>根据题目进度自动调整难度等级</p>
                         </div>
                         <div class="feature-card">
                             <h4><span class="emoji">📊</span> 数据统计</h4>
                             <p>实时显示正确率、用时等关键指标</p>
                         </div>
                         <div class="feature-card">
                             <h4><span class="emoji">🎨</span> 美观界面</h4>
                             <p>绿色白色主题，简洁现代的设计风格</p>
                         </div>
                         <div class="feature-card">
                             <h4><span class="emoji">📱</span> 响应式</h4>
                             <p>完美适配桌面端和移动端设备</p>
                         </div>
                     </div>

                     <h2><span class="emoji">✨</span> 功能特性</h2>
                     
                     <h3><span class="emoji">🎯</span> 核心功能</h3>
                     <ul>
                         <li><strong>智能题目生成</strong>: 使用Qwen AI生成1-4位数的加减乘除运算题</li>
                         <li><strong>自适应难度</strong>: 根据答题进度自动调整题目难度</li>
                         <li><strong>实时验证</strong>: 答案正确自动跳转，错误时清空输入重新作答</li>
                         <li><strong>进度跟踪</strong>: 显示当前题号、正确率、用时等统计信息</li>
                         <li><strong>完整流程</strong>: 开始训练 → 答题练习 → 结果统计的完整体验</li>
                     </ul>

                     <h3><span class="emoji">📊</span> 统计功能</h3>
                     <ul>
                         <li><strong>实时统计</strong>: 题目编号、正确率、用时显示</li>
                         <li><strong>结果报告</strong>: 训练结束后显示详细的成绩统计</li>
                         <li><strong>性能分析</strong>: 帮助用户了解自己的计算能力水平</li>
                     </ul>

                     <h3><span class="emoji">🎨</span> 界面设计</h3>
                     <ul>
                         <li><strong>绿色主题</strong>: 护眼的绿色和白色配色方案</li>
                         <li><strong>现代设计</strong>: 圆角卡片、渐变按钮、流畅动画</li>
                         <li><strong>用户友好</strong>: 清晰的视觉层次和直观的操作流程</li>
                     </ul>

                     <h2><span class="emoji">🛠️</span> 技术栈</h2>
                     <div class="tech-stack">
                         <span class="tech-item">HTML5</span>
                         <span class="tech-item">CSS3</span>
                         <span class="tech-item">JavaScript ES6+</span>
                         <span class="tech-item">Qwen API</span>
                         <span class="tech-item">响应式布局</span>
                         <span class="tech-item">CSS Grid/Flexbox</span>
                     </div>

                     <h2><span class="emoji">📦</span> 项目结构</h2>
                     <pre><code>math-training/
├── index.html          # 主页面文件
├── style.css           # 样式文件
├── script.js           # 功能脚本
└── README.md           # 项目说明</code></pre>

                     <h2><span class="emoji">🚀</span> 快速开始</h2>
                     
                     <h3>1. 环境准备</h3>
                     <ul>
                         <li>现代浏览器（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）</li>
                         <li>网络连接（用于AI API调用）</li>
                     </ul>

                     <h3>2. API配置</h3>
                     <ol>
                         <li>注册Qwen账号并获取API密钥</li>
                         <li>在 <code>script.js</code> 文件中替换API密钥：</li>
                     </ol>
                     <pre><code>const CONFIG = {
    API_KEY: 'your-Qwen-api-key-here', // 替换为您的API密钥
    // ...
};</code></pre>

                     <h3>3. 运行项目</h3>
                     <ol>
                         <li>下载项目文件到本地</li>
                         <li>在浏览器中打开 <code>index.html</code> 文件</li>
                         <li>开始使用训练系统</li>
                     </ol>

                     <h2><span class="emoji">📖</span> 使用指南</h2>
                     
                     <div class="highlight-box">
                         <h3><span class="emoji">🎯</span> 开始训练</h3>
                         <ol>
                             <li>打开应用，点击"开始训练"按钮</li>
                             <li>系统自动生成第一道题目</li>
                             <li>在输入框中输入答案</li>
                             <li>点击"提交答案"或按回车键</li>
                         </ol>
                     </div>

                     <h3><span class="emoji">⚡</span> 答题流程</h3>
                     <ul>
                         <li><strong>答对</strong>: 显示正确提示，自动启用"下一题"按钮</li>
                         <li><strong>答错</strong>: 显示错误提示和正确答案，清空输入框重新作答</li>
                         <li><strong>跳过</strong>: 可以点击"下一题"按钮跳过当前题目</li>
                     </ul>

                     <h3><span class="emoji">📊</span> 查看统计</h3>
                     <ul>
                         <li><strong>实时统计</strong>: 页面顶部显示当前进度和正确率</li>
                         <li><strong>最终报告</strong>: 完成训练后查看详细的成绩统计</li>
                     </ul>

                     <h2><span class="emoji">⚙️</span> 配置说明</h2>
                     
                     <h3><span class="emoji">🔧</span> 基础配置</h3>
                     <pre><code>const CONFIG = {
    API_KEY: 'your-api-key',           // Qwen API密钥
    API_URL: 'https://api.Qwen.com/chat/completions',
    MAX_QUESTIONS: 20,                 // 最大题目数量
    DIFFICULTY_LEVELS: {               // 难度等级设置
        EASY: { min: 1, max: 99 },     // 简单：1-2位数
        MEDIUM: { min: 10, max: 999 }, // 中等：2-3位数
        HARD: { min: 100, max: 9999 }  // 困难：3-4位数
    }
};</code></pre>

                     <h3><span class="emoji">📈</span> 难度调节</h3>
                     <ul>
                         <li><strong>1-5题</strong>: 简单难度（1-2位数）</li>
                         <li><strong>6-15题</strong>: 中等难度（2-3位数）</li>
                         <li><strong>16-20题</strong>: 困难难度（3-4位数）</li>
                     </ul>

                     <h2><span class="emoji">🔧</span> 技术实现</h2>
                     
                     <h3><span class="emoji">🏗️</span> 架构设计</h3>
                     <ul>
                         <li><strong>TrainingState</strong>: 状态管理类，处理训练进度和统计</li>
                         <li><strong>QuestionGenerator</strong>: 题目生成器，集成AI和本地生成</li>
                         <li><strong>UIManager</strong>: 界面管理器，处理页面显示和交互</li>
                         <li><strong>MathTrainingApp</strong>: 主应用类，协调各个模块</li>
                     </ul>

                     <h3><span class="emoji">🤖</span> AI集成</h3>
                     <ul>
                         <li>使用Qwen API生成高质量数学题目</li>
                         <li>智能解析AI响应，提取题目和答案</li>
                         <li>本地备用生成器，确保系统稳定性</li>
                     </ul>

                     <h2><span class="emoji">📱</span> 浏览器支持</h2>
                     <ul>
                         <li>✅ Chrome 80+</li>
                         <li>✅ Firefox 75+</li>
                         <li>✅ Safari 13+</li>
                         <li>✅ Edge 80+</li>
                         <li>❌ Internet Explorer（不支持）</li>
                     </ul>

                     <h2><span class="emoji">❓</span> 常见问题</h2>
                     
                     <h4>Q: AI生成题目失败怎么办？</h4>
                     <p>A: 系统会自动切换到本地生成模式，确保训练正常进行。请检查：</p>
                     <ul>
                         <li>API密钥是否正确</li>
                         <li>网络连接是否正常</li>
                         <li>API额度是否充足</li>
                     </ul>

                     <h4>Q: 如何调整题目难度？</h4>
                     <p>A: 修改 <code>script.js</code> 中的 <code>DIFFICULTY_LEVELS</code> 配置，或调整难度切换的题目数量。</p>

                     <h4>Q: 可以自定义题目数量吗？</h4>
                     <p>A: 修改 <code>CONFIG.MAX_QUESTIONS</code> 的值即可调整最大题目数量。</p>

                     <div class="highlight-box">
                         <h2  style="margin-top:15px;"><span class="emoji">🎯</span> 助力公考成功，从提升数量关系能力开始！</h2>
                         <p style="text-align: center; font-size: 1.1em; margin-top: 20px;">⭐ 如果这个项目对你有帮助，请给它一个星标！</p>
                     </div>
                 </div>
             </div>
         </body>
         </html>
         `;
    }

    // 初始化README容器内容
    function initializeReadmeContainer() {
        const readmeContainer = document.getElementById('readme-container');
        if (readmeContainer) {
            readmeContainer.innerHTML = generateReadmeContent();
            
            // 添加返回按钮事件监听
            const backButton = readmeContainer.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    hideReadmeOverlay();
                });
            }
        }
    }

    // 生成README内容（不包含完整HTML结构）
     function generateReadmeContent() {
         return `
             <div class="readme-header">
                 <button class="back-button">🔙 返回应用</button>
                 <h1><span class="emoji">🧮</span> 数量关系训练系统 <span class="emoji">✨</span></h1>
                 <p><span class="emoji">🎓</span> 专为行政能力测试设计的智能训练平台 <span class="emoji">🚀</span></p>
             </div>
             <div class="readme-content">
                 <h2><span class="emoji">🌟</span> 项目特色 <span class="emoji">💎</span></h2>
                 <p>这是一个专门为<strong>行政职业能力测验</strong>中的<strong>数量关系</strong>模块设计的在线训练系统 <span class="emoji">📚</span>。通过AI智能出题和自适应难度调整，帮助考生高效提升数学运算能力，轻松应对公考挑战 <span class="emoji">💪</span>。</p>

                 <div class="highlight-box">
                     <h3><span class="emoji">🎯</span> 核心优势 <span class="emoji">🌟</span></h3>
                     <p>• <strong>🤖 AI智能出题</strong>：使用通义千问API生成高质量题目 <span class="emoji">🎲</span><br>
                     • <strong>📈 自适应难度</strong>：根据答题情况智能调整题目难度 <span class="emoji">🎚️</span><br>
                     • <strong>📊 实时统计</strong>：详细的答题数据分析和进度跟踪 <span class="emoji">📈</span><br>
                     • <strong>⚡ 零配置使用</strong>：打开即用，无需安装任何软件 <span class="emoji">🎉</span></p>
                 </div>

                 <h2><span class="emoji">✨</span> 功能特性 <span class="emoji">🎪</span></h2>
                 
                 <h3><span class="emoji">🎯</span> 核心功能 <span class="emoji">⚙️</span></h3>
                 <div class="feature-grid">
                     <div class="feature-card">
                         <h4><span class="emoji">🤖</span> AI智能出题 <span class="emoji">🧠</span></h4>
                         <p>集成通义千问API，生成符合公考标准的高质量数学题目 <span class="emoji">📝</span>，确保题目的多样性和合理性 <span class="emoji">🎯</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">📈</span> 自适应难度 <span class="emoji">🎚️</span></h4>
                         <p>系统根据用户答题表现智能调整难度等级 <span class="emoji">🔄</span>，从1位数到4位数运算，循序渐进提升能力 <span class="emoji">📊</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">⚡</span> 实时反馈 <span class="emoji">💬</span></h4>
                         <p>每道题目都有即时的对错反馈 <span class="emoji">✅❌</span>，答错时显示正确答案，帮助快速发现和纠正错误 <span class="emoji">🔍</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">📊</span> 详细统计 <span class="emoji">📈</span></h4>
                         <p>完整记录答题时间、正确率、题目分布等数据 <span class="emoji">📋</span>，提供全面的学习效果评估 <span class="emoji">🎯</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">🎨</span> 现代界面 <span class="emoji">💎</span></h4>
                         <p>采用现代化设计语言，绿色主题护眼舒适 <span class="emoji">👀</span>，响应式布局适配各种设备 <span class="emoji">📱💻</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">⏱️</span> 时间统计 <span class="emoji">⏰</span></h4>
                         <p>精确记录每道题的答题时间和总用时 <span class="emoji">📊</span>，帮助提升答题速度 <span class="emoji">⚡</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">📈</span> 进度跟踪 <span class="emoji">📊</span></h4>
                         <p>实时显示训练进度和正确率变化 <span class="emoji">📉📈</span>，直观了解学习效果 <span class="emoji">👀</span>。</p>
                     </div>
                 </div>

                 <h3><span class="emoji">🎨</span> 界面设计 <span class="emoji">💎</span></h3>
                 <div class="feature-grid">
                     <div class="feature-card">
                         <h4><span class="emoji">🌈</span> 现代界面 <span class="emoji">✨</span></h4>
                         <p>采用现代化设计语言，绿色主题护眼舒适 <span class="emoji">👀</span>，提供优质的视觉体验 <span class="emoji">🎨</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">📱</span> 响应式设计 <span class="emoji">💻</span></h4>
                         <p>完美适配手机、平板、电脑等各种设备 <span class="emoji">📱💻🖥️</span>，随时随地进行训练 <span class="emoji">🌍</span>。</p>
                     </div>
                     <div class="feature-card">
                         <h4><span class="emoji">🎯</span> 用户友好 <span class="emoji">😊</span></h4>
                         <p>简洁直观的操作界面 <span class="emoji">🎮</span>，清晰的视觉反馈，让学习更加轻松愉快 <span class="emoji">😄</span>。</p>
                     </div>
                 </div>

                 <h2><span class="emoji">💻</span> 技术栈 <span class="emoji">🛠️</span></h2>
                 <div class="tech-stack">
                     <span class="tech-item">🌐 HTML5</span>
                     <span class="tech-item">🎨 CSS3</span>
                     <span class="tech-item">⚡ JavaScript ES6+</span>
                     <span class="tech-item">🤖 通义千问API</span>
                     <span class="tech-item">📱 响应式设计</span>
                 </div>

                 <h2><span class="emoji">📁</span> 项目结构 <span class="emoji">🏗️</span></h2>
                 <div class="code-block">
                     <pre><code>math-training/
├── 📄 index.html          # 主页面文件
├── 🎨 style.css           # 样式文件
├── ⚡ script.js           # 核心逻辑文件
└── 📖 README.md           # 项目说明文档</code></pre>
                 </div>

                 <h2><span class="emoji">🚀</span> 快速开始 <span class="emoji">🏁</span></h2>
                 
                 <h3><span class="emoji">🌍</span> 环境准备 <span class="emoji">⚙️</span></h3>
                 <ul>
                     <li><span class="emoji">🌐</span> 现代浏览器（Chrome 80+、Firefox 75+、Safari 13+、Edge 80+）</li>
                     <li><span class="emoji">📶</span> 稳定的网络连接（用于AI功能）</li>
                     <li><span class="emoji">🔑</span> 通义千问API密钥（可选，用于AI出题）</li>
                 </ul>

                 <h3><span class="emoji">🔧</span> API配置 <span class="emoji">🔑</span></h3>
                 <p>如需使用AI出题功能，请在 <code>script.js</code> 中配置API密钥 <span class="emoji">⚙️</span>：</p>
                 <div class="code-block">
                     <pre><code>const CONFIG = {
    API_KEY: 'your-qwen-api-key-here',  // 替换为你的API密钥
    // ... 其他配置
};</code></pre>
                 </div>

                 <h3><span class="emoji">🏃‍♂️</span> 运行项目 <span class="emoji">▶️</span></h3>
                 <ol>
                     <li><span class="emoji">📁</span> 下载项目文件到本地</li>
                     <li><span class="emoji">🌐</span> 使用浏览器打开 <code>index.html</code></li>
                     <li><span class="emoji">🎯</span> 选择运算类型开始训练</li>
                 </ol>

                 <h2><span class="emoji">📖</span> 使用指南 <span class="emoji">📚</span></h2>
                 
                 <h3><span class="emoji">1️⃣</span> 开始训练 <span class="emoji">🎯</span></h3>
                 <p>在首页选择你想要练习的运算类型 <span class="emoji">👆</span>：</p>
                 <ul>
                     <li><strong>加法 ➕</strong>：基础加法运算训练 <span class="emoji">🔢</span></li>
                     <li><strong>减法 ➖</strong>：减法运算能力提升 <span class="emoji">📉</span></li>
                     <li><strong>乘法 ✖️</strong>：乘法速算技巧练习 <span class="emoji">⚡</span></li>
                     <li><strong>除法 ➗</strong>：除法运算精度训练 <span class="emoji">🎯</span></li>
                 </ul>

                 <h3><span class="emoji">2️⃣</span> 答题流程 <span class="emoji">🏃‍♂️</span></h3>
                 <p>点击"开始训练"按钮 <span class="emoji">🔘</span>，系统将：</p>
                 <ul>
                     <li><span class="emoji">🎲</span> 自动生成50道题目</li>
                     <li><span class="emoji">🌱</span> 从简单难度开始</li>
                     <li><span class="emoji">🎚️</span> 根据答题情况调整难度</li>
                     <li><span class="emoji">📊</span> 实时显示进度和统计</li>
                 </ul>

                 <h3><span class="emoji">3️⃣</span> 查看结果 <span class="emoji">📋</span></h3>
                 <p>完成训练后，系统提供详细的成绩报告 <span class="emoji">📊</span>：</p>
                 <ul>
                     <li><span class="emoji">🎯</span> 总体正确率</li>
                     <li><span class="emoji">⏱️</span> 答题用时</li>
                     <li><span class="emoji">📈</span> 各难度级别表现</li>
                     <li><span class="emoji">💡</span> 改进建议</li>
                 </ul>

                 <h3><span class="emoji">🎮</span> 功能按钮 <span class="emoji">🔘</span></h3>
                 <ul>
                     <li><strong>🔄 重新开始</strong>：重置当前训练，开始新一轮练习</li>
                     <li><strong>🏠 返回首页</strong>：回到运算类型选择界面</li>
                     <li><strong>⏸️ 暂停/继续</strong>：暂停或继续当前训练</li>
                     <li><strong>📊 查看统计</strong>：查看详细的答题数据</li>
                 </ul>

                 <h2><span class="emoji">🖥️</span> 界面说明 <span class="emoji">📱</span></h2>
                 
                 <h3><span class="emoji">🏠</span> 欢迎界面 <span class="emoji">👋</span></h3>
                 <ul>
                     <li><span class="emoji">🎯</span> 功能特性展示</li>
                     <li><span class="emoji">📝</span> 训练说明介绍</li>
                     <li><span class="emoji">🔘</span> 运算类型选择按钮</li>
                 </ul>

                 <h3><span class="emoji">🎯</span> 训练界面 <span class="emoji">📝</span></h3>
                 <ul>
                     <li><span class="emoji">📊</span> 顶部进度条和统计信息</li>
                     <li><span class="emoji">❓</span> 中央题目显示区域</li>
                     <li><span class="emoji">⌨️</span> 底部答案输入框和控制按钮</li>
                 </ul>

                 <h3><span class="emoji">📊</span> 结果界面 <span class="emoji">🏆</span></h3>
                 <ul>
                     <li><span class="emoji">🎯</span> 总体成绩展示</li>
                     <li><span class="emoji">📈</span> 详细统计数据</li>
                     <li><span class="emoji">🔄</span> 操作按钮（重新开始、返回首页）</li>
                 </ul>

                 <h2><span class="emoji">⚙️</span> 配置说明 <span class="emoji">🔧</span></h2>
                 
                 <h3><span class="emoji">🎯</span> 基础配置 <span class="emoji">📝</span></h3>
                 <div class="code-block">
                     <pre><code>const CONFIG = {
    API_KEY: '',                    // 通义千问API密钥
    MAX_QUESTIONS: 50,              // 最大题目数量
    NUMBER_RANGE: {                 // 数字范围配置
        MIN: 1,
        MAX: 100
    }
};</code></pre>
                 </div>

                 <h3><span class="emoji">🎚️</span> 难度调节 <span class="emoji">📈</span></h3>
                 <div class="code-block">
                     <pre><code>const DIFFICULTY_LEVELS = {
    1: { digits: 1, range: [1, 9] },      // 1位数
    2: { digits: 2, range: [10, 99] },    // 2位数
    3: { digits: 3, range: [100, 999] },  // 3位数
    4: { digits: 4, range: [1000, 9999] } // 4位数
};</code></pre>
                 </div>

                 <h2><span class="emoji">🛠️</span> 技术实现 <span class="emoji">🏗️</span></h2>
                 
                 <h3><span class="emoji">🏗️</span> 架构设计 <span class="emoji">⚙️</span></h3>
                 <ul>
                     <li><strong>🎯 TrainingState</strong>：全局状态管理，跟踪训练进度和统计数据 <span class="emoji">📊</span></li>
                     <li><strong>🎲 QuestionGenerator</strong>：题目生成器，支持AI和本地两种生成模式 <span class="emoji">🤖</span></li>
                     <li><strong>🎨 UIManager</strong>：界面管理器，处理页面切换和用户交互 <span class="emoji">👆</span></li>
                     <li><strong>📈 DifficultyManager</strong>：难度管理器，实现自适应难度调整 <span class="emoji">🎚️</span></li>
                 </ul>

                 <h3><span class="emoji">🔧</span> AI集成 <span class="emoji">🤖</span></h3>
                 <ul>
                     <li><span class="emoji">🧠</span> 使用Qwen API生成高质量数学题目</li>
                     <li><span class="emoji">🔍</span> 智能解析AI响应，提取题目和答案</li>
                     <li><span class="emoji">🛡️</span> 本地备用生成器，确保系统稳定性</li>
                 </ul>

                 <h3><span class="emoji">📱</span> 响应式设计 <span class="emoji">💻</span></h3>
                 <ul>
                     <li><span class="emoji">🎨</span> CSS Grid 和 Flexbox 布局</li>
                     <li><span class="emoji">📏</span> 媒体查询适配不同屏幕尺寸</li>
                     <li><span class="emoji">👆</span> 触摸友好的交互设计</li>
                 </ul>

                 <h2><span class="emoji">📱</span> 浏览器支持 <span class="emoji">🌐</span></h2>
                 <ul>
                     <li><span class="emoji">✅</span> Chrome 80+ <span class="emoji">🟢</span></li>
                     <li><span class="emoji">✅</span> Firefox 75+ <span class="emoji">🦊</span></li>
                     <li><span class="emoji">✅</span> Safari 13+ <span class="emoji">🍎</span></li>
                     <li><span class="emoji">✅</span> Edge 80+ <span class="emoji">🔷</span></li>
                     <li><span class="emoji">❌</span> Internet Explorer（不支持）<span class="emoji">🚫</span></li>
                 </ul>

                 <h2><span class="emoji">❓</span> 常见问题 <span class="emoji">🤔</span></h2>
                 
                 <h4><span class="emoji">🔧</span> Q: AI生成题目失败怎么办？</h4>
                 <p><span class="emoji">💡</span> A: 系统会自动切换到本地生成模式，确保训练正常进行 <span class="emoji">🔄</span>。请检查：</p>
                 <ul>
                     <li><span class="emoji">🔑</span> API密钥是否正确</li>
                     <li><span class="emoji">🌐</span> 网络连接是否正常</li>
                     <li><span class="emoji">💰</span> API额度是否充足</li>
                 </ul>

                 <h4><span class="emoji">⚙️</span> Q: 如何调整题目难度？</h4>
                 <p><span class="emoji">💡</span> A: 修改 <code>script.js</code> 中的 <code>DIFFICULTY_LEVELS</code> 配置，或调整难度切换的题目数量 <span class="emoji">🎚️</span>。</p>

                 <h4><span class="emoji">🔢</span> Q: 可以自定义题目数量吗？</h4>
                 <p><span class="emoji">💡</span> A: 修改 <code>CONFIG.MAX_QUESTIONS</code> 的值即可调整最大题目数量 <span class="emoji">📝</span>。</p>

                 <h4><span class="emoji">📱</span> Q: 支持移动设备吗？</h4>
                 <p><span class="emoji">💡</span> A: 完全支持！采用响应式设计，在手机、平板上都有良好的使用体验 <span class="emoji">📱💻</span>。</p>

                 <h4><span class="emoji">💾</span> Q: 数据会保存吗？</h4>
                 <p><span class="emoji">💡</span> A: 当前版本不保存历史数据，每次训练都是独立的。未来版本将支持数据持久化 <span class="emoji">🔮</span>。</p>

                 <h3><span class="emoji">🐛</span> 报告问题 <span class="emoji">📝</span></h3>
                 <ul>
                     <li><span class="emoji">🔍</span> 详细描述问题现象</li>
                     <li><span class="emoji">🌐</span> 提供浏览器和版本信息</li>
                     <li><span class="emoji">📷</span> 如可能，请提供截图</li>
                 </ul>

                 <h3><span class="emoji">💡</span> 功能建议 <span class="emoji">🚀</span></h3>
                 <ul>
                     <li><span class="emoji">🎯</span> 说明功能的使用场景</li>
                     <li><span class="emoji">📋</span> 描述期望的实现效果</li>
                     <li><span class="emoji">🤔</span> 考虑对现有功能的影响</li>
                 </ul>

                 <h3><span class="emoji">🔧</span> 代码贡献 <span class="emoji">👨‍💻</span></h3>
                 <ol>
                     <li><span class="emoji">🍴</span> Fork 项目到你的账户</li>
                     <li><span class="emoji">🌿</span> 创建功能分支</li>
                     <li><span class="emoji">✨</span> 实现新功能或修复问题</li>
                     <li><span class="emoji">✅</span> 确保代码质量和测试</li>
                     <li><span class="emoji">📤</span> 提交 Pull Request</li>
                 </ol>

                 <h2><span class="emoji">🙏</span> 致谢 <span class="emoji">❤️</span></h2>
                 <ul>
                     <li><span class="emoji">🤖</span> <strong>阿里云通义千问</strong>：提供强大的AI能力支持</li>
                     <li><span class="emoji">🎨</span> <strong>现代Web技术</strong>：HTML5、CSS3、JavaScript ES6+</li>
                     <li><span class="emoji">👥</span> <strong>开源社区</strong>：提供灵感和技术支持</li>
                     <li><span class="emoji">📚</span> <strong>公考考生</strong>：项目的最终受益者和动力源泉</li>
                 </ul>

                 <div class="highlight-box">
                     <h2 style="margin-top:15px;"><span class="emoji">🎯</span> 助力公考成功，从提升数量关系能力开始！<span class="emoji">🚀</span></h2>
                     <p style="text-align: center; font-size: 1.1em; margin-top: 20px;"><span class="emoji">⭐</span> 如果这个项目对你有帮助，请给它一个星标！<span class="emoji">🌟</span></p>
                     <p style="text-align: center; margin-top: 15px;"><span class="emoji">💪</span> 坚持练习，成功就在前方！<span class="emoji">🏆</span></p>
                 </div>
             </div>
         `;
    }

    // 显示README覆盖层
    function showReadmeOverlay() {
        const overlay = document.getElementById('readme-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            // 防止背景滚动
            document.body.style.overflow = 'hidden';
        }
    }

    // 隐藏README覆盖层
    function hideReadmeOverlay() {
        const overlay = document.getElementById('readme-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            // 恢复背景滚动
            document.body.style.overflow = 'auto';
        }
    }

    // 初始化README容器
    initializeReadmeContainer();

    // 底部使用说明链接点击事件
    if (footerReadmeLink) {
        footerReadmeLink.addEventListener('click', function (e) {
            e.preventDefault();
            showReadmeOverlay();
        });
    }

    // 点击覆盖层背景关闭README
    const readmeOverlay = document.getElementById('readme-overlay');
    if (readmeOverlay) {
        readmeOverlay.addEventListener('click', function(e) {
            // 只有点击覆盖层背景时才关闭，点击内容区域不关闭
            if (e.target === readmeOverlay) {
                hideReadmeOverlay();
            }
        });
    }

    // ESC键关闭README
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideReadmeOverlay();
        }
    });
});