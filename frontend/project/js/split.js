// splitwise.js - populate friends and handle simple split
document.addEventListener('DOMContentLoaded', async () => {
  const payerSelect = document.getElementById('payerSelect');
  const friendsContainer = document.getElementById('friendsContainer');
  const splitForm = document.getElementById('splitForm');
  const splitResult = document.getElementById('splitResult');

  const r = await apiFetch('/api/friends');
  const friends = r.success ? r.data : [];

  friends.forEach(fr => {
    const opt = document.createElement('option'); opt.value = fr.id; opt.textContent = fr.name;
    payerSelect.appendChild(opt);

    const chk = document.createElement('label');
    chk.innerHTML = `<input type="checkbox" value="${fr.id}" class="friendChk"> ${fr.name}`;
    friendsContainer.appendChild(chk);
  });

  splitForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const form = e.target;
    const total = Number(form.total.value);
    const payerId = Number(form.payerSelect.value);
    const checks = Array.from(document.querySelectorAll('.friendChk:checked')).map(n=>Number(n.value));
    const splits = checks.map(id => ({ friendId: id }));
    const res = await apiFetch('/api/split','POST',{ total, payerId, splits });
    splitResult.innerHTML = `<div class="alert alert-success small">${res.message}. Each share (incl. payer): ₹${(total/(checks.length+1)).toFixed(2)}</div>`;
  });
});
