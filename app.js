/* =====================================================
   CASA-LUMI · APP PRINCIPAL
   Compatible con index.html de Casa-Lumi (main)
   Funciones locales: navegación, habitaciones, vestuario,
   cuidados de Lulú, calendario, notas, música y respaldo.
   ===================================================== */
'use strict';

(() => {
  const $ = (id) => document.getElementById(id);
  const STORE = 'casaLumi.v1';
  const today = new Date();
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  const defaults = {
    theme: 'dark', season: 'spring', outfit: 'everyday',
    lulu: { water: 72, light: 72, love: 80, history: [] },
    events: [], notes: [], spotifyUrl: '', youtubeUrl: ''
  };
  let state = { ...defaults, ...safeParse(localStorage.getItem(STORE), {}) };
  state.lulu = { ...defaults.lulu, ...(state.lulu || {}) };
  state.events = Array.isArray(state.events) ? state.events : [];
  state.notes = Array.isArray(state.notes) ? state.notes : [];
  let shownMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = isoDate(today);

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); }
    catch (error) { console.warn('No se pudo guardar en este dispositivo:', error); }
  }
  function text(id, value) { const el = $(id); if (el) el.textContent = value; }
  function go(page) {
    if (!$(`page-${page}`)) return;
    document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
    document.querySelectorAll('.tab[data-page]').forEach(el => el.classList.toggle('active', el.dataset.page === page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function initNavigation() {
    document.querySelectorAll('[data-page]').forEach(el => el.addEventListener('click', () => go(el.dataset.page)));
    document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => go(el.dataset.go)));
    document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => characterAction(el.dataset.action)));
  }
  function updateClock() {
    const now = new Date();
    text('clock', now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));
    text('dateLabel', now.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }));
    text('year', String(now.getFullYear()));
  }
  function setTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    document.body.classList.toggle('light', state.theme === 'light');
    const btn = $('themeBtn'); if (btn) btn.textContent = state.theme === 'light' ? '☾' : '☼';
    save();
  }

  const rooms = [
    ['bedroom','Dormitorio','Un rincón tranquilo para descansar.','☾','✦','✧'],
    ['living','Sala de estar','Un espacio cómodo para conversar y compartir.','⌂','♡','✦'],
    ['kitchen','Cocina','Aquí imaginamos recetas y preparamos algo rico.','♨','☕','✧'],
    ['garden','Jardín','Un pequeño lugar verde para respirar y cuidar plantas.','❀','🌱','✦'],
    ['library','Biblioteca','Un rincón para leer, aprender y descubrir historias.','▤','📖','✧'],
    ['musicroom','Sala de música','Un espacio para llenar la casa de sonidos.','♫','♪','✦'],
    ['studio','Escritorio','El lugar donde organizamos ideas y proyectos.','✎','✧','☾']
  ];
  function renderRooms() {
    const list = $('roomList'); if (!list) return;
    list.innerHTML = '';
    rooms.forEach((room, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = `room-choice${i===0?' active':''}`;
      b.textContent = `${room[3]}  ${room[1]}`;
      b.addEventListener('click', () => {
        list.querySelectorAll('.room-choice').forEach(x => x.classList.remove('active')); b.classList.add('active');
        const detail = $('roomDetail'); if (!detail) return;
        detail.innerHTML = `<div class="room-art ${room[0]}"><span>${room[3]}</span><span>${room[4]}</span><span>${room[5]}</span></div><h2></h2><p></p>`;
        detail.querySelector('h2').textContent = room[1]; detail.querySelector('p').textContent = room[2];
        text('actionStatus', `Lumi está en ${room[1].toLowerCase()}.`);
      });
      list.appendChild(b);
    });
  }
  function characterAction(action) {
    const lumi = $('lumi'); if (lumi) { lumi.classList.remove('walk','sit','read','rest'); if (['walk','sit','read','rest'].includes(action)) lumi.classList.add(action); }
    const messages = { walk:'Lumi está dando un paseo por casa.', sit:'Lumi se ha sentado un momento.', read:'Lumi está leyendo tranquilamente.', rest:'Lumi está descansando.' };
    text('actionStatus', messages[action] || 'Lumi está en casa.');
  }

  const outfits = {
    everyday: [['classic','Conjunto habitual','Negro y lavanda, con detalles plateados.']],
    summer: [['summer','Verano suave','Un conjunto ligero en tonos lavanda.']],
    autumn: [['autumn','Otoño acogedor','Tonos ciruela y malva.']],
    winter: [['winter','Invierno','Un conjunto abrigado en tonos azul noche.']],
    spring: [['spring','Primavera','Lavanda y detalles florales.']],
    party: [['party','Celebración','Un conjunto especial con brillo plateado.']],
    sleep: [['sleep','Pijama','Ropa cómoda para descansar.']]
  };
  function applyOutfit(key) {
    state.outfit = key;
    ['lumi','lumiPreview'].forEach(id => { const el = $(id); if (el) { [...el.classList].filter(c => c.startsWith('look-')).forEach(c => el.classList.remove(c)); el.classList.add(`look-${key}`); } });
    const item = Object.values(outfits).flat().find(x => x[0] === key) || outfits.everyday[0];
    text('outfitName', item[1]); text('outfitDescription', item[2]); save();
    renderOutfits();
  }
  function renderOutfits() {
    const season = $('season'); const list = $('outfitList'); if (!season || !list) return;
    const options = outfits[season.value] || outfits.everyday;
    list.innerHTML = '';
    options.forEach(item => {
      const b = document.createElement('button'); b.type = 'button'; b.className = `outfit-option${state.outfit===item[0]?' active':''}`;
      b.textContent = item[1]; b.addEventListener('click', () => applyOutfit(item[0])); list.appendChild(b);
    });
  }

  function addCare(label, key, amount) {
    state.lulu[key] = Math.min(100, Math.max(0, Number(state.lulu[key] || 0) + amount));
    state.lulu.history.unshift(`${new Date().toLocaleString('es-CL')} · ${label}`);
    state.lulu.history = state.lulu.history.slice(0, 8); save(); renderLulu();
  }
  function renderLulu() {
    const l = state.lulu;
    [['water','Agua'],['light','Luz'],['love','Ánimo']].forEach(([key,label]) => {
      const bar = $(`${key}Bar`); if (bar) bar.style.width = `${Math.max(0,Math.min(100,Number(l[key])||0))}%`;
      text(`${key}Text`, `${Math.round(l[key])}%`);
    });
    const average = (Number(l.water)+Number(l.light)+Number(l.love))/3;
    text('luluMood', average > 65 ? 'Lulú está contenta' : average > 35 ? 'Lulú agradece tus cuidados' : 'Lulú necesita un poquito de atención');
    text('luluMessage', average > 65 ? '¡Qué bonito que hayas venido a visitarme! :3' : 'Un poquito de agua, luz o compañía puede animarla.');
    const history = $('careHistory'); if (history) { history.innerHTML = ''; (l.history || []).forEach(entry => { const li=document.createElement('li'); li.textContent=entry; history.appendChild(li); }); if (!history.children.length) { const li=document.createElement('li'); li.textContent='Todavía no hay cuidados registrados.'; history.appendChild(li); } }
  }

  function renderCalendar() {
    const grid = $('calendarGrid'); if (!grid) return;
    grid.innerHTML = '';
    ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(day => { const el=document.createElement('div'); el.className='day-name'; el.textContent=day; grid.appendChild(el); });
    const year=shownMonth.getFullYear(), month=shownMonth.getMonth();
    text('monthTitle', shownMonth.toLocaleDateString('es-CL',{month:'long',year:'numeric'}));
    const first = new Date(year,month,1); const offset=(first.getDay()+6)%7; const count=new Date(year,month+1,0).getDate();
    for(let i=0;i<offset;i++){ const blank=document.createElement('div'); grid.appendChild(blank); }
    for(let day=1;day<=count;day++){
      const date=isoDate(new Date(year,month,day)); const b=document.createElement('button'); b.type='button';
      const has=state.events.some(e=>e.date===date);
      b.className=`day-cell${date===isoDate(today)?' today':''}${date===selectedDate?' selected':''}${has?' has-event':''}`; b.textContent=String(day);
      b.setAttribute('aria-label',`${day}${has?', tiene eventos':''}`);
      b.addEventListener('click',()=>{selectedDate=date;renderCalendar();}); grid.appendChild(b);
    }
    renderEvents();
  }
  function renderEvents() {
    text('selectedDateTitle', `Eventos · ${new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric'})}`);
    const list=$('eventList'); if(!list)return; list.innerHTML='';
    const events=state.events.filter(e=>e.date===selectedDate).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
    if(!events.length){const p=document.createElement('p');p.className='muted';p.textContent='No hay eventos para este día.';list.appendChild(p);return;}
    events.forEach(event=>{const row=document.createElement('div');row.className='event-item';const info=document.createElement('span');info.textContent=`${event.time?event.time+' · ':''}${event.title} · ${event.category||'Personal'}${event.notes?' — '+event.notes:''}`;const del=document.createElement('button');del.type='button';del.textContent='Eliminar';del.addEventListener('click',()=>{state.events=state.events.filter(e=>e.id!==event.id);save();renderCalendar();});row.append(info,del);list.appendChild(row);});
  }
  function addEvent(e) {
    e.preventDefault(); const title=$('eventTitle')?.value.trim(); const date=$('eventDate')?.value; if(!title||!date)return;
    state.events.push({id:`e-${Date.now()}-${Math.random().toString(16).slice(2)}`,title,date,time:$('eventTime')?.value||'',category:$('eventCategory')?.value||'Personal',notes:$('eventNotes')?.value.trim()||''});
    selectedDate=date;shownMonth=new Date(`${date}T12:00:00`); save(); e.target.reset(); $('eventDate').value=selectedDate; renderCalendar();
  }

  function renderNotes() {
    const list=$('notesList'); if(!list)return; list.innerHTML='';
    if(!state.notes.length){const li=document.createElement('li');li.textContent='Todavía no hay notas guardadas.';list.appendChild(li);return;}
    state.notes.forEach(note=>{const li=document.createElement('li');li.className='note-item';const span=document.createElement('span');span.textContent=note.text;const del=document.createElement('button');del.type='button';del.textContent='Eliminar';del.setAttribute('aria-label','Eliminar nota');del.addEventListener('click',()=>{state.notes=state.notes.filter(n=>n.id!==note.id);save();renderNotes();});li.append(span,del);list.appendChild(li);});
  }
  function addNote(e) { e.preventDefault();const input=$('noteText');const value=input?.value.trim();if(!value)return;state.notes.unshift({id:`n-${Date.now()}`,text:value});save();input.value='';renderNotes(); }

  function validHttpUrl(value) { try { const u=new URL(value); return u.protocol==='https:'||u.protocol==='http:'; } catch { return false; } }
  function renderSpotify() { const box=$('spotifySaved'); if(!box)return;box.innerHTML='';if(state.spotifyUrl&&validHttpUrl(state.spotifyUrl)){const a=document.createElement('a');a.href=state.spotifyUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Abrir mi enlace guardado';box.appendChild(a);} }
  function youtubeId(value) {
    try { const u=new URL(value); if(u.hostname==='youtu.be')return u.pathname.slice(1); if(u.hostname.endsWith('youtube.com'))return u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop(); } catch {} return '';
  }
  function loadYoutube() {
    const value=$('youtubeUrl')?.value.trim()||'';const id=youtubeId(value);const box=$('youtubePlayer');if(!box)return;box.innerHTML='';
    if(!id||!/^[a-zA-Z0-9_-]{6,20}$/.test(id)){const p=document.createElement('p');p.className='muted';p.textContent='Introduce un enlace válido de YouTube.';box.appendChild(p);return;}
    const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;frame.title='Reproductor de YouTube';frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;box.appendChild(frame);state.youtubeUrl=value;save();
  }
  function exportBackup() {
    const blob=new Blob([JSON.stringify({app:'Casa-Lumi',version:1,exportedAt:new Date().toISOString(),data:state},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`casa-lumi-respaldo-${isoDate(today)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function importBackup(file) {
    if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(String(reader.result));const incoming=parsed.data||parsed;if(!incoming||typeof incoming!=='object')throw new Error('Formato incorrecto');state={...defaults,...incoming,lulu:{...defaults.lulu,...(incoming.lulu||{})},events:Array.isArray(incoming.events)?incoming.events:[],notes:Array.isArray(incoming.notes)?incoming.notes:[]};save();location.reload();}catch{alert('No se pudo importar. Comprueba que sea un respaldo válido de Casa-Lumi.');}};reader.readAsText(file);
  }

  function bind() {
    $('themeBtn')?.addEventListener('click',()=>setTheme(state.theme==='light'?'dark':'light'));
    $('season')?.addEventListener('change',()=>{const map={everyday:'everyday',summer:'summer',autumn:'autumn',winter:'winter',spring:'spring',party:'party',sleep:'sleep'};const key=map[$('season').value]||'everyday';renderOutfits();applyOutfit(key);});
    $('waterBtn')?.addEventListener('click',()=>addCare('Regaste a Lulú','water',15));
    $('lightBtn')?.addEventListener('click',()=>addCare('Le diste luz a Lulú','light',15));
    $('talkPlantBtn')?.addEventListener('click',()=>addCare('Acompañaste a Lulú','love',15));
    $('prevMonth')?.addEventListener('click',()=>{shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()-1,1);renderCalendar();});
    $('nextMonth')?.addEventListener('click',()=>{shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()+1,1);renderCalendar();});
    $('todayBtn')?.addEventListener('click',()=>{shownMonth=new Date(today.getFullYear(),today.getMonth(),1);selectedDate=isoDate(today);renderCalendar();});
    $('eventForm')?.addEventListener('submit',addEvent);$('noteForm')?.addEventListener('submit',addNote);
    $('exportBtn')?.addEventListener('click',exportBackup);$('importFile')?.addEventListener('change',e=>importBackup(e.target.files?.[0]));
    $('spotifySave')?.addEventListener('click',()=>{const value=$('spotifyUrl')?.value.trim()||'';if(!validHttpUrl(value)||!new URL(value).hostname.endsWith('spotify.com')){alert('Introduce un enlace válido de Spotify.');return;}state.spotifyUrl=value;save();renderSpotify();});
    $('youtubeLoad')?.addEventListener('click',loadYoutube);
  }
  function start() {
    initNavigation();bind();updateClock();setInterval(updateClock,30000);
    renderRooms();renderOutfits();renderLulu();renderCalendar();renderNotes();renderSpotify();
    const season=$('season');if(season){const selected=state.outfit==='classic'?'everyday':state.outfit;season.value=outfits[selected]?selected:'everyday';renderOutfits();}
    applyOutfit(state.outfit==='classic'?'everyday':state.outfit);
    if($('eventDate'))$('eventDate').value=selectedDate;
    if(state.youtubeUrl&&$('youtubeUrl'))$('youtubeUrl').value=state.youtubeUrl;
    if(state.spotifyUrl&&$('spotifyUrl'))$('spotifyUrl').value=state.spotifyUrl;
    setTheme(state.theme);
    console.info('Casa-Lumi lista ✨');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
