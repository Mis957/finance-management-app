document.addEventListener('DOMContentLoaded', ()=>{
  const form=document.getElementById('categoryExpenseForm');
  const foodList=document.getElementById('foodList');
  const transportList=document.getElementById('transportList');

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(form);
    const category=fd.get('category').toLowerCase();
    const amount=fd.get('amount');
    const desc=fd.get('description')||'';

    const li=document.createElement('li');
    li.className="list-group-item d-flex justify-content-between align-items-center small fade-in";
    li.textContent=`${desc} - ₹${amount}`;

    if(category.includes('food')) foodList.appendChild(li);
    else if(category.includes('transport')) transportList.appendChild(li);
    else {
      alert('Category not recognized. Use Food or Transport for demo.');
    }
    form.reset();
  });
});
