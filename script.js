// ===== NAV =====
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');
const navMobile = document.getElementById('navMobile');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
menuBtn.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));

// ===== COUNTDOWN =====
const WEDDING = new Date('2026-12-18T07:30:00+05:30').getTime();
const cdEls = document.querySelectorAll('#countdown .cd-num');
function tick(){
  const d = Math.max(0, WEDDING - Date.now());
  const v = {
    days: Math.floor(d/86400000),
    hours: Math.floor((d/3600000)%24),
    mins: Math.floor((d/60000)%60),
    secs: Math.floor((d/1000)%60),
  };
  cdEls.forEach(el => el.textContent = String(v[el.dataset.k]).padStart(2,'0'));
}
tick(); setInterval(tick, 1000);

// ===== TIMELINE REVEAL =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });
document.querySelectorAll('.t-item').forEach(el => io.observe(el));

// ===== GALLERY LIGHTBOX =====
const imgs = [...document.querySelectorAll('#gallery img')];
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let idx = 0;
function open(i){ idx=i; lbImg.src=imgs[i].src; lbImg.alt=imgs[i].alt; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
function close(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
function next(){ open((idx+1)%imgs.length); }
function prev(){ open((idx-1+imgs.length)%imgs.length); }
imgs.forEach((im,i)=>im.addEventListener('click',()=>open(i)));
document.getElementById('lbClose').addEventListener('click', close);
document.getElementById('lbNext').addEventListener('click', next);
document.getElementById('lbPrev').addEventListener('click', prev);
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// ===== TOAST =====
function toast(msg, err){
  const t = document.createElement('div');
  t.className = 'toast' + (err?' err':'');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, 3000);
}

// ===== RSVP =====
const form = document.getElementById('rsvpForm');
const thanks = document.getElementById('rsvpThanks');
form.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(form);
  const data = {
    guest_name: (fd.get('guest_name')||'').toString().trim(),
    phone: (fd.get('phone')||'').toString().trim(),
    attending: fd.get('attending'),
    num_guests: Number(fd.get('num_guests')||0),
    notes: (fd.get('notes')||'').toString().trim(),
    created_at: new Date().toISOString(),
  };
  if (!data.guest_name) return toast('Please enter your name', true);
  if (data.phone.length < 5) return toast('Please enter a valid phone', true);
  if (!data.attending) return toast('Please select if you can attend', true);

  const list = JSON.parse(localStorage.getItem('rsvps')||'[]');
  list.push(data);
  localStorage.setItem('rsvps', JSON.stringify(list));

  form.reset();
  form.hidden = true;
  thanks.hidden = false;
  toast('Thank you! Your RSVP has been received.');
});
document.getElementById('rsvpAgain').addEventListener('click', () => {
  thanks.hidden = true; form.hidden = false;
});

// ===== MUSIC =====
const audio = document.getElementById('bgMusic');
const mBtn = document.getElementById('musicBtn');
audio.volume = 0.35;
mBtn.addEventListener('click', async () => {
  if (audio.paused){
    try { await audio.play(); mBtn.classList.add('playing'); mBtn.textContent='🔊'; }
    catch { toast('Tap again to enable music', true); }
  } else {
    audio.pause(); mBtn.classList.remove('playing'); mBtn.textContent='🎵';
  }
});
