/* Scroll-only dispersal on inner covers; native horizontal gallery geometry stays unchanged. */
(() => {
  const root=document.documentElement;
  const scene=document.querySelector('.gallery-scene');
  const stage=document.querySelector('.gallery-stage');
  const gallery=document.querySelector('.gallery');
  const track=document.querySelector('.gallery-track');
  const covers=[...document.querySelectorAll('.slide')].map(slide=>slide.querySelector('.gallery-shot')).filter(Boolean);
  if(!scene||!stage||!gallery||!track||!covers.length)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,pinned=false,extra=0,inspecting=true,lastY=scrollY;
  const inactive=()=>reduce.matches||root.classList.contains('quiet-mode');
  const clamp=value=>Math.min(1,Math.max(0,value));
  function clear(){covers.forEach(cover=>{cover.style.setProperty('--scatter-x','0px');cover.style.setProperty('--scatter-y','0px');cover.style.setProperty('--scatter-scale','1');cover.style.setProperty('--scatter-angle','0deg');cover.style.setProperty('--scatter-opacity','1')})}
  function render(){
    frame=0;
    if(inactive()||inspecting){clear();return;}
    const raw=pinned?(24-scene.getBoundingClientRect().top)/Math.max(1,extra):-track.getBoundingClientRect().top/Math.max(1,track.offsetHeight);
    const settle=clamp(raw/.3);
    const progress=clamp(pinned?(raw-.3)/.7:raw);
    const eased=progress*progress*(3-2*progress);
    const selected=Number(gallery.querySelector('.gallery-tabs [aria-pressed="true"]')?.dataset.slide);
    const current=Number.isInteger(selected)&&selected>=0&&selected<covers.length?selected:0;
    covers.forEach((cover,index)=>{
      const central=index===current;
      const direction=index<current?-1:1;
      const travel=pinned?Math.min(innerWidth*.62,760):Math.min(innerWidth*.32,280);
      cover.style.setProperty('--scatter-x',central?'0px':`${(direction*eased*travel).toFixed(2)}px`);
      cover.style.setProperty('--scatter-y',central?`${(-eased*(track.offsetHeight+80)).toFixed(2)}px`:'0px');
      cover.style.setProperty('--scatter-scale',String(1-settle*.06));
      cover.style.setProperty('--scatter-angle',central?'0deg':`${(direction*eased*(pinned?9:4)).toFixed(2)}deg`);
      cover.style.setProperty('--scatter-opacity',String(1-eased*.12));
    });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render)}
  function configure(){
    cancelAnimationFrame(frame);frame=0;
    inspecting=true;
    pinned=!inactive()&&stage.offsetHeight<innerHeight-120;
    extra=pinned?innerHeight*.8:0;
    scene.classList.toggle('scatter-enabled',pinned);
    scene.style.height=pinned?`${stage.offsetHeight+extra}px`:'';
    clear();
  }
  function inspect(){inspecting=true;clear()}
  gallery.addEventListener('pointerdown',inspect,{passive:true});
  gallery.addEventListener('focusin',inspect);
  gallery.addEventListener('keydown',inspect);
  gallery.addEventListener('click',event=>{if(event.target.closest('button'))inspect()});
  track.addEventListener('scroll',inspect,{passive:true});
  addEventListener('scroll',()=>{if(scrollY!==lastY){lastY=scrollY;inspecting=false;}schedule()},{passive:true});
  addEventListener('resize',configure,{passive:true});
  document.addEventListener('quietchange',configure);
  reduce.addEventListener('change',configure);
  configure();
})();
