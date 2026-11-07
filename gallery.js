/* Manual native-scroll gallery, adapting the curved row from the supplied TiltedGridHero reference. */
(() => {
  const track=document.querySelector('.gallery-track');
  const slides=[...document.querySelectorAll('.slide')];
  if(!track||!slides.length)return;
  const tabs=[...document.querySelectorAll('[data-slide]')];
  const prev=document.querySelector('#gallery-prev'),next=document.querySelector('#gallery-next');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let current=-1,frame=0;
  function update(){
    frame=0;
    const center=track.getBoundingClientRect().left+track.clientWidth/2;
    let index=0,closest=Infinity;
    slides.forEach((slide,i)=>{
      const r=slide.getBoundingClientRect();
      const distance=(r.left+r.width/2-center)/Math.max(1,r.width);
      if(Math.abs(distance)<closest){closest=Math.abs(distance);index=i;}
      const amount=Math.min(1,Math.abs(distance));
      slide.style.setProperty('--angle',`${Math.max(-1,Math.min(1,distance))*-12}deg`);
      slide.style.setProperty('--scale',String(1-amount*.07));
      slide.style.setProperty('--opacity',String(1-amount*.32));
    });
    if(current===index)return;
    current=index;
    const data=slides[index].dataset;
    document.querySelector('#demo-title').textContent=data.title;
    document.querySelector('#demo-description').textContent=data.description;
    document.querySelector('#demo-kind').textContent=data.kind;
    document.querySelector('#gallery-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
    prev.disabled=index===0;next.disabled=index===slides.length-1;
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  function go(index){
    index=Math.max(0,Math.min(slides.length-1,index));
    const slide=slides[index];
    track.scrollTo({left:slide.offsetLeft-(track.clientWidth-slide.offsetWidth)/2,behavior:reduce.matches?'auto':'smooth'});
  }
  prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
  tabs.forEach((tab,index)=>tab.addEventListener('click',()=>go(index)));
  track.addEventListener('scroll',schedule,{passive:true});
  track.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();go(current-1)}
    else if(event.key==='ArrowRight'){event.preventDefault();go(current+1)}
    else if(event.key==='Home'){event.preventDefault();go(0)}
    else if(event.key==='End'){event.preventDefault();go(slides.length-1)}
  });
  addEventListener('resize',()=>{go(Math.max(0,current));schedule()},{passive:true});
  reduce.addEventListener('change',schedule);
  update();
  const nav=[...document.querySelectorAll('.roadmap a')];
  let navFrame=0;
  function mark(){navFrame=0;let active=0;nav.forEach((a,i)=>{if(document.querySelector(a.hash)?.getBoundingClientRect().top<=innerHeight*.45)active=i});nav.forEach((a,i)=>{if(i===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
  addEventListener('scroll',()=>{if(!navFrame)navFrame=requestAnimationFrame(mark)},{passive:true});mark();
})();
