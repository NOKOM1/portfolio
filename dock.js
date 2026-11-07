(() => {
  const root=document.documentElement;
  const toggle=document.querySelector('#quiet-toggle');
  const waveToggle=document.querySelector('#wave-toggle');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let quiet=false,previousPause=false;
  function sync(){
    const stopped=reduce.matches||quiet;
    root.classList.toggle('quiet-mode',stopped);
    if(toggle){const text=reduce.matches?'Тихо':quiet?'Живее':'Тише';toggle.querySelector('span').textContent=text;toggle.setAttribute('aria-label',`${text}: режим движения`);toggle.setAttribute('aria-pressed',String(stopped));toggle.disabled=reduce.matches;toggle.title=reduce.matches?'Уменьшение движения включено на устройстве':'';}
    document.dispatchEvent(new CustomEvent('wavepause',{detail:stopped||previousPause}));
    if(waveToggle)waveToggle.disabled=stopped;
    document.dispatchEvent(new CustomEvent('quietchange',{detail:stopped}));
  }
  toggle?.addEventListener('click',()=>{if(reduce.matches)return;if(!quiet)previousPause=waveToggle?.getAttribute('aria-pressed')==='true';quiet=!quiet;sync()});
  reduce.addEventListener('change',sync);sync();
  const theme=document.querySelector('#theme-toggle');
  function themeState(){const light=root.dataset.theme==='light';if(theme){theme.querySelector('span').textContent=light?'Темнее':'Светлее';theme.setAttribute('aria-label',light?'Темнее: включить вишнёвую тему':'Светлее: включить светлую тему');theme.setAttribute('aria-pressed',String(light));}document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#fff8fa':'#13050e');document.dispatchEvent(new Event('themechange'));}
  theme?.addEventListener('click',()=>{const light=root.dataset.theme!=='light';root.dataset.theme=light?'light':'dark';try{localStorage.setItem('denis-theme',light?'light':'dark')}catch{}themeState()});themeState();
  const links=[...document.querySelectorAll('.bottom-dock [data-section]')];let frame=0;
  function mark(){frame=0;let active='about';links.forEach(link=>{if(document.getElementById(link.dataset.section).getBoundingClientRect().top<=innerHeight*.45)active=link.dataset.section});links.forEach(link=>{if(link.dataset.section===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(mark)},{passive:true});mark();
})();
