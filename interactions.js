/* Project Showcase, adapted from jatin-yadav05 / 21st component 9607.
   Pointer effects supplement ordinary links; touch and keyboard retain the same destinations. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const inactive=()=>reduce.matches || document.documentElement.classList.contains("calm-mode");
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const progress = document.querySelector('.read-progress');
  const preview = document.querySelector('.hover-preview');
  const previewImage = preview?.querySelector('img');
  const shortcuts = [...document.querySelectorAll('.project-index a')];
  let frame=0, active=false, x=0, y=0, targetX=0, targetY=0;
  function animatePreview() {
    frame=0;
    if (!active || !fine.matches || inactive() || innerWidth<=700) return;
    x+=(targetX-x)*.15; y+=(targetY-y)*.15;
    preview.style.transform=`translate3d(${x}px,${y}px,0) rotate(-4deg)`;
    if (Math.abs(x-targetX)+Math.abs(y-targetY)>.2) frame=requestAnimationFrame(animatePreview);
  }
  function hide() {active=false;preview?.classList.remove('is-visible');cancelAnimationFrame(frame);frame=0;}
  function track(event) {
    if (!fine.matches || inactive() || innerWidth<=700) return;
    targetX=Math.max(10,Math.min(innerWidth-310,event.clientX+22));
    targetY=Math.max(10,Math.min(innerHeight-230,event.clientY+24));
    if (!active) {x=targetX;y=targetY;}
    active=true;preview.classList.add('is-visible');
    if (!frame) frame=requestAnimationFrame(animatePreview);
  }
  if (preview && previewImage) shortcuts.forEach(link=>{
    link.addEventListener('pointerenter',event=>{previewImage.src=link.dataset.preview;track(event)});
    link.addEventListener('pointermove',track);
    link.addEventListener('pointerleave',hide);
    link.addEventListener('click',hide);
  });
  let progressFrame=0;
  function updateProgress() {
    progressFrame=0;
    const grid=document.querySelector(".work-section")?.dataset.view==="grid";
    let current=grid?-1:0;
    document.querySelectorAll(".case").forEach((item,i)=>{if(!grid&&item.getBoundingClientRect().top<=innerHeight*.45)current=i});
    shortcuts.forEach((link,i)=>{if(i===current)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current")});
    const counter=document.querySelector(".index-count b");if(counter)counter.textContent=grid?"ВСЕ":String(current+1).padStart(2,"0");
    const distance=document.documentElement.scrollHeight-innerHeight;
    if(progress)progress.style.transform=`scaleX(${distance>0?Math.min(1,Math.max(0,scrollY/distance)):0})`;
  }
  function onScroll(){hide();if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress)}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{hide();updateProgress()},{passive:true});
  updateProgress();
  const images=[...document.querySelectorAll('.case-image')];
  const magnet=document.querySelector('.contact-arrow');
  const contact=document.querySelector('.contact-link');
  images.forEach(link=>{
    link.addEventListener('pointermove',event=>{
      if(!fine.matches||inactive()||innerWidth<=700)return;
      const rect=link.getBoundingClientRect();
      const dx=(event.clientX-rect.left)/rect.width-.5,dy=(event.clientY-rect.top)/rect.height-.5;
      link.style.setProperty('--tilt-x',`${-dy*5}deg`);
      link.style.setProperty('--tilt-y',`${dx*5}deg`);
    });
    link.addEventListener('pointerleave',()=>{link.style.removeProperty('--tilt-x');link.style.removeProperty('--tilt-y')});
  });
  if(contact&&magnet){
    contact.addEventListener('pointermove',event=>{
      if(!fine.matches||inactive()||innerWidth<=700)return;
      const r=magnet.getBoundingClientRect();
      magnet.style.transform=`translate(${Math.max(-9,Math.min(9,(event.clientX-r.left-r.width/2)*.12))}px,${Math.max(-9,Math.min(9,(event.clientY-r.top-r.height/2)*.12))}px)`;
    });
    contact.addEventListener('pointerleave',()=>magnet.style.removeProperty('transform'));
  }
  function reset(){hide();images.forEach(link=>{link.style.removeProperty('--tilt-x');link.style.removeProperty('--tilt-y')});magnet?.style.removeProperty('transform')}
  document.documentElement.addEventListener('experiencechange',reset);
  reduce.addEventListener('change',reset);fine.addEventListener('change',reset);
})();
