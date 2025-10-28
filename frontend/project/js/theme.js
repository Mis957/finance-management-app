const APP={
  initThemeToggle:function(btnId){
    const btn=document.getElementById(btnId);
    if(!btn) return;

    // create lever circle
    btn.innerHTML=`<div class="theme-lever"><div class="lever-circle"></div></div>`;
    btn.style.width='50px'; btn.style.height='26px'; btn.style.background='var(--muted)';
    btn.style.borderRadius='50px'; btn.style.position='relative'; btn.style.cursor='pointer';
    btn.style.transition='background 0.3s';

    const circle=btn.querySelector('.lever-circle');
    circle.style.width='15px'; circle.style.height='15px'; circle.style.background='white';
    circle.style.borderRadius='50%'; circle.style.position='absolute'; circle.style.top='2px';
    circle.style.left='5px'; circle.style.transition='left 0.3s';

    const setTheme=(dark)=>{
      document.body.classList.toggle('dark',dark);
      circle.style.left=dark?'26px':'3px';
      btn.style.background=dark?'#4f46e5':'var(--muted)';
      localStorage.setItem('theme',dark?'dark':'light');
    }

    const saved=localStorage.getItem('theme');
    setTheme(saved==='dark');

    btn.onclick=()=> setTheme(!document.body.classList.contains('dark'));
  },
  setActive:function(page){
    document.querySelectorAll('.bottom-nav a').forEach(a=>{ a.classList.remove('active'); if(a.dataset.page===page)a.classList.add('active'); });
    document.querySelectorAll('.nav-link').forEach(a=>{ a.classList.remove('active'); if(a.href.includes(page)) a.classList.add('active'); });
  },
  saveTarget:function(amount){ localStorage.setItem('target',amount); },
  loadTarget:function(){ return localStorage.getItem('target'); }
}; // End of APP object


const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
