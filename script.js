/* Mission Bauni — Interactive Birthday Site
   Author: Shiv for Sakshi (Bauni) — 08 July 2009
   Mobile-first, GitHub Pages ready
*/

const qs = (s, sc=document) => sc.querySelector(s);
const qsa = (s, sc=document) => Array.from(sc.querySelectorAll(s));

const state = {
  progress: 0,
  quizScore: 0,
  catsToFind: 5,
  cakesToCatch: 10,
  giftsKey: 1, // will shuffle
  riddlesSolved: 0,
  password: "Bauni💜8",
  sound: false
};

window.addEventListener('load', () => {
  // Fake preloader progression
  setTimeout(()=> {
    qs('#loader .loader-bar span').style.width = '100%';
  }, 1200);
  setTimeout(()=> {
    qs('#loader').classList.add('hidden');
    qs('#app').classList.remove('hidden');
    qs('#hud').classList.remove('hidden');
    activateScreen('intro');
    initAmbientFX();
    spawnRandomCats();
    initSound();
  }, 2000);

  setupNav();
  setupQuiz();
  setupCatch();
  setupCatHunt();
  setupGifts();
  setupRiddles();
  setupPassword();
  setupFinale();
});

/* Screen navigation and progress */
function activateScreen(name){
  qsa('.screen').forEach(s=>{
    s.classList.remove('active');
  });
  const screen = qsa('.screen').find(s=>s.dataset.screen===name);
  if(screen){
    screen.classList.add('active');
    const prog = Number(screen.dataset.progress || 5);
    if(!isNaN(prog)) setProgress(prog);
  }
}
function setProgress(p){
  state.progress = Math.max(state.progress, p);
  qs('#progressFill').style.width = state.progress + '%';
}
function setupNav(){
  qsa('[data-next]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const to = btn.dataset.next;
      activateScreen(to);
    });
  });
}

/* Sound */
function initSound(){
  const audio = qs('#bgm');
  const toggle = qs('#soundToggle');
  const setIcon = () => toggle.textContent = state.sound ? '🔊' : '🔇';
  setIcon();
  const resume = () => {
    if(state.sound && audio && audio.src){
      audio.play().catch(()=>{});
    }
  };
  toggle.addEventListener('click', ()=>{
    state.sound = !state.sound;
    setIcon();
    if(state.sound) resume();
    else audio && audio.pause();
  });
  // First user tap enables sparkle + may start audio if provided
  document.addEventListener('pointerdown', ()=> resume(), { once:true });
}

/* Level 1: Quiz */
function setupQuiz(){
  const opts = qsa('.screen[data-screen="quiz"] .opt');
  const status = qs('#quizStatus');
  const next = qs('#quizNext');
  const reset = qs('#quizReset');
  let answered = new Set();

  opts.forEach((o,i)=>{
    o.addEventListener('click', ()=>{
      if(answered.has(o.parentElement)) return;
      const isCorrect = !!o.dataset.correct;
      answered.add(o.parentElement);
      if(isCorrect){
        o.classList.add('correct');
        state.quizScore++;
        popCatSticker(o, '😺');
      }else{
        o.classList.add('wrong');
        // show which was correct
        const c = qsa('.opt', o.parentElement).find(b=>b.dataset.correct);
        c && c.classList.add('correct');
        popCatSticker(o, '🙀');
      }
      status.textContent = `Score: ${state.quizScore} / 6`;
      if(answered.size===6 && state.quizScore>=5){
        next.disabled = false;
      }
    });
  });

  reset.addEventListener('click', ()=>{
    answered.clear();
    state.quizScore = 0;
    status.textContent = 'Score: 0 / 6';
    next.disabled = true;
    opts.forEach(o=> o.classList.remove('correct','wrong'));
  });
}

/* Level 2: Catch the Cakes */
function setupCatch(){
  const canvas = qs('#catchCanvas');
  const ctx = canvas.getContext('2d');
  const retry = qs('#catchRetry');
  const next = qs('#catchNext');
  const out = qs('#cakesCount');

  let W = canvas.width, H = canvas.height;
  let plate = { x: W/2, y: H-40, w: 80, h: 12 };
  let items = [];
  let caught = 0, running = false;
  let pointerX = null;

  function reset(){
    items = [];
    caught = 0;
    out.textContent = '0';
    next.disabled = true;
    spawnItems();
  }
  function spawnItems(){
    for(let i=0;i<8;i++){
      items.push(makeItem());
    }
  }
  function makeItem(){
    const good = Math.random()>0.22;
    return {
      x: Math.random()*(W-24)+12,
      y: -Math.random()*200,
      vy: 1.2 + Math.random()*1.3,
      good,
      r: 16
    };
  }
  function step(){
    if(!running) return;
    ctx.clearRect(0,0,W,H);
    // bg
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'rgba(255,122,217,0.2)');
    grad.addColorStop(1,'rgba(122,74,245,0.2)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

    // plate
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    roundRect(ctx, plate.x-plate.w/2, plate.y, plate.w, plate.h, 6, true);

    // items
    items.forEach(it=>{
      it.y += it.vy;
      if(it.y>H+20){
        Object.assign(it, makeItem(), { y: -20 });
      }
      // draw
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.font = '24px system-ui, emoji';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(it.good?'🎂':'🥦',0,0);
      ctx.restore();

      // collide
      if(it.y>plate.y-10 && Math.abs(it.x - plate.x) < (plate.w/2)){
        if(it.good){
          caught++;
          out.textContent = String(caught);
          popCatSticker(canvas, '🍰');
          Object.assign(it, makeItem(), { y: -20 });
        }else{
          // penalty: reduce count but not below 0
          caught = Math.max(0, caught-1);
          out.textContent = String(caught);
          shake(canvas.parentElement);
          Object.assign(it, makeItem(), { y: -20 });
        }
      }
    });

    if(caught>=state.cakesToCatch){
      next.disabled = false;
    }
    requestAnimationFrame(step);
  }

  function onPointer(e){
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches? e.touches[0].clientX : e.clientX) - rect.left;
    const scaleX = canvas.width / rect.width;
    plate.x = Math.max(plate.w/2, Math.min(canvas.width - plate.w/2, x * scaleX));
  }

  canvas.addEventListener('pointerdown', onPointer);
  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('touchstart', onPointer, {passive:true});
  canvas.addEventListener('touchmove', onPointer, {passive:true});

  retry.addEventListener('click', reset);

  // Start when screen becomes active
  const obs = new MutationObserver(()=> {
    const active = qs('.screen[data-screen="catch"]').classList.contains('active');
    if(active && !running){
      running = true; reset(); step();
    } else if(!active && running){
      running = false;
    }
  });
  obs.observe(qs('#app'), { attributes:true, subtree:true, attributeFilter:['class'] });

  function roundRect(ctx, x,y,w,h,r,fill){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    if(fill) ctx.fill();
  }
}

/* Level 3: Find Cats */
function setupCatHunt(){
  const wrap = qs('#catHunt');
  const foundOut = qs('#catsFound');
  const next = qs('#catsNext');
  const resetBtn = qs('#catsReset');
  let found = 0;

  function build(){
    wrap.innerHTML = '';
    found = 0;
    foundOut.textContent = '0';
    next.disabled = true;
    // 9 tiles, randomly place 5 cats
    const idxs = shuffle(Array.from({length:9},(_,i)=>i)).slice(0,5);
    for(let i=0;i<9;i++){
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Tile');
      b.dataset.cat = idxs.includes(i) ? '1' : '0';
      b.innerHTML = '🌸';
      b.addEventListener('click', ()=>{
        if(b.classList.contains('found')) return;
        if(b.dataset.cat==='1'){
          b.classList.add('found');
          b.textContent = '🐱';
          found++;
          foundOut.textContent = String(found);
          popCatSticker(b,'🐾');
          if(found>=state.catsToFind) next.disabled = false;
        }else{
          shake(wrap);
          b.textContent = randomEmoji(['🎀','💜','✨','🫧']);
        }
      });
      wrap.appendChild(b);
    }
  }

  resetBtn.addEventListener('click', build);
  build();
}

/* Level 4: Gifts */
function setupGifts(){
  const gifts = qsa('.gift');
  const msg = qs('#giftMsg');
  const shuffleBtn = qs('#giftShuffle');
  const next = qs('#giftsNext');

  function rekey(){
    state.giftsKey = Math.floor(Math.random()*3);
    msg.textContent = '';
    next.disabled = true;
  }
  rekey();

  gifts.forEach(g=>{
    g.addEventListener('click', ()=>{
      const k = Number(g.dataset.key);
      if(k===state.giftsKey){
        msg.textContent = 'Correct! You found the special key! 🔑';
        popCatSticker(g,'🎉');
        next.disabled = false;
      }else{
        msg.textContent = 'Hmm, not this one. Try again! 😉';
        shake(g.parentElement);
      }
    });
  });

  shuffleBtn.addEventListener('click', ()=>{
    // Reassign keys visually shuffled
    const order = shuffle([0,1,2]);
    gifts.forEach((g,i)=> g.dataset.key = order[i]);
    rekey();
  });
}

/* Level 5: Riddles */
function setupRiddles(){
  const inputs = qsa('.screen[data-screen="riddles"] .answer input');
  const check = qs('#riddleCheck');
  const next = qs('#riddlesNext');

  check.addEventListener('click', ()=>{
    let solved = 0;
    inputs.forEach(inp=>{
      const want = (inp.dataset.answer||'').trim().toLowerCase();
      const got = (inp.value||'').trim().toLowerCase();
      const box = inp.parentElement;
      if(got===want){
        box.classList.add('solved');
        solved++;
      }else{
        box.classList.remove('solved');
        shake(box);
      }
    });
    if(solved===inputs.length){
      next.disabled = false;
      popCatSticker(check,'💡');
    }
  });
}

/* Level 6: Password */
function setupPassword(){
  const inp = qs('#pwd');
  const msg = qs('#pwdMsg');
  const go = qs('#pwdGo');

  go.addEventListener('click', ()=>{
    const got = (inp.value||'').trim();
    if(got === state.password){
      msg.textContent = 'Access Granted. Welcome to the finale! 🎊';
      popCatSticker(go, '🔓');
      setTimeout(()=> activateScreen('letter'), 500);
    }else{
      msg.textContent = 'Nope! Hint: your nickname + 💜 + 8';
      shake(inp.parentElement);
    }
  });
}

/* Finale: Typewriter + Fireworks + Coupon */
function setupFinale(){
  const tw = qs('#typewriter');
  const celebrate = qs('#celebrate');
  const couponBtn = qs('#couponBtn');
  const dialog = qs('#coupon');
  const fw = qs('#fireworks');

  const letter = [
    "Dear Bauni,",
    "",
    "Happy Birthday to the girl who made a back bench feel like home,",
    "who turned an ordinary class into our favorite sitcom,",
    "who could switch from drama queen to strict teacher in 0.5 seconds —",
    "and somehow be my first and forever favorite female friend.",
    "",
    "Thank you for laughing at my worst jokes (even the 'find me a girlfriend' ones),",
    "for scolding me like a topper teacher when I messed up,",
    "and for being the loudest, brightest, pink‑purple sparkle in my life.",
    "",
    "On your special day, I’m cheering for every dream you have —",
    "and promising a lifetime supply of memes, cake, and friend‑for‑life energy.",
    "",
    "Happy Birthday, Sakshi (my Bauni).",
    "— With all the love and chaos,",
    "Your Shiv 💜"
  ].join("\n");

  // Start typewriter when screen shows
  const obs = new MutationObserver(()=>{
    const active = qs('.screen[data-screen="letter"]').classList.contains('active');
    if(active && !tw.dataset.done){
      typewriter(tw, letter, 18, () => {
        qs('#finalActions').classList.remove('hidden');
      });
      tw.dataset.done = '1';
    }
  });
  obs.observe(qs('#app'), { attributes:true, subtree:true, attributeFilter:['class'] });

  celebrate.addEventListener('click', ()=>{
    missionCompleteFX(fw);
  });

  couponBtn.addEventListener('click', ()=>{
    if(typeof dialog.showModal === 'function'){
      dialog.showModal();
    }else{
      alert('Friendship Coupon:\n- Meme delivery\n- Drama vent session\n- Joke immunity pass\n- Surprise treat 🎂');
    }
  });
}

/* Utilities */
function randomEmoji(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr }

function shake(el){
  el.animate([
    { transform:'translateX(0)' },
    { transform:'translateX(-6px)' },
    { transform:'translateX(6px)' },
    { transform:'translateX(0)' }
  ], { duration:250, easing:'ease-out' });
}

function popCatSticker(target, emoji){
  const layer = qs('#cat-layer');
  const r = target.getBoundingClientRect();
  const s = document.createElement('div');
  s.className = 'pop';
  s.textContent = emoji;
  s.style.left = (r.left + r.width/2) + 'px';
  s.style.top = (r.top + r.height/2) + 'px';
  layer.appendChild(s);
  s.animate([
    { transform:'translate(-50%,-50%) scale(0.6)', opacity:0 },
    { transform:'translate(-50%,-70%) scale(1)', opacity:1 },
    { transform:'translate(-50%,-120%) scale(0.8)', opacity:0 }
  ], { duration:900, easing:'cubic-bezier(.2,.8,.2,1)' }).onfinish=()=> s.remove();
}

function typewriter(el, text, cps=20, done){
  el.textContent = '';
  let i=0;
  const timer = setInterval(()=>{
    el.textContent += text[i] || '';
    i++;
    if(i>=text.length){
      clearInterval(timer);
      done && done();
    }
  }, Math.max(5, 1000/Math.max(8,cps)));
}

/* Ambient FX: soft rain, petals, sparkles that react to taps */
function initAmbientFX(){
  petalsFX(); sparklesFX(); rainFX();

  // Tap sparkles
  document.addEventListener('pointerdown', (e)=>{
    burstSparklesAt(e.clientX, e.clientY);
  });
}

/* Rain */
function rainFX(){
  const c = qs('#bg-rain'), ctx = c.getContext('2d');
  resizeCanvas(c);
  let drops = Array.from({length:60}, ()=> ({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    v: 0.8 + Math.random()*1.2,
    l: 8 + Math.random()*12
  }));
  function step(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    drops.forEach(d=>{
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.l);
      d.y += d.v;
      if(d.y > c.height) { d.y = -d.l; d.x = Math.random()*c.width; }
    });
    ctx.stroke();
    requestAnimationFrame(step);
  }
  step();
  window.addEventListener('resize', ()=> resizeCanvas(c), { passive:true });
}

/* Petals */
function petalsFX(){
  const c = qs('#bg-petals'), ctx = c.getContext('2d');
  resizeCanvas(c);
  const N = 20;
  const petals = Array.from({length:N}, ()=> ({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    r: 6+Math.random()*10,
    vx: -0.3 + Math.random()*0.6,
    vy: 0.2 + Math.random()*0.6,
    rot: Math.random()*Math.PI*2,
    vr: -0.01 + Math.random()*0.02
  }));
  function step(){
    ctx.clearRect(0,0,c.width,c.height);
    petals.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if(p.y>c.height+20) { p.y = -20; p.x = Math.random()*c.width; }
      if(p.x<-20) p.x = c.width+20; if(p.x>c.width+20) p.x = -20;
      drawPetal(ctx,p);
    });
    requestAnimationFrame(step);
  }
  step();
  window.addEventListener('resize', ()=> resizeCanvas(c), { passive:true });
}
function drawPetal(ctx,p){
  ctx.save();
  ctx.translate(p.x,p.y); ctx.rotate(p.rot);
  const g = ctx.createLinearGradient(-p.r,0,p.r,0);
  g.addColorStop(0,'rgba(255,122,217,0.7)');
  g.addColorStop(1,'rgba(165,93,231,0.5)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0,-p.r);
  ctx.quadraticCurveTo(p.r, -p.r*0.2, 0, p.r);
  ctx.quadraticCurveTo(-p.r, -p.r*0.2, 0, -p.r);
  ctx.fill();
  ctx.restore();
}

/* Sparkles */
let sparkCtx, sparkCanvas, sparks=[];
function sparklesFX(){
  sparkCanvas = qs('#bg-sparkles'); sparkCtx = sparkCanvas.getContext('2d');
  resizeCanvas(sparkCanvas);
  for(let i=0;i<40;i++){
    sparks.push({
      x: Math.random()*sparkCanvas.width,
      y: Math.random()*sparkCanvas.height,
      r: Math.random()*1.5+0.5,
      a: Math.random(),
      da: (Math.random()*0.02)+0.005
    });
  }
  function step(){
    sparkCtx.clearRect(0,0,sparkCanvas.width,sparkCanvas.height);
    sparks.forEach(s=>{
      s.a += s.da; if(s.a>1 || s.a<0){ s.da*=-1 }
      sparkCtx.beginPath();
      sparkCtx.fillStyle = `rgba(255,255,255,${0.15 + 0.15*Math.sin(s.a*3.14)})`;
      sparkCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
      sparkCtx.fill();
    });
    requestAnimationFrame(step);
  }
  step();
  window.addEventListener('resize', ()=> resizeCanvas(sparkCanvas), { passive:true });
}
function burstSparklesAt(x,y){
  const rect = sparkCanvas.getBoundingClientRect();
  const sx = (x - rect.left) * (sparkCanvas.width/rect.width);
  const sy = (y - rect.top) * (sparkCanvas.height/rect.height);
  for(let i=0;i<14;i++){
    sparks.push({ x:sx, y:sy, r:Math.random()*2+0.8, a:0, da:0.03+Math.random()*0.02 });
  }
}

/* Fireworks */
function missionCompleteFX(canvas){
  resizeCanvas(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  let ticks = 0;

  function boom(){
    const cx = Math.random()*canvas.width*0.8+canvas.width*0.1;
    const cy = Math.random()*canvas.height*0.4+canvas.height*0.1;
    const hue = Math.floor(Math.random()*360);
    for(let i=0;i<90;i++){
      const angle = (i/90)*Math.PI*2;
      const speed = Math.random()*3+1.5;
      particles.push({
        x:cx, y:cy, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
        life: 60+Math.random()*40,
        hue
      });
    }
  }

  const burstTimer = setInterval(boom, 600);
  const confettiTimer = setInterval(()=> confettiPop(), 500);

  function confettiPop(){
    popCatSticker(canvas, randomEmoji(['🎉','🎊','💜','🌸','🐱','✨','🎂']));
  }

  function step(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life--;
      ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${Math.max(0,p.life/100)})`;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
    particles = particles.filter(p=> p.life>0);
    ticks++;
    if(ticks<600){
      requestAnimationFrame(step);
    }else{
      clearInterval(burstTimer);
      clearInterval(confettiTimer);
    }
  }
  step();
}

/* Random cat stickers floating across screen occasionally */
function spawnRandomCats(){
  setInterval(()=>{
    const layer = qs('#cat-layer');
    const s = document.createElement('div');
    s.className='float-cat';
    s.textContent = randomEmoji(['🐱','🐈','😺','😸','😻','🐾','💜']);
    const x = Math.random()*window.innerWidth;
    s.style.left = x + 'px';
    layer.appendChild(s);
    s.animate([
      { transform:`translateY(0) scale(0.9)`, opacity:0 },
      { transform:`translateY(-40px) scale(1)`, opacity:1, offset:0.2 },
      { transform:`translateY(-120px) scale(1)`, opacity:0 }
    ], { duration: 4000, easing:'ease-in-out' }).onfinish=()=> s.remove();
  }, 3500);
}

/* Helpers */
function resizeCanvas(c){
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.floor(c.clientWidth * dpr || window.innerWidth * dpr);
  c.height = Math.floor(c.clientHeight * dpr || window.innerHeight * dpr);
  const rect = c.getBoundingClientRect();
  if(c.width===0 || c.height===0){
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
  }
}

/* Cat layer and pop styles injected */
const style = document.createElement('style');
style.textContent = `
#cat-layer{position:fixed;inset:0;pointer-events:none;z-index:25}
#cat-layer .pop{
  position:fixed; transform:translate(-50%,-50%); font-size:24px; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.35))
}
#cat-layer .float-cat{
  position:fixed; bottom:-10px; font-size:20px; filter:drop-shadow(0 3px 8px rgba(0,0,0,0.35))
}
`;
document.head.appendChild(style);
