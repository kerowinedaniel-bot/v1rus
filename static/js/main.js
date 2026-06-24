// Background particles with lines, parallax and neon spheres
(() => {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  const DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = W * DPR; canvas.height = H * DPR; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.scale(DPR, DPR);

  const PARTICLE_COUNT = 260;
  const particles = [];
  let mouse = {x: W/2, y: H/2};

  window.addEventListener('resize', ()=>{
    W = canvas.width = innerWidth; H = canvas.height = innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.scale(DPR, DPR);
  });

  window.addEventListener('mousemove', (e)=>{ mouse.x = e.clientX; mouse.y = e.clientY; });

  function rand(min,max){return Math.random()*(max-min)+min}
  for(let i=0;i<PARTICLE_COUNT;i++){ particles.push({x:rand(0,W), y:rand(0,H), vx:rand(-0.2,0.2), vy:rand(-0.2,0.2), r:rand(0.6,1.9), depth:Math.random()})}

  function drawSphere(x,y,r,colors,alpha=0.14){
    const g = ctx.createRadialGradient(x,y,r*0.1,x,y,r);
    for(let i=0;i<colors.length;i++){ g.addColorStop(i/(colors.length-1), colors[i]); }
    ctx.globalAlpha = alpha; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
  }

  function loop(){
    ctx.clearRect(0,0,W,H);

    // parallax offsets
    const px = (mouse.x - W/2) * 0.02; const py = (mouse.y - H/2) * 0.02;

    // neon spheres (two large)
    drawSphere(W*0.18 + px*0.6, H*0.25 + py*0.6, Math.max(W,H)*0.45, ['rgba(42,209,255,0.9)','rgba(42,209,255,0.02)'],0.14);
    drawSphere(W*0.85 + px*0.2, H*0.9 + py*0.2, Math.max(W,H)*0.35, ['rgba(255,99,217,0.95)','rgba(130,54,255,0.02)'],0.12);

    // draw particles
    for(let p of particles){
      p.x += p.vx * (1 + p.depth*1.5);
      p.y += p.vy * (1 + p.depth*1.5);
      // wrap
      if(p.x < -20) p.x = W+20; if(p.x > W+20) p.x = -20;
      if(p.y < -20) p.y = H+20; if(p.y > H+20) p.y = -20;
      // draw
      ctx.fillStyle = `rgba(200,220,255,${0.6 * (0.4 + p.depth)})`;
      ctx.beginPath(); ctx.arc(p.x + (px * p.depth * 0.6), p.y + (py * p.depth * 0.6), p.r * (1 + p.depth), 0, Math.PI*2); ctx.fill();
    }

    // connect lines
    const maxDist = 140;
    ctx.lineWidth = 0.6; ctx.strokeStyle = 'rgba(130,170,255,0.08)';
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i]; const b = particles[j];
        const dx = (a.x - b.x); const dy = (a.y - b.y);
        const d = Math.hypot(dx,dy);
        if(d < maxDist){ ctx.globalAlpha = (1 - d/maxDist) * 0.6; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();

// Reveal on scroll
(function(){
  const obs = new IntersectionObserver((entries)=>{
    for(const e of entries){ if(e.isIntersecting) e.target.classList.add('show'); }
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();

// Terminal typing effect
(function(){
  const lines = [
    'Initializing V1RUS HUB...',
    'Loading modules...',
    'Loading Lua scripts...',
    'Loading Python projects...',
    'Loading Telegram bots...',
    'Connection established.',
    'Welcome Developer.'
  ];
  const el = document.getElementById('terminal-output');
  let i=0; let lineIdx=0;
  function writeNext(){
    if(lineIdx>=lines.length) return;
    const line = lines[lineIdx]; let k=0; el.textContent += '\n';
    const t = setInterval(()=>{
      el.textContent = el.textContent.slice(0, - (line.length - k)) + line.slice(0,k) + '\u2588'; k++;
      el.scrollTop = el.scrollHeight;
      if(k>line.length){ clearInterval(t); el.textContent = el.textContent.replace(/\u2588$/, ''); lineIdx++; setTimeout(writeNext,400); }
    }, 28);
  }
  setTimeout(writeNext,800);
})();

// Smooth scroll for anchor links
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{ e.preventDefault(); const t=document.querySelector(a.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); });
  });
})();
