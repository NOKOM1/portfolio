/* Native adaptation of 21st Arc Spread Hero by daiwiikharihar.
   Source: https://21st.dev/@daiwiikharihar/components/arc-spread-hero */
(() => {
  const root = document.documentElement;
  const opening = document.querySelector('.opening');
  const cards = [...document.querySelectorAll('.deck-card')];
  const copy = document.querySelector('.hero-copy');
  const reveal = document.querySelector('.hero-reveal');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (!opening || cards.length !== 3) return;
  let frame = 0, current = 0, target = 0, pointer = 0;
  let slots=[0,1,2], shuffleTimer=0;
  const inactive=()=>reduce.matches || root.classList.contains("calm-mode");
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = p => p < .5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
  function render() {
    frame = 0;
    if (inactive()) return;
    current += (target-current)*.12;
    if (Math.abs(current-target)<.0005) current=target;
    const p = ease(current);
    const mobile = innerWidth <= 700;
    const initial = mobile ? [-.29,0,.29] : [-.25,0,.25];
    const end = mobile ? [-.8,0,.8] : [-.76,0,.76];
    cards.forEach((card,index) => {
      const i=slots[index];
      card.style.setProperty("--depth",i===1?"4":i===0?"2":"3");
      const x = (initial[i] + (end[i]-initial[i])*p)*innerWidth + pointer*(i-1)*5*p;
      const y = i===1 ? p*innerHeight*.57 : 28-p*innerHeight*.13;
      const rotation = (i-1)*(12+20*p);
      card.style.setProperty('--x',`${x}px`);
      card.style.setProperty('--y',`${y}px`);
      card.style.setProperty('--r',`${rotation}deg`);
      card.style.setProperty('--s',String(1-p*.08));
    });
    copy.style.transform=`translateY(${-p*35}px)`;
    reveal.style.opacity=String(clamp((p-.12)/.55));
    reveal.style.visibility=p>.12?'visible':'hidden';
    if (current!==target) frame=requestAnimationFrame(render);
  }
  function staticLayout() {
    const offsets=innerWidth<=700?[-29,0,29]:[-25,0,25];
    cards.forEach((card,index)=>{const slot=slots[index];card.style.setProperty("--x",`${offsets[slot]}vw`);card.style.setProperty("--y",slot===1?"0px":"28px");card.style.setProperty("--r",`${(slot-1)*12}deg`);card.style.setProperty("--s","1");card.style.setProperty("--depth",slot===1?"4":slot===0?"2":"3")});
  }
  function update() {
    if (inactive()) return;
    const rect=opening.getBoundingClientRect();
    target=clamp(-rect.top/Math.max(1,rect.height-innerHeight));
    if (!frame) frame=requestAnimationFrame(render);
  }
  function configure() {
    cancelAnimationFrame(frame); frame=0;
    root.classList.toggle('motion-enabled',!inactive());
    if (inactive()) {
      cards.forEach(card=>card.removeAttribute('style'));
      staticLayout();
      copy.style.removeProperty('transform');
      reveal.style.opacity='0'; reveal.style.visibility='hidden';
    } else update();
  }
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',()=>{if(inactive())staticLayout();else update();},{passive:true});
  addEventListener('pageshow',update);
  addEventListener('pointermove',event=>{pointer=event.clientX/innerWidth-.5;if(!frame&&!inactive())frame=requestAnimationFrame(render);},{passive:true});
  root.addEventListener('experiencechange',configure);
  root.addEventListener('deckshuffle',()=>{
    slots=slots.map(slot=>(slot+1)%3);
    clearTimeout(shuffleTimer);
    root.classList.toggle('is-shuffling',!inactive());
    if(inactive())staticLayout();
    else {if(!frame)frame=requestAnimationFrame(render);}
    shuffleTimer=setTimeout(()=>root.classList.remove('is-shuffling'),550);
  });
  reduce.addEventListener('change',configure);
  configure();
})();
