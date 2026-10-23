(() => {
 // Interactive 3D house: plan → wiring → lighting → smart home. Plain canvas, no libraries.
 const en=document.documentElement.lang==='en',t=(sq,eng)=>en?eng:sq;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const anchor=document.querySelector('#sherbimet');if(!anchor)return;

 const modes=[
  [t('Projektim','Design'),t('Fillojmë me planin: hapësirat, pikat elektrike dhe matjet.','We start with the plan: spaces, electrical points and measurements.')],
  [t('Instalime','Installation'),t('Nga paneli te çdo dhomë: shpërndarje e sigurt dhe e organizuar.','From the distribution board to every room: safe, organised distribution.')],
  [t('Ndriçim','Lighting'),t('Ndriçim i brendshëm dhe i jashtëm, i menduar për çdo hapësirë.','Indoor and outdoor lighting, designed for every space.')],
  [t('Smart home','Smart home'),t('Sensorë dhe skena ndriçimi që i kontrolloni nga një vend.','Sensors and lighting scenes you control from one place.')]];
 const section=document.createElement('section');section.className='section viz';section.id='vizualizimi';
 section.innerHTML='<div class="viz-copy"><p class="eyebrow">'+t('NGA PLANI TE DRITA','FROM PLAN TO LIGHT')+'</p><h2>'+t('Çdo kabllo.<br><em>Çdo dritë.</em>','Every cable.<br><em>Every light.</em>')+'</h2><p class="viz-intro">'+t('Një shtëpi, katër faza. Shihni si një projekt elektrik merr formë, nga plani i parë te ndriçimi dhe sistemet inteligjente.','One house, four stages. See how an electrical project takes shape, from the first plan to lighting and smart systems.')+'</p><div class="viz-modes" role="group" aria-label="'+t('Fazat e projektit','Project stages')+'">'+modes.map((m,i)=>'<button type="button" data-mode="'+i+'"><span>0'+(i+1)+'</span>'+m[0]+'</button>').join('')+'</div><p class="viz-caption" aria-live="polite"></p></div><div class="viz-stage"><canvas role="img" aria-label="'+t('Vizualizim 3D i instalimeve elektrike në një shtëpi','3D visualisation of the electrical installation in a house')+'"></canvas><span class="viz-hint">'+t('Tërhiqni për ta rrotulluar','Drag to rotate')+'</span><div class="viz-progress"><i></i></div></div>';
 anchor.after(section);
 const canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d'),buttons=[...section.querySelectorAll('[data-mode]')],caption=section.querySelector('.viz-caption'),bar=section.querySelector('.viz-progress i');

 // Geometry in metres. y is up.
 const E=[];const box=(x0,y0,z0,x1,y1,z1)=>{const c=[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]];[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b])=>E.push([c[a],c[b],1]));};
 const rect=(pts,w=.55)=>pts.forEach((p,i)=>E.push([p,pts[(i+1)%pts.length],w]));
 box(0,0,0,10,3,7);box(0,3,0,7,6,7);
 rect([[-.4,6.15,-.4],[7.4,6.15,-.4],[7.4,6.15,7.4],[-.4,6.15,7.4]],.8);
 rect([[4,0,0],[4,3,0],[4,3,7],[4,0,7]],.35);rect([[4,0,4],[10,0,4],[10,3,4],[4,3,4]],.35);rect([[3.5,3,0],[3.5,6,0],[3.5,6,7],[3.5,3,7]],.35);
 rect([[7,3.9,0],[10,3.9,0],[10,3.9,7],[7,3.9,7]],.45);[[7,0],[10,0],[10,7]].forEach(([x,z])=>E.push([[x,3,z],[x,3.9,z],.45]));
 const windows=[[1,.9,3,2.4],[5.5,.3,9,2.6],[.8,3.8,3,5.4],[4.2,3.8,6.4,5.4]];
 windows.forEach(([x0,y0,x1,y1])=>rect([[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0]],.6));
 rect([[10,.3,1.5],[10,2.6,1.5],[10,2.6,5.5],[10,.3,5.5]],.6);
 rect([[.05,.9,6.2],[.05,1.7,6.2],[.05,1.7,6.85],[.05,.9,6.85]],1);// distribution board

 const P=[.05,1.7,6.5],C1=2.85,C2=5.85;
 const wires=[
  [P,[.3,C1,6.5],[2,C1,6.5],[2,C1,3.5]],
  [[.3,C1,6.5],[4,C1,6.5],[4,C1,2],[7,C1,2]],
  [[4,C1,6.5],[7,C1,6.5],[7,C1,5.5]],
  [[.3,C1,6.5],[.3,C2,6.5],[1.75,C2,6.5],[1.75,C2,3.5]],
  [[.3,C2,6.5],[5.25,C2,6.5],[5.25,C2,3.5]],
  [[.3,C1,6.5],[.3,C1,.15],[9.7,C1,.15]],
  [[.05,.9,6.5],[-1.2,.02,6.5],[-1.2,.02,-2],[10.2,.02,-2]]];
 const lights=[[2,C1,3.5,0,1],[7,C1,2,1,1],[7,C1,5.5,2,1],[1.75,C2,3.5,3,1],[5.25,C2,3.5,4,1],[.8,2.55,-.05,5,.7],[5,2.55,-.05,5,.7],[9.3,2.55,-.05,5,.7],[.5,.35,-2,6,.5],[4,.35,-2,6,.5],[7.5,.35,-2,6,.5],[10.2,.35,-2,6,.5]];
 const sensors=[[3.7,2.7,.3],[9.7,2.7,6.7],[6.7,5.7,.3],[.3,5.7,.3]];
 const len=w=>w.slice(1).reduce((s,p,i)=>s+Math.hypot(p[0]-w[i][0],p[1]-w[i][1],p[2]-w[i][2]),0);
 const lens=wires.map(len),total=lens.reduce((a,b)=>a+b,0);
 const along=(w,d)=>{for(let i=1;i<w.length;i++){const a=w[i-1],b=w[i],l=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);if(d<=l){const k=d/l;return [a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];}d-=l;}return w[w.length-1];};

 // Camera
 let yaw=-.62,pitch=.42,W=0,H=0,dpr=1,f=1;
 const resize=()=>{const r=canvas.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);f=Math.min(W,H*1.25)*1.3;};
 const proj=([x,y,z])=>{x-=4.6;y-=2.4;z-=2.6;const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);let X=x*cy-z*sy,Z=x*sy+z*cy;const Y=y*cp+Z*sp;Z=Z*cp-y*sp;const d=Z+24;return [W/2+f*X/d,H*.5-f*Y/d,Z];};

 let mode=0,modeStart=performance.now(),auto=!reduced.matches,lastInput=0,running=false,visible=false;
 const setMode=(m,user)=>{mode=m;modeStart=performance.now();buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===m)));caption.textContent=modes[m][1];if(user){auto=false;if(!running||reduced.matches)frame(performance.now());}};
 buttons.forEach((b,i)=>b.addEventListener('click',()=>setMode(i,true)));
 setMode(0);

 const lime='230,237,136',warm='255,214,140';
 function frame(now){
  const tm=(now-modeStart)/1000,time=now/1000,still=reduced.matches;
  if(!still&&now-lastInput>2500)yaw+=.0016;
  if(auto&&tm>5.5)setMode((mode+1)%4);
  bar.style.transform='scaleX('+(auto?Math.min(1,tm/5.5):0)+')';
  ctx.clearRect(0,0,W,H);
  // Ground grid
  ctx.lineWidth=1;
  for(let i=-4;i<=15;i++){const a=proj([i,0,-5]),b=proj([i,0,11]);ctx.strokeStyle='rgba('+lime+',.06)';ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let k=-5;k<=11;k++){const a=proj([-4,0,k]),b=proj([15,0,k]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  const lit=mode>=2?(still?1:Math.min(1,tm/1.2)):0;
  // Warm glass when lights are on
  if(lit){windows.forEach(([x0,y0,x1,y1])=>{const q=[[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0]].map(proj);ctx.fillStyle='rgba('+warm+','+(.16*lit)+')';ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();});}
  // Building edges
  ctx.setLineDash(mode===0?[5,5]:[]);ctx.lineDashOffset=-time*8;
  E.forEach(([a,b,w])=>{const p=proj(a),q=proj(b),depth=Math.max(.35,Math.min(1,1.25-((p[2]+q[2])/2+8)/22));ctx.strokeStyle=mode===0?'rgba(242,241,233,'+(.55*w*depth)+')':'rgba(242,241,233,'+(.32*w*depth)+')';ctx.lineWidth=w>.9?1.4:1;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});
  ctx.setLineDash([]);
  // Electrical points on the plan
  if(mode===0)lights.forEach(l=>{const p=proj(l);ctx.strokeStyle='rgba('+lime+',.9)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p[0],p[1],4,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(p[0]-6,p[1]);ctx.lineTo(p[0]+6,p[1]);ctx.moveTo(p[0],p[1]-6);ctx.lineTo(p[0],p[1]+6);ctx.stroke();});
  // Wiring, drawn in on the installation stage
  if(mode>=1){const drawn=mode===1&&!still?Math.min(1,tm/2.2)*total:total;let used=0;
   ctx.lineWidth=2;ctx.lineCap='round';
   wires.forEach((w,wi)=>{const l=lens[wi],show=Math.max(0,Math.min(l,drawn-used));used+=l;if(!show)return;ctx.strokeStyle='rgba('+lime+','+(mode===1?.95:.55)+')';ctx.beginPath();let d=0;const step=.25;for(;d<=show;d+=step){const p=proj(along(w,d));d?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);}const e=proj(along(w,show));ctx.lineTo(e[0],e[1]);ctx.stroke();
    if(!still&&show>=l){ctx.globalCompositeOperation='lighter';for(let k=0;k<Math.ceil(l/3);k++){const p=proj(along(w,(time*3.2+k*3)%l));const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],9);g.addColorStop(0,'rgba('+lime+',.95)');g.addColorStop(1,'rgba('+lime+',0)');ctx.fillStyle=g;ctx.fillRect(p[0]-9,p[1]-9,18,18);}ctx.globalCompositeOperation='source-over';}});
   const pb=proj([.05,1.3,6.5]);ctx.fillStyle='rgba('+lime+',1)';ctx.fillRect(pb[0]-3,pb[1]-3,6,6);}
  // Lights
  if(lit){ctx.globalCompositeOperation='lighter';
   lights.forEach(([x,y,z,room,s],i)=>{let k=lit*Math.min(1,Math.max(0,(still?9:tm*3)-i*.35));
    if(mode===3&&!still)k*=.35+.65*(.5+.5*Math.sin(time*1.6-room*1.1));
    if(k<=0)return;const p=proj([x,y,z]),r=(14+22*s)*(f/700)*(.6+.4*k);const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);g.addColorStop(0,'rgba(255,244,214,'+(.95*k)+')');g.addColorStop(.2,'rgba('+warm+','+(.32*k)+')');g.addColorStop(1,'rgba('+warm+',0)');ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,r*2,r*2);
    if(y>1){const fl=proj([x,y>3?3.02:.02,z]),fr=r*1.8;ctx.save();ctx.translate(fl[0],fl[1]);ctx.scale(1,.42);const g2=ctx.createRadialGradient(0,0,0,0,0,fr);g2.addColorStop(0,'rgba('+warm+','+(.16*k)+')');g2.addColorStop(1,'rgba('+warm+',0)');ctx.fillStyle=g2;ctx.fillRect(-fr,-fr,fr*2,fr*2);ctx.restore();}});
   ctx.globalCompositeOperation='source-over';}
  // Smart sensors
  if(mode===3)sensors.forEach((s,i)=>{const p=proj(s);ctx.fillStyle='rgba('+lime+',1)';ctx.beginPath();ctx.arc(p[0],p[1],3,0,7);ctx.fill();if(still)return;for(let k=0;k<2;k++){const ph=((time*.8+i*.27+k*.5)%1);ctx.strokeStyle='rgba('+lime+','+(.7*(1-ph))+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(p[0],p[1],6+ph*30,(6+ph*30)*.6,0,0,7);ctx.stroke();}});
  if(running&&!still)requestAnimationFrame(frame);
 }
 const start=()=>{if(running||!visible)return;running=true;requestAnimationFrame(frame);};
 const stop=()=>{running=false;};
 if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;visible&&!document.hidden?start():stop();},{rootMargin:'100px'}).observe(canvas);else{visible=true;start();}
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 addEventListener('resize',()=>{resize();if(!running)frame(performance.now());});
 reduced.addEventListener?.('change',()=>{stop();start();if(reduced.matches){auto=false;frame(performance.now());}});

 // Drag to rotate
 let drag=null;
 canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY,yaw,pitch];canvas.setPointerCapture(e.pointerId);section.classList.add('viz-touched');});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw=drag[2]+(e.clientX-drag[0])*.008;pitch=Math.max(.12,Math.min(.95,drag[3]+(e.clientY-drag[1])*.005));lastInput=performance.now();if(!running)frame(performance.now());});
 const end=()=>{drag=null;lastInput=performance.now();};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);

 resize();if(reduced.matches){setMode(3);auto=false;}frame(performance.now());
})();
