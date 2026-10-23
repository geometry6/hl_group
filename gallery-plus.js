(() => {
 const en=document.documentElement.lang==='en',t=(a,b)=>en?b:a;
 const thumbs=document.createElement('div');thumbs.className='gallery-thumbs';thumbs.setAttribute('role','group');thumbs.setAttribute('aria-label',t('Zgjidh foton','Choose photo'));document.querySelector('.gallery-controls').after(thumbs);
 const photo=document.querySelector('#dialog-image'),frame=document.createElement('div');frame.className='project-photo-frame';photo.before(frame);frame.append(photo);
 photo.title=t('Shiko në ekran të plotë','View full screen');frame.append(document.querySelector('#gallery-count'));
 const arrows=[document.querySelector('#gallery-prev'),document.querySelector('#gallery-next')];arrows.forEach((button,i)=>{button.classList.add('photo-side-arrow',i?'photo-arrow-next':'photo-arrow-prev');frame.append(button);});
 // Simple full-screen viewer: photo, arrows, counter, close
 const lightbox=document.createElement('dialog');lightbox.className='photo-lightbox';lightbox.setAttribute('aria-label',t('Fotografia në ekran të plotë','Full-screen photograph'));
 lightbox.innerHTML='<button type="button" class="lightbox-close" aria-label="'+t('Mbyll fotografinë','Close photograph')+'">×</button><div class="lightbox-photo-frame"><img alt="" draggable="false"><button type="button" class="photo-side-arrow photo-arrow-prev" aria-label="'+t('Fotoja paraprake','Previous photo')+'">←</button><button type="button" class="photo-side-arrow photo-arrow-next" aria-label="'+t('Fotoja tjetër','Next photo')+'">→</button></div><span class="lightbox-count" aria-live="polite"></span>';
 document.body.append(lightbox);let thumbProject=null;
 const large=lightbox.querySelector('img'),fullArrows=[...lightbox.querySelectorAll('.photo-side-arrow')];
 function syncLarge(){large.src='assets/'+activeProject.images[photoIndex];large.alt=activeProject.title+' - '+(photoIndex+1);lightbox.querySelector('.lightbox-count').textContent=(photoIndex+1)+' / '+activeProject.images.length;}
 const originalShow=showPhoto;
 showPhoto=function(){originalShow();[...arrows,...fullArrows].forEach(button=>{button.hidden=activeProject.images.length<2;});if(thumbProject!==activeProject){thumbs.replaceChildren();thumbs.hidden=activeProject.images.length<2;activeProject.images.forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',t('Foto ','Photo ')+(i+1));const img=document.createElement('img');img.src='assets/'+src;img.alt='';img.loading='lazy';button.append(img);button.addEventListener('click',()=>{photoIndex=i;showPhoto();});thumbs.append(button);});thumbProject=activeProject;}[...thumbs.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===photoIndex)));const selected=thumbs.children[photoIndex];if(selected)thumbs.scrollLeft=selected.offsetLeft-thumbs.offsetLeft-thumbs.clientWidth/2+selected.clientWidth/2;if(lightbox.open)syncLarge();};
 photo.addEventListener('click',()=>{syncLarge();lightbox.showModal();});
 lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
 large.addEventListener('click',()=>lightbox.close());
 function step(n){photoIndex=(photoIndex+n+activeProject.images.length)%activeProject.images.length;showPhoto();}
 fullArrows[0].addEventListener('click',()=>step(-1));fullArrows[1].addEventListener('click',()=>step(1));
 lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}});
 // Swipe between photos on touch screens
 [frame,lightbox].forEach(el=>{let x=null,y=0;el.addEventListener('touchstart',e=>{x=e.touches[0].clientX;y=e.touches[0].clientY;},{passive:true});el.addEventListener('touchend',e=>{if(x===null||activeProject.images.length<2)return;const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;x=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)step(dx<0?1:-1);});});
 const brochure=document.createElement('a');brochure.className='button brochure-link';brochure.href='assets/HL-Group-Brochure-'+(en?'EN':'SQ')+'.pdf';brochure.target='_blank';brochure.rel='noopener';brochure.textContent=t('Shkarko broshurën PDF ↓','Download company brochure ↓');document.querySelector('#rreth .body-copy').parentElement.append(brochure);
})();
