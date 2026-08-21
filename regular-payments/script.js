const roles = [
  ["Отдел по корп. взаимодействию","Ведёт Календари оплат, своевременно согласовывает дополнительные соглашения и счета, вносит счета в 1С на оплату."],
  ["Менеджер","Своевременно инициирует согласование счёта, дополнительного соглашения и пролонгации договора."],
  ["Бухгалтерия","Согласовывает и оплачивает счета, согласовывает дополнительные соглашения в установленные сроки."],
];

const slideTitles = ["Титул","Цели и ответственные","Обязанности документооборота","Проведение оплаты","Руководители ЦФО и контакты"];

document.getElementById('rolesGrid').innerHTML = roles.map((r,i)=>`
  <div class="role-card" data-i="${i}" onclick="this.classList.toggle('flipped')">
    <div class="role-inner">
      <div class="role-face front">
        <div class="icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg></div>
        <div class="rf-title">${r[0]}</div>
        <div class="rf-hint">Нажмите для описания →</div>
      </div>
      <div class="role-face back"><div style="font-size:12.5px; font-weight:800; letter-spacing:.02em; opacity:.75; margin-bottom:6px; text-transform:uppercase;">${r[0]}</div><p>${r[1]}</p></div>
    </div>
  </div>`).join('');

document.querySelectorAll('.tabbar').forEach(bar=>{
  bar.querySelectorAll('.tabbtn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      bar.querySelectorAll('.tabbtn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const panelWrap = bar.parentElement;
      panelWrap.querySelectorAll('.tabpanel').forEach(p=>p.classList.remove('active'));
      panelWrap.querySelector(`.tabpanel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });
});

const slides = Array.from(document.querySelectorAll('.slide'));
const total = slides.length;
let current = 0;

const dotsWrap = document.getElementById('dots');
slides.forEach((s,i)=>{
  const d = document.createElement('div');
  d.className = 'dotb' + (i===0?' on':'');
  d.title = slideTitles[i];
  d.addEventListener('click', ()=>goTo(i));
  dotsWrap.appendChild(d);
});

function render(){
  slides.forEach((s,i)=> s.classList.toggle('active', i===current));
  document.querySelectorAll('#dots .dotb').forEach((d,i)=> d.classList.toggle('on', i===current));
  document.getElementById('counter').textContent = String(current+1).padStart(2,'0') + ' / ' + total;
  document.getElementById('slideTag').textContent = slideTitles[current];
  document.getElementById('progress').style.width = ((current+1)/total*100) + '%';
  document.getElementById('prevBtn').disabled = current===0;
  document.getElementById('nextBtn').disabled = current===total-1;
}

function goTo(i){
  if(i<0 || i>=total || i===current) return;
  current = i;
  render();
}
function next(){ if(current<total-1) goTo(current+1); }
function prev(){ if(current>0) goTo(current-1); }

document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);

window.addEventListener('keydown', (e)=>{
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){ e.preventDefault(); next(); }
  if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); prev(); }
  if(e.key==='Home'){ goTo(0); }
  if(e.key==='End'){ goTo(total-1); }
});

let touchStartX = null;
document.getElementById('deck').addEventListener('touchstart', e=>{ touchStartX = e.touches[0].clientX; });
document.getElementById('deck').addEventListener('touchend', e=>{
  if(touchStartX===null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if(dx > 60) prev();
  if(dx < -60) next();
  touchStartX = null;
});

render();
