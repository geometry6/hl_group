(() => {
 const en=document.documentElement.lang==='en',t=(sq,eng)=>en?eng:sq;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const projects=window.HL_PROJECTS||[];

 // Numbers band, counted from the project data so it stays accurate
 const strip=document.querySelector('.service-strip');
 if(strip&&projects.length){
  const stats=[
   [projects.length,t('Projekte të realizuara','Completed projects')],
   [new Set(projects.map(p=>p.country).filter(Boolean)).size,t('Shtete','Countries')],
   [projects.reduce((n,p)=>n+p.images.length,0),t('Fotografi nga terreni','On-site photos')],
   [projects.reduce((n,p)=>n+(p.videos||[]).length,0),t('Video nga projektet','Project videos')]];
  const band=document.createElement('section');band.className='stats-band';band.setAttribute('aria-label',t('HL Group në shifra','HL Group in numbers'));
  stats.forEach(([value,label])=>{const d=document.createElement('div');const b=document.createElement('b');b.textContent=value;b.dataset.count=value;const s=document.createElement('span');s.textContent=label;d.append(b,s);band.append(d);});
  strip.after(band);
  if(!reduced.matches&&'IntersectionObserver' in window){
   const nums=[...band.querySelectorAll('b')];nums.forEach(b=>b.textContent='0');
   const io=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;io.disconnect();const start=performance.now(),dur=1400;
    const tick=now=>{const k=Math.min(1,(now-start)/dur),e=1-Math.pow(1-k,3);nums.forEach(b=>b.textContent=Math.round(e*b.dataset.count));if(k<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);},{threshold:.4});
   io.observe(band);
  }
 }

 // Slimmer header after scrolling
 const header=document.querySelector('header');
 const measure=()=>{document.body.classList.remove('is-scrolled');const h=header.offsetHeight;document.documentElement.style.setProperty('--header-h',h+'px');document.documentElement.style.setProperty('--header-shrink',(h>85?20:14)+'px');onScroll();};
 let scrolled=false;
 const onScroll=()=>{const y=scrollY;if(!scrolled&&y>90)scrolled=true;else if(scrolled&&y<30)scrolled=false;document.body.classList.toggle('is-scrolled',scrolled);};
 addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',measure);measure();

 // Smooth closing for pop-ups and the photo viewer
 const closeNow=HTMLDialogElement.prototype.close;
 document.querySelectorAll('dialog').forEach(d=>{
  d.close=function(value){if(!this.open||reduced.matches||this.classList.contains('is-closing'))return closeNow.call(this,value);
   this.classList.add('is-closing');setTimeout(()=>{this.classList.remove('is-closing');closeNow.call(this,value);},190);};
  d.addEventListener('cancel',e=>{if(reduced.matches)return;e.preventDefault();d.close();});
 });

 // Project cards appearing one after another; only new cards animate after "Load more"
 const grid=document.querySelector('#project-grid');
 if(grid){
  let shown=[];
  new MutationObserver(()=>{const cards=[...grid.children],labels=cards.map(c=>c.getAttribute('aria-label'));
   const kept=shown.length&&shown.every((l,i)=>labels[i]===l)?shown.length:0;shown=labels;
   if(reduced.matches)return;
   cards.slice(kept).forEach((c,i)=>{c.style.setProperty('--i',i);c.classList.remove('card-in');void c.offsetWidth;c.classList.add('card-in');c.addEventListener('animationend',()=>c.classList.remove('card-in'),{once:true});});
  }).observe(grid,{childList:true});
  shown=[...grid.children].map(c=>c.getAttribute('aria-label'));
 }

 // FAQ answers slide open and closed
 document.querySelectorAll('.faq details').forEach(d=>{
  const summary=d.querySelector('summary'),body=d.querySelector('p');if(!summary||!body)return;let anim;
  summary.addEventListener('click',e=>{if(reduced.matches||!body.animate)return;e.preventDefault();anim?.cancel();
   const opening=!d.open||d.classList.contains('is-closing');d.classList.remove('is-closing');if(opening)d.open=true;const h=body.scrollHeight;
   body.style.overflow='hidden';
   anim=body.animate(opening?[{height:'0px',opacity:0},{height:h+'px',opacity:1}]:[{height:h+'px',opacity:1},{height:'0px',opacity:0}],{duration:opening?340:260,easing:'cubic-bezier(.2,.8,.2,1)'});
   if(!opening)d.classList.add('is-closing');
   anim.onfinish=()=>{body.style.overflow='';if(!opening){d.open=false;d.classList.remove('is-closing');}anim=null;};
   anim.oncancel=()=>{body.style.overflow='';};
  });
 });
})();
