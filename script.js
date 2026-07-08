// --- CENTRALIZED STATE CONFIGURATION ---
const AppState = {
    currentQuizIndex: 0,
    gameScore: 0,
    gameTimer: null,
    gameTimeLeft: 15,
    hiddenCatIndex: 0,
    letterLines: [
        "Dear Bauni,",
        "Happy Birthday! 💜",
        "Thank you for always being such an amazing friend.",
        "I still remember when we first met in Sant Sai School.",
        "You were sitting behind me on the back bench. 🏫",
        "Little did I know you would become my first female friend.",
        "Thank you for listening to my stupid jokes.",
        "Thank you for acting like my teacher.",
        "Thank you for being dramatic. 🎭",
        "Thank you for always being there.",
        "I still hope one day you'll actually help me find a girlfriend 😂",
        "May this year bring you happiness, success, good health and lots of reasons to smile.",
        "Stay exactly the wonderful person you are.",
        "Happy Birthday once again! 🎉",
        "Your friend,",
        "Shiv ❤️"
    ],
    quizQuestions: [
        {
            q: "Where did we first meet?",
            options: ["Tuition Classes", "Sant Sai School, Bhosari", "Playground", "Online"],
            correct: 1
        },
        {
            q: "Who sat behind whom during our classroom days?",
            options: ["Shiv sat behind Sakshi", "Sakshi sat behind Shiv", "We sat side-by-side", "Different divisions"],
            correct: 1
        },
        {
            q: "Which standard were we in when we became close friends?",
            options: ["8th Standard", "9th Standard", "10th Standard", "11th Standard"],
            correct: 2
        },
        {
            q: "Sakshi holds which special historical record for Shiv?",
            options: ["First Female Friend", "Best Fight Partner", "Loudest Laugher", "Top Homework Helper"],
            correct: 0
        },
        {
            q: "Which personality trait defines Bauni perfectly?",
            options: ["Extremely quiet", "Highly dramatic & acts like my teacher", "Always on time", "Hates chocolates"],
            correct: 1
        }
    ]
};

// --- INITIALIZER ---
document.addEventListener("DOMContentLoaded", () => {
    generateAmbientEffects();
    executeLoadingSequence();
    bindInteractionEvents();
});

// --- AMBIENT SIMULATION ENGINES ---
function generateAmbientEffects() {
    const pContainer = document.getElementById('particleContainer');
    const rContainer = document.getElementById('rainContainer');
    const visualPool = ['🌸', '✨', '❤️', '🌸', '✨'];

    // Generate Floating Particles
    for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.className = 'ambient-item';
        span.innerText = visualPool[Math.floor(Math.random() * visualPool.length)];
        span.style.left = `${Math.random() * 100}vw`;
        span.style.animationDelay = `${Math.random() * 6}s`;
        span.style.fontSize = `${Math.random() * 15 + 15}px`;
        pContainer.appendChild(span);
    }

    // Generate Soft Romantic Rain Drops
    for (let i = 0; i < 15; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
        rContainer.appendChild(drop);
    }
}

// --- SCREEN SYSTEM CONTROLLER ---
function navigateToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if(target) target.classList.add('active');
}

// --- SYSTEM LOADING ROUTINE ---
function executeLoadingSequence() {
    const bar = document.getElementById('progressBar');
    const status = document.getElementById('loadingStatus');
    const messages = ["Analyzing back-bench records...", "Counting dramatic interactions...", "Checking teacher-mode criteria...", "System Ready! 💜"];
    let progress = 0;

    const interval = setInterval(() => {
        progress += 2;
        bar.style.width = `${progress}%`;
        
        if(progress === 25) status.innerText = messages[0];
        if(progress === 50) status.innerText = messages[1];
        if(progress === 75) status.innerText = messages[2];
        if(progress === 95) status.innerText = messages[3];

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                navigateToScreen('welcomeScreen');
                triggerWelcomeTypewriter();
            }, 600);
        }
    }, 40);
}

// --- WELCOME INTERACTION EFFECT ---
function triggerWelcomeTypewriter() {
    const target = document.getElementById('welcomeTypewriter');
    const text = "Warning: This is not a normal card. You have entered a secure emotional database curated specifically for Bauni. Complete the challenges ahead to decrypt a secret package from Shiv. 🚀";
    let index = 0;

    function type() {
        if (index < text.length) {
            target.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 30);
        }
    }
    type();
}

// --- INTERACTION EVENT LINKING ---
function bindInteractionEvents() {
    document.getElementById('startMissionBtn').addEventListener('click', () => {
        navigateToScreen('level1Screen');
        loadQuizQuestion();
    });

    document.getElementById('unlockBtn').addEventListener('click', verifyPasswordOverride);
    
    document.getElementById('easterEggCat').addEventListener('click', () => {
        alert("🐾 MEOW! You found the hidden Easter Egg Cat! Bauni points +100! Keep playing!");
    });

    document.getElementById('finishMissionBtn').addEventListener('click', triggerGrandFinale);
    
    document.getElementById('claimRewardBtn').addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('couponBox').classList.remove('element-hidden');
    });

    // Setup Destiny Box Events
    document.querySelectorAll('.destiny-box').forEach(box => {
        box.addEventListener('click', handleDestinyChoice);
    });
}

// --- LEVEL 1 ENGINE: QUIZ CONTROLLER ---
function loadQuizQuestion() {
    const currentData = AppState.quizQuestions[AppState.currentQuizIndex];
    document.getElementById('quizCurrent').innerText = AppState.currentQuizIndex + 1;
    document.getElementById('questionText').innerText = currentData.q;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    currentData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => processQuizSelection(idx, btn));
        container.appendChild(btn);
    });
}

function processQuizSelection(selectedIdx, selectedButton) {
    const currentData = AppState.quizQuestions[AppState.currentQuizIndex];
    const allButtons = document.querySelectorAll('.option-btn');
    
    allButtons.forEach(b => b.style.pointerEvents = 'none');

    if (selectedIdx === currentData.correct) {
        selectedButton.classList.add('correct');
        setTimeout(() => {
            AppState.currentQuizIndex++;
            if (AppState.currentQuizIndex < AppState.quizQuestions.length) {
                loadQuizQuestion();
            } else {
                navigateToScreen('level2Screen');
                initializeCakeGame();
            }
        }, 1000);
    } else {
        selectedButton.classList.add('wrong');
        setTimeout(() => {
            allButtons.forEach(b => b.style.pointerEvents = 'auto');
            selectedButton.classList.remove('wrong');
        }, 1000);
    }
}

// --- LEVEL 2 ENGINE: CAKE CATCH GAME ---
function initializeCakeGame() {
    AppState.gameScore = 0;
    AppState.gameTimeLeft = 15;
    document.getElementById('gameScore').innerText = AppState.gameScore;
    document.getElementById('gameTimer').innerText = AppState.gameTimeLeft;

    AppState.gameTimer = setInterval(() => {
        AppState.gameTimeLeft--;
        document.getElementById('gameTimer').innerText = AppState.gameTimeLeft;

        if (AppState.gameTimeLeft <= 0) {
            clearInterval(AppState.gameTimer);
            if (AppState.gameScore >= 10) {
                advanceToLevel3();
            } else {
                alert("Time's up! Let's try faster this time! 🎂");
                initializeCakeGame();
            }
        }
    }, 1000);

    spawnTargetCake();
}

function spawnTargetCake() {
    if (AppState.gameTimeLeft <= 0 || AppState.gameScore >= 10) return;

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const cake = document.createElement('div');
    cake.className = 'target-cake';
    cake.innerHTML = '🎂';
    
    const x = Math.random() * (canvas.clientWidth - 50) + 25;
    const y = Math.random() * (canvas.clientHeight - 50) + 25;
    
    cake.style.left = `${x}px`;
    cake.style.top = `${y}px`;

    const pointerHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        AppState.gameScore++;
        document.getElementById('gameScore').innerText = AppState.gameScore;
        
        if (AppState.gameScore >= 10) {
            clearInterval(AppState.gameTimer);
            canvas.innerHTML = '';
            setTimeout(advanceToLevel3, 600);
        } else {
            spawnTargetCake();
        }
    };

    cake.addEventListener('touchstart', pointerHandler, {passive: false});
    cake.addEventListener('mousedown', pointerHandler);

    canvas.appendChild(cake);
}

function advanceToLevel3() {
    navigateToScreen('level3Screen');
    initializeCatGrid();
}

// --- LEVEL 3 ENGINE: CAT SEARCH MATRIX ---
function initializeCatGrid() {
    AppState.hiddenCatIndex = Math.floor(Math.random() * 4);
    const elements = document.querySelectorAll('.gift-box-item');
    
    elements.forEach(el => {
        el.innerText = '📦';
        el.classList.remove('open-success');
        el.style.pointerEvents = 'auto';
        
        el.onclick = function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (index === AppState.hiddenCatIndex) {
                this.innerText = '🐱';
                this.classList.add('open-success');
                elements.forEach(box => box.style.pointerEvents = 'none');
                setTimeout(() => {
                    navigateToScreen('level4Screen');
                }, 1200);
            } else {
                this.innerText = '💨';
                this.style.pointerEvents = 'none';
            }
        };
    });
}

// --- LEVEL 4 ENGINE: DESTINY SYSTEM ---
function handleDestinyChoice() {
    const selected = this;
    const siblings = document.querySelectorAll('.destiny-box');
    
    siblings.forEach(box => box.style.pointerEvents = 'none');

    siblings.forEach(box => {
        if (box !== selected) {
            box.classList.add('fade-out');
        }
    });

    setTimeout(() => {
        selected.classList.add('reveal-open');
        selected.innerHTML = '👑';
    }, 600);

    setTimeout(() => {
        selected.className = 'destiny-box';
        selected.innerHTML = '🎁';
        siblings.forEach(box => box.style.pointerEvents = 'auto'); // FIXED: Restores pointer capabilities globally
        navigateToScreen('level5Screen');
    }, 2000);
}

// --- LEVEL 5 ENGINE: THE RIDDLE ---
function checkRiddle(isCorrect) {
    if(isCorrect) {
        navigateToScreen('level6Screen');
    } else {
        alert("Wrong answer! Think about Shiv's classic response! 😂");
    }
}

// --- LEVEL 6 ENGINE: CRYPTOGRAPHIC CONTROL ---
function verifyPasswordOverride() {
    const input = document.getElementById('passwordInput');
    const card = document.getElementById('passwordCard');
    
    if (input.value === '0807') {
        navigateToScreen('letterScreen');
        renderLetterSequentially();
    } else {
        card.classList.add('shake-animation');
        input.value = '';
        setTimeout(() => {
            card.classList.remove('shake-animation');
        }, 400);
    }
}

// --- LETTER ENGINE: TYPOGRAPHIC STREAM ---
function renderLetterSequentially() {
    const container = document.getElementById('letterBody');
    let delay = 0;

    AppState.letterLines.forEach((lineText) => {
        const lineElement = document.createElement('p');
        lineElement.className = 'letter-line';
        lineElement.innerText = lineText;
        lineElement.style.animationDelay = `${delay}s`;
        container.appendChild(lineElement);
        
        delay += 1.8; 
    });

    setTimeout(() => {
        const actionBox = document.getElementById('letterAction');
        actionBox.classList.remove('element-hidden');
        actionBox.style.animation = 'popupElement 0.5s ease forward';
    }, (AppState.letterLines.length * 1800));
}

// --- GRAND FINALE & CELEBRATION SYSTEM ---
function triggerGrandFinale() {
    navigateToScreen('endingScreen');
    launchConfettiEngine();
}

function launchConfettiEngine() {
    const canvas = document.getElementById('confettiCanvas');
    const celebratoryPool = ['🎉', '💜', '✨', '🌸', '🎂', '🐈'];
    
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.innerText = celebratoryPool[Math.floor(Math.random() * celebratoryPool.length)];
        emoji.style.position = 'absolute';
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `-20px`;
        emoji.style.fontSize = `${Math.random() * 20 + 20}px`;
        emoji.style.transition = 'transform 3s linear, opacity 3s linear';
        
        canvas.appendChild(emoji);

        setTimeout(() => {
            emoji.style.transform = `translateY(110vh) rotate(${Math.random() * 360}deg)`;
        }, 50);

        setTimeout(() => {
            emoji.remove();
        }, 3000);
    }, 150);
}
