(() => {
 // Closing brand section: the HL Group bolt as a rotating chrome object, drawn with plain WebGL.
 const en=document.documentElement.lang==='en',t=(sq,eng)=>en?eng:sq;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const footer=document.querySelector('body>footer.site-footer');if(!footer)return;
 const section=document.createElement('section');section.className='brand-outro';section.setAttribute('aria-label','HL Group');
 section.innerHTML='<div class="brand-stage"><canvas aria-hidden="true"></canvas><img class="brand-fallback" src="assets/logo-mark.png" alt="" hidden></div><div class="brand-word"><b>HL GROUP</b><span>ELECTRICAL SOLUTIONS</span></div><p class="brand-line">'+t('Precizitet në punë. <em>Dritë në çdo detaj.</em>','Precision at work. <em>Light in every detail.</em>')+'</p><p class="brand-places">'+t('KOSOVË · KROACI · SHQIPËRI · MAL I ZI','KOSOVO · CROATIA · ALBANIA · MONTENEGRO')+'</p>';
 footer.before(section);
 const canvas=section.querySelector('canvas');
 const gl=canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false});
 if(!gl){canvas.hidden=true;section.querySelector('.brand-fallback').hidden=false;return;}

 // Logo geometry: two triangles traced from the logo, each made into a faceted bipyramid.
 const tris=[[[.65,1.68],[-.75,.35],[0,.02]],[[-.02,-.06],[.78,-.32],[-.68,-1.67]]],H=.24;
 const pos=[],nor=[],outline=[];
 const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const l=Math.hypot(...a);return a.map(v=>v/l);};
 tris.forEach(tr=>{const c=[(tr[0][0]+tr[1][0]+tr[2][0])/3,(tr[0][1]+tr[1][1]+tr[2][1])/3];
  [H,-H].forEach(z=>{const apex=[c[0],c[1],z];for(let i=0;i<3;i++){const a=[...tr[i],0],b=[...tr[(i+1)%3],0];let n=norm(cross(sub(b,a),sub(apex,a)));const mid=[(a[0]+b[0]+apex[0])/3-c[0],(a[1]+b[1]+apex[1])/3-c[1],(a[2]+b[2]+apex[2])/3];if(n[0]*mid[0]+n[1]*mid[1]+n[2]*mid[2]<0)n=n.map(v=>-v);pos.push(...a,...b,...apex);for(let k=0;k<3;k++)nor.push(...n);}});
  for(let i=0;i<3;i++)outline.push([tr[i],tr[(i+1)%3]]);});
 const path=outline.map(([a,b])=>({a,b,l:Math.hypot(b[0]-a[0],b[1]-a[1])})),pathLen=path.reduce((s,p)=>s+p.l,0);
 const along=d=>{d=((d%pathLen)+pathLen)%pathLen;for(const p of path){if(d<=p.l){const k=d/p.l;return [p.a[0]+(p.b[0]-p.a[0])*k,p.a[1]+(p.b[1]-p.a[1])*k,0];}d-=p.l;}return [0,0,0];};

 const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;};
 const program=(vs,fs)=>{const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);return gl.getProgramParameter(p,gl.LINK_STATUS)?p:null;};
 const chrome=program(`attribute vec3 aP;attribute vec3 aN;uniform mat4 uPV,uM;varying vec3 vN,vP,vO;void main(){vec4 w=uM*vec4(aP,1.);vP=w.xyz;vO=aP;vN=mat3(uM)*aN;gl_Position=uPV*w;}`,
 `precision mediump float;varying vec3 vN,vP,vO;uniform vec3 uCam;uniform float uSweep,uMirror,uFloor,uFade;
 vec3 env(vec3 r){float y=r.y;vec3 c=mix(vec3(.008,.01,.008),vec3(.9,.92,.88),smoothstep(-.05,.95,y));
  c+=vec3(2.4)*smoothstep(.88,.98,dot(r,normalize(vec3(-.55,.55,.6))));c+=vec3(1.6)*smoothstep(.93,.99,dot(r,normalize(vec3(.35,.8,.45))));
  c+=vec3(1.1)*pow(max(dot(r,normalize(vec3(.85,.15,.5))),0.),36.);
  c+=vec3(.45)*exp(-pow((y-.04)*11.,2.));
  c+=vec3(.9,.93,.53)*1.2*pow(max(dot(r,normalize(vec3(-.75,-.35,.35))),0.),8.);
  return c;}
 void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;vec3 v=normalize(uCam-vP);if(dot(n,v)<0.)n=-n;vec3 r=reflect(-v,n);
  float fr=pow(1.-max(dot(n,v),0.),3.);vec3 c=env(r)*vec3(.92,.95,.97)*(.7+.3*fr)+vec3(.9,.93,.53)*.18*fr+vec3(.35)*fr;
  c+=vec3(1.)*.55*exp(-pow((dot(vO.xy,normalize(vec2(1.,.7)))-uSweep)*5.,2.));
  float a=1.;if(uMirror>.5){a=.32*(1.-clamp((uFloor-vP.y)/1.1,0.,1.));c*=.75;}
  gl_FragColor=vec4(c,a*uFade);}`);
 const flat=program(`attribute vec3 aP;uniform mat4 uPV,uM;uniform float uSize;void main(){gl_Position=uPV*uM*vec4(aP,1.);gl_PointSize=uSize;}`,
 `precision mediump float;uniform vec4 uColor;uniform float uPoint;void main(){float a=1.;if(uPoint>.5){vec2 d=gl_PointCoord-.5;a=smoothstep(.5,0.,length(d));a*=a;}gl_FragColor=vec4(uColor.rgb,uColor.a*a);}`);
 if(!chrome||!flat){canvas.hidden=true;section.querySelector('.brand-fallback').hidden=false;return;}
 const buf=d=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(d),gl.STATIC_DRAW);return b;};
 const bPos=buf(pos),bNor=buf(nor),bLine=buf(outline.flat().flatMap(p=>[p[0],p[1],0])),bSpark=gl.createBuffer();
 const U=(p,n)=>gl.getUniformLocation(p,n),A=(p,n)=>gl.getAttribLocation(p,n);
 const attr=(p,name,b,size)=>{const l=A(p,name);if(l<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,0,0);};

 // Matrices (column-major)
 const mul=(a,b)=>{const o=new Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s;}return o;};
 const persp=(fov,asp,n,f)=>{const q=1/Math.tan(fov/2);return [q/asp,0,0,0,0,q,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0];};
 const trans=(x,y,z)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1],scal=(x,y,z)=>[x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1];
 const rotY=a=>{const c=Math.cos(a),s=Math.sin(a);return [c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1];},rotX=a=>{const c=Math.cos(a),s=Math.sin(a);return [1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1];},rotZ=a=>{const c=Math.cos(a),s=Math.sin(a);return [c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1];};

 let W=0,Hh=0,dpr=1;
 const resize=()=>{const r=canvas.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;Hh=r.height;canvas.width=Math.round(W*dpr);canvas.height=Math.round(Hh*dpr);gl.viewport(0,0,canvas.width,canvas.height);};
 let tx=0,ty=0,ax=0,ay=0;
 section.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=section.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5);ty=((e.clientY-r.top)/r.height-.5);});
 section.addEventListener('pointerleave',()=>{tx=0;ty=0;});

 const FLOOR=-1.8,CAM=[0,-.38,8.6];let start=0,running=false,visible=false;
 function draw(now){
  const still=reduced.matches;if(!start)start=now;const tm=still?3.2:(now-start)/1000;
  ax+=(tx-ax)*.05;ay+=(ty-ay)*.05;
  const intro=still?1:Math.min(1,tm/1.6),ease=1-Math.pow(1-intro,3);
  const yaw=still?-.42:Math.sin(tm*.45)*.95-.3+ax*.6,pitch=.06+ay*.25,float=still?0:Math.sin(tm*.9)*.06;
  const sc=.86+.14*ease;
  const base=mul(trans(0,float,0),mul(rotY(yaw),mul(rotX(pitch),mul(rotZ(-.04),scal(sc,sc,sc)))));
  const mirror=mul(trans(0,2*FLOOR,0),mul(scal(1,-1,1),base));
  const PV=mul(persp(.5,W/Hh,.1,50),trans(-CAM[0],-CAM[1],-CAM[2]));
  const sweep=still?-9:((tm*.55)%2.6)*3.4-3.6;
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(chrome);attr(chrome,'aP',bPos,3);attr(chrome,'aN',bNor,3);
  gl.uniformMatrix4fv(U(chrome,'uPV'),false,PV);gl.uniform3fv(U(chrome,'uCam'),CAM);gl.uniform1f(U(chrome,'uSweep'),sweep);gl.uniform1f(U(chrome,'uFloor'),FLOOR);gl.uniform1f(U(chrome,'uFade'),ease);
  // Floor reflection first, without writing depth
  gl.disable(gl.DEPTH_TEST);gl.uniform1f(U(chrome,'uMirror'),1);gl.uniformMatrix4fv(U(chrome,'uM'),false,mirror);gl.drawArrays(gl.TRIANGLES,0,pos.length/3);
  gl.enable(gl.DEPTH_TEST);gl.uniform1f(U(chrome,'uMirror'),0);gl.uniformMatrix4fv(U(chrome,'uM'),false,base);gl.drawArrays(gl.TRIANGLES,0,pos.length/3);
  // Thin bright rim, like the outline on the logo
  gl.disable(gl.DEPTH_TEST);gl.useProgram(flat);attr(flat,'aP',bLine,3);
  gl.uniformMatrix4fv(U(flat,'uPV'),false,PV);gl.uniformMatrix4fv(U(flat,'uM'),false,base);gl.uniform1f(U(flat,'uPoint'),0);gl.uniform1f(U(flat,'uSize'),1);
  gl.uniform4f(U(flat,'uColor'),.97,.97,.94,.6*ease);gl.drawArrays(gl.LINES,0,outline.length*2);
  // A spark of current running round the outline
  if(!still){const head=tm*2.1,pts=[];for(let k=0;k<14;k++)pts.push(...along(head-k*.07));
   gl.bindBuffer(gl.ARRAY_BUFFER,bSpark);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pts),gl.DYNAMIC_DRAW);attr(flat,'aP',bSpark,3);
   gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.uniform1f(U(flat,'uPoint'),1);
   for(let k=13;k>=0;k--){const f=1-k/14;gl.uniform1f(U(flat,'uSize'),(k?10:26)*f*dpr);gl.uniform4f(U(flat,'uColor'),.9+.1*(k===0),.93+.07*(k===0),.53+.4*(k===0),(k?.55:.95)*f*ease);gl.drawArrays(gl.POINTS,k,1);}
   gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);}
  if(running&&!still)requestAnimationFrame(draw);
 }
 const go=()=>{if(running||!visible||document.hidden)return;running=true;requestAnimationFrame(draw);};
 const stop=()=>{running=false;};
 if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&!start)start=0;visible?go():stop();},{rootMargin:'80px'}).observe(canvas);else{visible=true;go();}
 document.addEventListener('visibilitychange',()=>document.hidden?stop():go());
 addEventListener('resize',()=>{resize();if(!running)draw(performance.now());});
 reduced.addEventListener?.('change',()=>{stop();resize();draw(performance.now());go();});
 resize();draw(performance.now());if(!reduced.matches)start=0;
})();
