// public/js/chat.js
document.addEventListener('DOMContentLoaded', ()=>{
  const openBtn = document.getElementById('openChat');
  const modal = document.getElementById('chatModal');
  const closeBtn = document.getElementById('closeChat');
  const sendBtn = document.getElementById('sendChat');
  const input = document.getElementById('chatInput');
  const log = document.getElementById('chatLog');

  if (!openBtn) return;
  openBtn.addEventListener('click', ()=> modal.style.display = 'block');
  if (closeBtn) closeBtn.addEventListener('click', ()=> modal.style.display = 'none');

  function append(who, text){
    const d = document.createElement('div');
    d.style.margin = '8px';
    d.style.padding = '10px';
    d.style.borderRadius = '8px';
    d.style.maxWidth = '86%';
    d.style.fontSize = '13px';
    if (who === 'user'){ d.style.background = 'linear-gradient(90deg,#e6f0ff,#dbeafe)'; d.style.marginLeft = 'auto'; }
    else { d.style.background = 'transparent'; d.style.border = '1px solid rgba(0,0,0,0.06)'; }
    d.textContent = text;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }

  if (sendBtn){
    sendBtn.addEventListener('click', async ()=>{
      const q = input.value.trim(); if (!q) return;
      append('user', q); input.value = '';
      append('bot', '...'); // placeholder
      const res = await apiFetch('/api/chat','POST',{ query:q });
      log.removeChild(log.lastChild);
      append('bot', res.reply || 'Sorry I could not respond.');
    });
  }
});
