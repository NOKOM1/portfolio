/* Interaction layer. Native equivalents of dock / spotlight patterns searched on 21st. */
(() => {
  const root=document.documentElement;
  const work=document.querySelector('.work-section');
  const mode=document.querySelector('#calm-toggle');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const status=document.querySelector('.experience-status');
  let chosen=null;
  function applyMode(){
    const calm=reduce.matches || chosen===true;
    root.classList.toggle('calm-mode',calm);
    mode?.setAttribute('aria-pressed',String(calm));
    mode?.setAttribute('aria-label','Тихий режим');
    if(mode){mode.disabled=reduce.matches;mode.title=reduce.matches?'Уменьшение движения включено в настройках устройства':'';mode.querySelector('span').textContent=reduce.matches?'Тихо':calm?'Живее':'Тише';}
    root.dispatchEvent(new Event('experiencechange'));
  }
  mode?.addEventListener('click',()=>{
    if(reduce.matches){if(status)status.textContent='Уменьшение движения включено в настройках устройства.';return;}
    chosen=!root.classList.contains('calm-mode');applyMode();
    if(status)status.textContent=chosen?'Тихий режим: анимации выключены.':'Живой режим включён.';
  });
  reduce.addEventListener('change',applyMode);applyMode();
  document.querySelectorAll('.view-switch button').forEach(button=>button.addEventListener('click',()=>{
    work.dataset.view=button.dataset.view;
    document.querySelectorAll('.view-switch button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    dispatchEvent(new Event('scroll'));
  }));
  let shuffleCount=0;
  const shuffle=document.querySelector('.shuffle-button');
  shuffle?.addEventListener('click',()=>{
    root.dispatchEvent(new Event('deckshuffle'));
    const notice=document.querySelector('.shuffle-status');if(notice)notice.textContent=`Карточки перемешаны. Раскладка ${++shuffleCount}.`;
  });
})();
