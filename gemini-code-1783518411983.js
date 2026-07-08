// --- CENTRALIZED APP LEVEL DATA MANAGER ---
const AppState = {
    currentQuizIndex: 0,
    gameScore: 0,
    gameTimer: null,
    gameTimeLeft: 15,
    hiddenCatIndex: 0,
    memoryCards: ['🐱', '🐾', '🐱', '🐾'], 
    flippedCards: [],
    matchedPairsCount: 0,
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

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    generateAmbientSimulation();
    runLoadingSequence();
    bindInteractiveActions();
});

// --- AMBIENT BACKGROUND PARTICLES GENERATOR ---
function generateAmbientSimulation() {
    const pContainer = document.getElementById('particleContainer');
    const rContainer = document.getElementById('rainContainer');
    const visualPool = ['🌸', '✨', '❤️', '🌸', '✨'];

    for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.className = 'ambient-item';
        span.innerText = visualPool[Math.floor(Math.random() * visualPool.length)];
        span.style.left = `${Math.random() * 100}vw`;
        span.style.animationDelay = `${Math.random() * 6}s`;
        span.style.fontSize = `${Math.random() * 15 + 15}px`;
        pContainer.appendChild(span);
    }

    for (let i = 0; i < 15; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
        rContainer.appendChild(drop);
    }
}

// --- APP CORE NAVIGATOR ---
function switchActiveScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.pointerEvents = 'none';
    });
    const target = document.getElementById(screenId);
    if(target) {
        target.classList.add('active');
        target.style.pointerEvents = 'auto';
    }
}

// --- BOOT ROUTINE TIMER MANAGEMENT ---
function runLoadingSequence() {
    const bar = document.getElementById('progressBar');
    const status = document.getElementById('loadingStatus');
    const messages = ["Analyzing back-bench records...", "Counting dramatic loops...", "Assembling cat micro-engines...", "System Secure. Hello Bauni! 💜"];
    let progress = 0;

    const interval = setInterval(() => {
        progress += 2;
        bar.style.width = `${progress}%`;
        
        if(progress === 24) status.innerText = messages[0];
        if(progress === 52) status.innerText = messages[1];
        if(progress === 76) status.innerText = messages[2];
        if(progress === 96) status.innerText = messages[3];

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                switchActiveScreen('welcomeScreen');
                triggerWelcomeTypewriterAnimation();
            }, 500);
        }
    }, 35);
}

// --- WELCOME TYPING MECHANISM ---
function triggerWelcomeTypewriterAnimation() {
    const target = document.getElementById('welcomeTypewriter');
    const text = "System Alert: This is not a static birthday card. You've powered up an interactive surprise mainframe. Overcome all the games to access an encrypted package from Shiv. 🚀";
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

// --- PERSISTENT ELEMENT BINDINGS ---
function bindInteractiveActions() {
    document.getElementById('startMissionBtn').addEventListener('click', () => {
        switchActiveScreen('level1Screen');
        loadQuizEngineQuestion();
    });

    document.getElementById('unlockBtn').addEventListener('click', authorizePasscodeChallenge);
    
    document.getElementById('easterEggCat').addEventListener('click', () => {
        alert("🐾 Easter Egg Found! You spotted the stealth corner kitty! Sakshi Score +500! Proceed with the mission!");
    });

    document.getElementById('finishMissionBtn').addEventListener('click', triggerGrandFinaleSequence);
    
    document.getElementById('claimRewardBtn').addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('couponBox').classList.remove('element-hidden');
    });
}

// --- LEVEL 1 ENGINE: QUIZ PLATFORM ---
function loadQuizEngineQuestion() {
    const currentData = AppState.quizQuestions[AppState.currentQuizIndex];
    document.getElementById('quizCurrent').innerText = AppState.currentQuizIndex + 1;
    document.getElementById('questionText').innerText = currentData.q;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    currentData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.addEventListener('click', () => evaluateQuizChoice(idx, btn));
        container.appendChild(btn);
    });
}

function evaluateQuizChoice(selectedIdx, targetBtn) {
    const currentData = AppState.quizQuestions[AppState.currentQuizIndex];
    const choices = document.querySelectorAll('.option-btn');
    
    choices.forEach(b => b.style.pointerEvents = 'none');

    if (selectedIdx === currentData.correct) {
        targetBtn.classList.add('correct');
        setTimeout(() => {
            AppState.currentQuizIndex++;
            if (AppState.currentQuizIndex < AppState.quizQuestions.length) {
                loadQuizEngineQuestion();
            } else {
                switchActiveScreen('level2Screen');
                launchCakeCatchMiniGame();
            }
        }, 900);
    } else {
        targetBtn.classList.add('wrong');
        setTimeout(() => {
            choices.forEach(b => b.style.pointerEvents = 'auto');
            targetBtn.classList.remove('wrong');
        }, 900);
    }
}

// --- LEVEL 2 ENGINE: ACTIVE REFLEX CANVAS ---
function launchCakeCatchMiniGame() {
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
                advanceToLevel3Matrix();
            } else {
                alert("Mission temporary fault! Get 10 cakes faster to balance the score! 🎂");
                launchCakeCatchMiniGame();
            }
        }
    }, 1000);

    renderActiveTargetCake();
}

function renderActiveTargetCake() {
    if (AppState.gameTimeLeft <= 0 || AppState.gameScore >= 10) return;

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const target = document.createElement('div');
    target.className = 'target-cake';
    target.innerHTML = '🎂';
    
    const x = Math.random() * (canvas.clientWidth - 60) + 30;
    const y = Math.random() * (canvas.clientHeight - 60) + 30;
    
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    const registerHit = (e) => {
        e.preventDefault();
        AppState.gameScore++;
        document.getElementById('gameScore').innerText = AppState.gameScore;
        
        if (AppState.gameScore >= 10) {
            clearInterval(AppState.gameTimer);
            canvas.innerHTML = '';
            setTimeout(advanceToLevel3Matrix, 500);
        } else {
            renderActiveTargetCake();
        }
    };

    target.addEventListener('touchstart', registerHit, {passive: false});
    target.addEventListener('mousedown', registerHit);
    canvas.appendChild(target);
}

function advanceToLevel3Matrix() {
    switchActiveScreen('level3Screen');
    deployCatHidingGrid();
}

// --- LEVEL 3 ENGINE: SELECTION LOGIC ---
function deployCatHidingGrid() {
    AppState.hiddenCatIndex = Math.floor(Math.random() * 4);
    const crates = document.querySelectorAll('.gift-box-item');
    
    crates.forEach(crate => {
        crate.innerText = '📦';
        crate.classList.remove('open-success');
        crate.style.pointerEvents = 'auto';
        
        crate.onclick = function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (index === AppState.hiddenCatIndex) {
                this.innerText = '🐱';
                this.classList.add('open-success');
                crates.forEach(c => c.style.pointerEvents = 'none');
                setTimeout(launchLevel4Memory, 1200);
            } else {
                this.innerText = '💨';
                this.style.pointerEvents = 'none';
            }
        };
    });
}

// --- LEVEL 4 ENGINE: MEMORY PAIR MATCHING ---
function launchLevel4Memory() {
    switchActiveScreen('level4Screen');
    AppState.flippedCards = [];
    AppState.matchedPairsCount = 0;
    
    // Sort array elements randomly
    AppState.memoryCards.sort(() => 0.5 - Math.random());
    
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';

    AppState.memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-id', index);
        card.innerText = '🐾'; // Card back face default look
        
        card.addEventListener('click', executeCardFlip);
        grid.appendChild(card);
    });
}

function executeCardFlip() {
    if (AppState.flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }

    const cardId = this.getAttribute('data-id');
    this.innerText = AppState.memoryCards[cardId];
    this.classList.add('flipped');
    AppState.flippedCards.push(this);

    if (AppState.flippedCards.length === 2) {
        setTimeout(evaluateMemoryMatch, 700);
    }
}

function evaluateMemoryMatch() {
    const [cardOne, cardTwo] = AppState.flippedCards;
    const idOne = cardOne.getAttribute('data-id');
    const idTwo = cardTwo.getAttribute('data-id');

    if (AppState.memoryCards[idOne] === AppState.memoryCards[idTwo]) {
        cardOne.classList.add('matched');
        cardTwo.classList.add('matched');
        AppState.matchedPairsCount++;

        if (AppState.matchedPairsCount === 2) {
            setTimeout(launchLevel5Slider, 800);
        }
    } else {
        cardOne.classList.remove('flipped');
        cardTwo.classList.remove('flipped');
        cardOne.innerText = '🐾';
        cardTwo.innerText = '🐾';
    }
    AppState.flippedCards = [];
}

// --- LEVEL 5 ENGINE: DRAG SLIDER CONTROLLER ---
function launchLevel5Slider() {
    switchActiveScreen('level5Screen');
    
    const handle = document.getElementById('sliderHandle');
    const track = document.getElementById('sliderTrack');
    let isDragging = false;

    // Reset initial drag positions
    handle.style.left = '8px';

    const getClientX = (e) => {
        return e.touches ? e.touches[0].clientX : e.clientX;
    };

    const dragStart = () => { isDragging = true; };
    
    const dragMove = (e) => {
        if (!isDragging) return;
        
        const trackRect = track.getBoundingClientRect();
        let computedLeft = getClientX(e) - trackRect.left - 25; // 25px offset accounts for center of dragging ball
        
        const maxRightBound = trackRect.width - handle.offsetWidth - 8;
        if (computedLeft < 8) computedLeft = 8;
        if (computedLeft > maxRightBound) computedLeft = maxRightBound;
        
        handle.style.left = `${computedLeft}px`;

        // Check if slider handle reached the goal zone safely
        if (computedLeft >= maxRightBound - 5) {
            isDragging = false;
            handle.style.left = `${maxRightBound}px`;
            // Unbind active functional listeners to secure transition stability
            detachSliderEvents();
            setTimeout(() => {
                switchActiveScreen('level6Screen');
            }, 600);
        }
    };

    const dragEnd = () => { isDragging = false; };

    function detachSliderEvents() {
        handle.removeEventListener('mousedown', dragStart);
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
        handle.removeEventListener('touchstart', dragStart);
        window.removeEventListener('touchmove', dragMove);
        window.removeEventListener('touchend', dragEnd);
    }

    handle.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    handle.addEventListener('touchstart', dragStart, {passive: true});
    window.addEventListener('touchmove', dragMove, {passive: false});
    window.addEventListener('touchend', dragEnd);
}

// --- LEVEL 6 ENGINE: PASSWORD KEYPAD ENTRY ---
function authorizePasscodeChallenge() {
    const codeValue = document.getElementById('passwordInput').value;
    const errorTargetCard = document.getElementById('passwordCard');

    if (codeValue === '0807') {
        switchActiveScreen('letterScreen');
        streamEncryptedLetterLines();
    } else {
        errorTargetCard.classList.add('shake-animation');
        document.getElementById('passwordInput').value = '';
        setTimeout(() => {
            errorTargetCard.classList.remove('shake-animation');
        }, 400);
    }
}

// --- LETTER MODULE: CHRONO LINE TRANSITIONS ---
function streamEncryptedLetterLines() {
    const textInsertionContainer = document.getElementById('letterBody');
    let delayStepAccumulator = 0;

    AppState.letterLines.forEach((textSegment) => {
        const lineNode = document.createElement('p');
        lineNode.className = 'letter-line';
        lineNode.innerText = textSegment;
        lineNode.style.animationDelay = `${delayStepAccumulator}s`;
        textInsertionContainer.appendChild(lineNode);
        
        delayStepAccumulator += 1.7; // Sequential line display pacing
    });

    setTimeout(() => {
        const structuralRevealBox = document.getElementById('letterAction');
        structuralRevealBox.classList.remove('element-hidden');
    }, (AppState.letterLines.length * 1700));
}

// --- REWARDS SCREEN FINALE CONTEXT ---
function triggerGrandFinaleSequence() {
    switchActiveScreen('endingScreen');
    runConfettiEngineLoop();
}

function runConfettiEngineLoop() {
    const canvas = document.getElementById('confettiCanvas');
    const renderingSymbols = ['🎉', '💜', '✨', '🌸', '🎂', '🐈', '🐾'];
    
    setInterval(() => {
        const partyNode = document.createElement('div');
        partyNode.innerText = renderingSymbols[Math.floor(Math.random() * renderingSymbols.length)];
        partyNode.style.position = 'absolute';
        partyNode.style.left = `${Math.random() * 100}%`;
        partyNode.style.top = `-30px`;
        partyNode.style.fontSize = `${Math.random() * 22 + 18}px`;
        partyNode.style.transition = 'transform 3.2s linear, opacity 3.2s linear';
        
        canvas.appendChild(partyNode);

        setTimeout(() => {
            partyNode.style.transform = `translateY(110vh) rotate(${Math.random() * 360}deg)`;
        }, 40);

        setTimeout(() => {
            partyNode.remove();
        }, 3200);
    }, 140);
}