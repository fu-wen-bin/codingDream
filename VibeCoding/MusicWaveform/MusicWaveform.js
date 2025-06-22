class MusicVisualizer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.audio = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isPlaying = false;
        this.currentBuffer = null;
        this.oscillators = [];
        this.isDragging = false;
        
        // 可视化设置
        this.visualizerType = 'bars';
        this.sensitivity = 5;
        this.smoothing = 0.8;
        this.colorScheme = 'rainbow';
        
        this.init();
    }

    init() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupEventListeners();
        this.drawIdleState();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * window.devicePixelRatio;
            this.canvas.height = rect.height * window.devicePixelRatio;
            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    setupEventListeners() {
        const audioFile = document.getElementById('audioFile');
        const builtInMusic = document.getElementById('builtInMusic');
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        const volume = document.getElementById('volume');
        const visualizerType = document.getElementById('visualizerType');
        const sensitivity = document.getElementById('sensitivity');
        const smoothing = document.getElementById('smoothing');
        const colorScheme = document.getElementById('colorScheme');
        const playbackRate = document.getElementById('playbackRate');
        const progressBar = document.querySelector('.progress-bar');

        audioFile.addEventListener('change', (e) => this.loadAudio(e.target.files[0]));
        builtInMusic.addEventListener('change', (e) => this.loadBuiltInMusic(e.target.value));
        playBtn.addEventListener('click', () => this.togglePlay());
        stopBtn.addEventListener('click', () => this.stop());
        volume.addEventListener('input', (e) => this.setVolume(e.target.value));
        visualizerType.addEventListener('change', (e) => this.visualizerType = e.target.value);
        sensitivity.addEventListener('input', (e) => this.sensitivity = parseInt(e.target.value));
        smoothing.addEventListener('input', (e) => this.smoothing = parseFloat(e.target.value));
        colorScheme.addEventListener('change', (e) => this.colorScheme = e.target.value);
        playbackRate.addEventListener('change', (e) => this.setPlaybackRate(parseFloat(e.target.value)));
        
        // 进度条事件
        progressBar.addEventListener('click', (e) => this.seekTo(e));
        progressBar.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
    }

    async loadAudio(file) {
        if (!file) return;

        try {
            // 显示加载状态
            document.querySelector('.visualizer-container').classList.add('loading');
            
            // 创建音频上下文
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // 停止当前播放
            this.stop();

            // 创建音频元素
            this.audio = new Audio();
            this.audio.src = URL.createObjectURL(file);
            this.audio.crossOrigin = 'anonymous';

            // 设置音频事件
            this.audio.addEventListener('loadedmetadata', () => {
                document.getElementById('songTitle').textContent = file.name;
                this.updateTimeDisplay();
                document.querySelector('.visualizer-container').classList.remove('loading');
            });

            this.audio.addEventListener('timeupdate', () => this.updateTimeDisplay());
            this.audio.addEventListener('ended', () => this.stop());

            // 创建音频节点
            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.analyser = this.audioContext.createAnalyser();
            const gainNode = this.audioContext.createGain();

            // 连接音频节点
            this.source.connect(this.analyser);
            this.analyser.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // 配置分析器
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = this.smoothing;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            // 启用控制按钮
            document.getElementById('playBtn').disabled = false;
            document.getElementById('stopBtn').disabled = false;

            // 设置音量
            this.setVolume(document.getElementById('volume').value);

        } catch (error) {
            console.error('加载音频失败:', error);
            alert('加载音频文件失败，请尝试其他文件。');
            document.querySelector('.visualizer-container').classList.remove('loading');
        }
    }

    async loadBuiltInMusic(musicType) {
        if (!musicType) return;

        try {
            // 显示加载状态
            document.querySelector('.visualizer-container').classList.add('loading');
            
            // 创建音频上下文
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            // 停止当前播放
            this.stop();

            // 生成合成音频
            const audioBuffer = await this.generateSyntheticAudio(musicType);
            this.currentBuffer = audioBuffer;

            // 设置分析器
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = this.smoothing;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);

            // 更新UI
            const musicNames = {
                'electronic': '🎹 电子音乐',
                'ambient': '🌊 环境音乐',
                'drum': '🥁 鼓点节拍',
                'melody': '🎼 旋律音乐',
                'bass': '🎸 低音音乐'
            };
            
            document.getElementById('songTitle').textContent = musicNames[musicType];
            document.getElementById('timeDisplay').textContent = '00:00 / 01:00';
            document.querySelector('.visualizer-container').classList.remove('loading');

            // 启用控制按钮
            document.getElementById('playBtn').disabled = false;
            document.getElementById('stopBtn').disabled = false;

            // 重置文件选择
            document.getElementById('audioFile').value = '';

        } catch (error) {
            console.error('加载内置音乐失败:', error);
            alert('加载内置音乐失败，请尝试其他选项。');
            document.querySelector('.visualizer-container').classList.remove('loading');
        }
    }

    async generateSyntheticAudio(musicType) {
        const sampleRate = this.audioContext.sampleRate;
        const duration = 60; // 60秒
        const frameCount = sampleRate * duration;
        const audioBuffer = this.audioContext.createBuffer(2, frameCount, sampleRate);

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            
            switch (musicType) {
                case 'electronic':
                    this.generateElectronicMusic(channelData, sampleRate);
                    break;
                case 'ambient':
                    this.generateAmbientMusic(channelData, sampleRate);
                    break;
                case 'drum':
                    this.generateDrumBeat(channelData, sampleRate);
                    break;
                case 'melody':
                    this.generateMelody(channelData, sampleRate);
                    break;
                case 'bass':
                    this.generateBassMusic(channelData, sampleRate);
                    break;
            }
        }

        return audioBuffer;
    }

    generateElectronicMusic(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            const freq1 = 220 + Math.sin(time * 0.5) * 50;
            const freq2 = 440 + Math.cos(time * 0.3) * 100;
            const freq3 = 880 + Math.sin(time * 0.7) * 200;
            
            const wave1 = Math.sin(2 * Math.PI * freq1 * time) * 0.3;
            const wave2 = Math.sin(2 * Math.PI * freq2 * time) * 0.2;
            const wave3 = Math.sin(2 * Math.PI * freq3 * time) * 0.1;
            
            const envelope = Math.sin(time * 2) * 0.5 + 0.5;
            channelData[i] = (wave1 + wave2 + wave3) * envelope * 0.5;
        }
    }

    generateAmbientMusic(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            const freq1 = 110 + Math.sin(time * 0.1) * 20;
            const freq2 = 220 + Math.cos(time * 0.15) * 30;
            const freq3 = 330 + Math.sin(time * 0.08) * 15;
            
            const wave1 = Math.sin(2 * Math.PI * freq1 * time) * 0.4;
            const wave2 = Math.sin(2 * Math.PI * freq2 * time) * 0.3;
            const wave3 = Math.sin(2 * Math.PI * freq3 * time) * 0.2;
            
            const envelope = (Math.sin(time * 0.5) + 1) * 0.3;
            channelData[i] = (wave1 + wave2 + wave3) * envelope;
        }
    }

    generateDrumBeat(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            const beatTime = time % 1; // 1秒一个循环
            
            let sample = 0;
            
            // 底鼓 (每拍)
            if (beatTime < 0.1) {
                const kickFreq = 60;
                const kickEnv = Math.exp(-beatTime * 30);
                sample += Math.sin(2 * Math.PI * kickFreq * beatTime) * kickEnv * 0.8;
            }
            
            // 军鼓 (第2和第4拍)
            if ((beatTime > 0.45 && beatTime < 0.55) || (beatTime > 0.95 && beatTime < 1.05)) {
                const snareTime = beatTime > 0.5 ? beatTime - 0.5 : beatTime;
                const snareEnv = Math.exp(-snareTime * 20);
                const noise = (Math.random() - 0.5) * 2;
                sample += noise * snareEnv * 0.4;
            }
            
            // Hi-hat (每半拍)
            if (beatTime % 0.25 < 0.05) {
                const hihatTime = beatTime % 0.25;
                const hihatEnv = Math.exp(-hihatTime * 50);
                const hihatNoise = (Math.random() - 0.5) * 2;
                sample += hihatNoise * hihatEnv * 0.2;
            }
            
            channelData[i] = sample * 0.7;
        }
    }

    generateMelody(channelData, sampleRate) {
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C大调音阶
        
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            const noteIndex = Math.floor(time * 2) % notes.length;
            const freq = notes[noteIndex];
            
            const wave = Math.sin(2 * Math.PI * freq * time);
            const envelope = Math.sin(time * 4) * 0.3 + 0.7;
            
            channelData[i] = wave * envelope * 0.4;
        }
    }

    generateBassMusic(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            const bassFreq = 55 + Math.sin(time * 0.25) * 20; // 低频范围
            
            const wave1 = Math.sin(2 * Math.PI * bassFreq * time) * 0.6;
            const wave2 = Math.sin(2 * Math.PI * bassFreq * 2 * time) * 0.2;
            const wave3 = Math.sin(2 * Math.PI * bassFreq * 0.5 * time) * 0.3;
            
            const envelope = Math.sin(time * 1) * 0.4 + 0.6;
            channelData[i] = (wave1 + wave2 + wave3) * envelope;
        }
    }

    async togglePlay() {
        if (!this.audio && !this.currentBuffer) return;

        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            if (this.isPlaying) {
                // 停止播放
                if (this.audio) {
                    this.audio.pause();
                } else if (this.source) {
                    this.source.stop();
                    this.source = null;
                }
                
                this.isPlaying = false;
                document.querySelector('.play-icon').style.display = 'inline';
                document.querySelector('.pause-icon').style.display = 'none';
                document.body.classList.remove('playing');
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            } else {
                // 开始播放
                if (this.audio) {
                    // 播放文件音频
                    await this.audio.play();
                } else if (this.currentBuffer) {
                    // 播放合成音频
                    this.source = this.audioContext.createBufferSource();
                    this.source.buffer = this.currentBuffer;
                    this.source.connect(this.analyser);
                    this.analyser.connect(this.audioContext.destination);
                    this.source.loop = true;
                    this.source.start();
                    this.playStartTime = Date.now();
                }
                
                this.isPlaying = true;
                document.querySelector('.play-icon').style.display = 'none';
                document.querySelector('.pause-icon').style.display = 'inline';
                document.body.classList.add('playing');
                this.animate();
            }
        } catch (error) {
            console.error('播放控制失败:', error);
        }
    }

    stop() {
        if (!this.audio && !this.currentBuffer) return;

        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        } else if (this.source) {
            this.source.stop();
            this.source = null;
        }
        
        this.isPlaying = false;
        document.querySelector('.play-icon').style.display = 'inline';
        document.querySelector('.pause-icon').style.display = 'none';
        document.body.classList.remove('playing');
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.drawIdleState();
    }

    setVolume(value) {
        if (this.audio) {
            this.audio.volume = value / 100;
        }
    }

    updateTimeDisplay() {
        let currentTime = 0;
        let duration = 0;
        
        if (this.audio) {
            currentTime = this.audio.currentTime || 0;
            duration = this.audio.duration || 0;
        } else if (this.currentBuffer) {
            // 对于合成音频，显示循环播放状态
            duration = this.currentBuffer.duration;
            currentTime = this.isPlaying ? (Date.now() - this.playStartTime) / 1000 % duration : 0;
        }
        
        // 更新时间显示
        document.querySelector('.current-time').textContent = this.formatTime(currentTime);
        document.querySelector('.total-time').textContent = this.formatTime(duration);
        document.getElementById('timeDisplay').textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
        
        // 更新进度条
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressHandle').style.left = `${progress}%`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    animate() {
        if (!this.isPlaying) return;

        this.animationId = requestAnimationFrame(() => this.animate());
        
        // 更新分析器设置
        this.analyser.smoothingTimeConstant = this.smoothing;
        
        // 获取频率数据
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // 绘制可视化效果
        this.draw();
    }

    draw() {
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        
        // 清空画布
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);

        switch (this.visualizerType) {
            case 'bars':
                this.drawBars(width, height);
                break;
            case 'wave':
                this.drawWave(width, height);
                break;
            case 'circle':
                this.drawCircle(width, height);
                break;
            case 'particles':
                this.drawParticles(width, height);
                break;
        }
    }

    drawBars(width, height) {
        const barWidth = width / this.bufferLength * 2.5;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = (this.dataArray[i] / 255) * height * (this.sensitivity / 5);
            
            const color = this.getColor(i, this.bufferLength);
            this.ctx.fillStyle = color;
            
            this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    drawWave(width, height) {
        // 获取时域数据
        const timeDataArray = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(timeDataArray);
        
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = this.getColor(0, 1);
        this.ctx.beginPath();
        
        const sliceWidth = width / timeDataArray.length;
        let x = 0;
        
        for (let i = 0; i < timeDataArray.length; i++) {
            const v = (timeDataArray[i] / 128.0) * (this.sensitivity / 5);
            const y = v * height / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.ctx.stroke();
    }

    drawCircle(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 4;
        
        for (let i = 0; i < this.bufferLength; i++) {
            const angle = (i / this.bufferLength) * Math.PI * 2;
            const barHeight = (this.dataArray[i] / 255) * radius * (this.sensitivity / 5);
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);
            
            this.ctx.strokeStyle = this.getColor(i, this.bufferLength);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    drawParticles(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < this.bufferLength; i += 10) {
            const intensity = this.dataArray[i] / 255;
            if (intensity > 0.1) {
                const angle = Math.random() * Math.PI * 2;
                const distance = intensity * Math.min(width, height) / 2 * (this.sensitivity / 5);
                
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                const size = intensity * 10;
                
                this.ctx.fillStyle = this.getColor(i, this.bufferLength);
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    getColor(index, total) {
        const hue = (index / total) * 360;
        
        switch (this.colorScheme) {
            case 'rainbow':
                return `hsl(${hue}, 100%, 50%)`;
            case 'blue':
                return `hsl(${200 + (index / total) * 60}, 100%, 50%)`;
            case 'red':
                return `hsl(${0 + (index / total) * 60}, 100%, 50%)`;
            case 'green':
                return `hsl(${120 + (index / total) * 60}, 100%, 50%)`;
            case 'purple':
                return `hsl(${280 + (index / total) * 60}, 100%, 50%)`;
            default:
                return `hsl(${hue}, 100%, 50%)`;
        }
    }

    drawIdleState() {
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        
        this.ctx.clearRect(0, 0, width, height);
        
        // 绘制提示文字
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('选择音频文件开始可视化', width / 2, height / 2 - 20);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillText('支持 MP3, WAV, OGG 等格式', width / 2, height / 2 + 20);
        
        // 绘制装饰性的静态波形
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let i = 0; i < width; i += 4) {
            const y = height / 2 + Math.sin(i * 0.02) * 30 * Math.sin(i * 0.005);
            if (i === 0) {
                this.ctx.moveTo(i, y);
            } else {
                this.ctx.lineTo(i, y);
            }
        }
        
        this.ctx.stroke();
    }

    // 设置播放倍速
    setPlaybackRate(rate) {
        if (this.audio) {
            this.audio.playbackRate = rate;
        }
        // 注意：合成音频的倍速需要重新生成，这里暂时不支持
    }

    // 进度条拖拽相关
    startDrag(e) {
        this.isDragging = true;
        this.seekTo(e);
    }

    drag(e) {
        if (this.isDragging) {
            this.seekTo(e);
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    // 跳转到指定位置
    seekTo(e) {
        if (!this.audio && !this.currentBuffer) return;
        
        const progressBar = document.querySelector('.progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        
        if (this.audio) {
            const duration = this.audio.duration || 0;
            const newTime = duration * percentage;
            this.audio.currentTime = newTime;
        }
        // 注意：合成音频的跳转需要重新开始播放，这里暂时不支持精确跳转
        
        this.updateTimeDisplay();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new MusicVisualizer();
});