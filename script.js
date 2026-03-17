let timeLeft = 25 * 60;
let timerId = null;
let isRunning = false;
let startTime = 0;
let lastTick = 0;

const display = document.getElementById('timer-display');
const breathGuide = document.getElementById('breath-guide');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const glassCard = document.querySelector('.glass-card');
const presetBtns = document.querySelectorAll('.preset-btn');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateBreathText() {
    if (!isRunning) return;
    
    const elapsed = Date.now() - startTime;
    const cyclePos = elapsed % 8000; // 8 seconds cycle

    // 0-4s Expansion = Inhale | 4-8s Contraction = Exhale
    if (cyclePos < 4000) {
        if (breathGuide.innerText !== "Inhale") breathGuide.innerText = "Inhale";
    } else {
        if (breathGuide.innerText !== "Exhale") breathGuide.innerText = "Exhale";
    }
}

function startTimer() {
    if (isRunning) {
        // PAUSE
        clearInterval(timerId);
        startBtn.innerText = "Resume";
        breathGuide.innerText = "Paused";
        glassCard.classList.remove('breathing');
    } else {
        // START/RESUME
        if (!startTime) startTime = Date.now();
        lastTick = Date.now();
        
        glassCard.classList.add('breathing');
        startBtn.innerText = "Stop";
        
        timerId = setInterval(() => {
            const now = Date.now();
            
            // Precise Text Sync (100ms)
            updateBreathText();
            
            // Logical Second Tick
            if (now - lastTick >= 1000) {
                timeLeft--;
                updateDisplay();
                lastTick = now;
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                finishSession();
            }
        }, 100);
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    startTime = 0;
    const activePreset = document.querySelector('.preset-btn.active').dataset.time;
    timeLeft = activePreset * 60;
    updateDisplay();
    breathGuide.innerText = "Ready?";
    startBtn.innerText = "Start";
    glassCard.classList.remove('breathing');
}

function finishSession() {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    alert("Focus session complete!");
    resetTimer();
}

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return;
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeLeft = btn.dataset.time * 60;
        updateDisplay();
    });
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();