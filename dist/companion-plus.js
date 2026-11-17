import {replyTo,SMALL_STEPS,chooseSeed,finishSeed} from './companion-engine.js';
const $=s=>document.querySelector(s);
const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function installCompanionPlus({open,close,say,react,icon,mascotSVG,getState,saveState,sparkle,chime}) {
 let dispose=()=>{},scene='garden',sceneTimer,teaTimer;
 const garden=$('#garden');
 garden.insertAdjacentHTML('afterbegin','<img class="room-art" src="assets/rain-room.png" alt="Phòng trà ấm áp, cửa sổ nhìn ra khu vườn mưa."><div class="room-glow" aria-hidden="true"></div>');
 garden.insertAdjacentHTML('beforeend',`<nav class="scene-switch" aria-label="Đổi không gian"><button data-scene="garden" aria-pressed="true">🌷 <span>Vườn mây</span></button><button data-scene="room" aria-pressed="false">☕ <span>Phòng trà</span></button><button data-scene="stage" aria-pressed="false">🎵 <span>Sân khấu</span></button></nav><div class="world-fx" aria-hidden="true"><div class="rain-window">${Array.from({length:20},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="fireflies">${Array.from({length:12},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="tea-steam"><i></i><i></i><i></i></div><span class="floating-leaf">🍃</span></div><button id="tea-pour" class="world-hotspot" aria-label="Rót một tách trà cho Mây">🫖 <span>Rót trà</span></button><button id="firefly-play" class="world-hotspot" aria-label="Chơi cùng đom đóm">✨ <span>Đom đóm</span></button><div class="scene-curtain" aria-hidden="true"></div>`);
 function setScene(next){
  scene=['room','stage'].includes(next)?next:'garden';clearTimeout(sceneTimer);garden.classList.remove('scene-changing');void garden.offsetWidth;garden.classList.add('scene-changing');document.body.dataset.scene=scene;$('#mascot').setAttribute('aria-label',scene==='stage'?'Chạm Mây để đổi điệu nhảy':'Chạm Mây để nhận một lời nhỏ');
  document.querySelectorAll('.scene-switch [data-scene]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.scene===scene));
  $('#garden-label').textContent=scene==='stage'?'SÂN KHẤU NHỎ CỦA MÂY':scene==='room'?'PHÒNG TRÀ CỦA MÂY':'GÓC VƯỜN NHỎ CỦA BẠN';
  $('.room-art').setAttribute('aria-hidden',scene!=='room');$('.garden-art').setAttribute('aria-hidden',scene!=='garden');document.dispatchEvent(new CustomEvent('may-scene'));sceneTimer=setTimeout(()=>garden.classList.remove('scene-changing'),850);
 }
 document.querySelectorAll('.scene-switch [data-scene]').forEach(b=>b.addEventListener('click',()=>{setScene(b.dataset.scene);say(scene==='stage'?'Mây có một tiết mục nhỏ. Bạn chọn điệu nha.':scene==='room'?'Có một tách trà và một chỗ ngồi cho bạn.':'Ra vườn chơi một chút nha.','wave');}));
 $('#tea-pour').addEventListener('click',()=>{clearTimeout(teaTimer);garden.classList.remove('tea-pouring');void garden.offsetWidth;garden.classList.add('tea-pouring');react('happy');say('Tách trà tưởng tượng đã sẵn sàng. Mình ngồi đây nhé.','wave');chime();teaTimer=setTimeout(()=>garden.classList.remove('tea-pouring'),4000);});
 $('#firefly-play').addEventListener('click',fireflyGame);
 garden.addEventListener('pointermove',e=>{if(!getState().motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=garden.getBoundingClientRect();garden.style.setProperty('--parallax-x',`${(e.clientX-r.left-r.width/2)/r.width*8}px`);garden.style.setProperty('--parallax-y',`${(e.clientY-r.top-r.height/2)/r.height*5}px`);});
 garden.addEventListener('pointerleave',()=>{garden.style.setProperty('--parallax-x','0px');garden.style.setProperty('--parallax-y','0px');});
 function cleanup(){dispose();dispose=()=>{};}
 function scopedEvents(){const controller=new AbortController();dispose=()=>controller.abort();return {signal:controller.signal};}

 function seeds(){
  setScene('garden');const state=getState(),task=SMALL_STEPS.find(s=>s.id===state.seed);
  open('seed',`<p class="eyebrow">VƯỜN CỦA NHỮNG VIỆC NHỎ</p><h2 id="dialog-title">Gieo một điều cho mình.</h2><p class="seed-intro">Mỗi hạt là một việc bạn tự chọn ngoài màn hình.</p><div class="seed-journey" aria-label="Chọn việc, trồng hạt, làm khi muốn, cây nở hoa"><span>🌰<small>Chọn việc</small></span><b>→</b><span>🌱<small>Trồng hạt</small></span><b>→</b><span>🌸<small>Làm rồi nở</small></span></div>${task?`<div class="pending-seed ${task.color}"><div class="seed-pot" aria-hidden="true">🌱</div><small>HẠT BẠN ĐANG CHĂM</small><h3>${task.emoji} ${task.title}</h3><p>${task.hint}</p><button class="primary" id="seed-done">Mình đã làm rồi 🌸</button><button class="text-link" id="seed-later">Để lúc khác, về vườn</button><button class="text-link" id="seed-change">Chọn một việc khác</button></div>`:`<div class="seed-options">${SMALL_STEPS.map(s=>`<button data-seed="${s.id}" class="${s.color}"><span>${s.emoji}</span><strong>${s.title}</strong></button>`).join('')}</div>`}<p class="privacy-note">Bạn tự xác nhận khi đã làm. Không hạn giờ, không phạt nếu đổi ý; cây không đo sức khỏe của bạn.</p>`);
  const opts=scopedEvents();$('#dialog-body').addEventListener('click',e=>{
   const choice=e.target.closest('[data-seed]');if(choice){saveState(chooseSeed(getState(),choice.dataset.seed));close();say('Hạt đã nằm trong đất. Làm điều bạn chọn khi thấy phù hợp nhé.','wave');sparkle(82,68);setTimeout(()=>{if(!$('#dialog').open)$('#status').textContent='Hạt đã trồng. Chạm luống cây để xem việc đã chọn.';},700);}
   if(e.target.closest('#seed-done')){saveState(finishSeed(getState()));close();react('happy');$('#flowers .flower:last-child')?.classList.add('growing');sparkle(82,67);say('Một bông hoa để nhớ việc bạn vừa dành cho mình.','happy');chime();}
   if(e.target.closest('#seed-later'))close();
   if(e.target.closest('#seed-change')){saveState({...getState(),seed:null});seeds();}
  },opts);
 }

 function fireflyGame(){
  open('firefly',`<p class="eyebrow">MỘT TRÒ CHƠI KHÔNG VỘI</p><h2 id="dialog-title">Chạm một đốm sáng.</h2><p class="firefly-instruction">Năm bạn nhỏ đang bay. Chạm để tụi mình gặp nhau.</p><div class="firefly-field">${Array.from({length:5},(_,i)=>`<button class="catch-light f${i}" aria-label="Chạm đom đóm ${i+1}" data-light="${i}"><span>✦</span></button>`).join('')}<div class="light-jar" aria-hidden="true"><span>☁</span><div id="jar-lights"></div></div><p id="firefly-finish" hidden>Một góc sáng nhỏ, vừa đủ cho lúc này.</p></div><button class="text-link" data-close="true">Về vườn</button>`);
  let caught=0;const opts=scopedEvents();$('#dialog-body').addEventListener('click',e=>{const b=e.target.closest('[data-light]');if(!b||b.disabled)return;b.disabled=true;b.classList.add('caught');caught++;$('#jar-lights').insertAdjacentHTML('beforeend',`<i style="--i:${caught}">✦</i>`);chime(caught%3+1);react('happy');if(caught===5){$('#firefly-finish').hidden=false;$('.firefly-instruction').textContent='Đủ rồi. Mình có thể về vườn bất cứ lúc nào.';}},opts);
 }

 async function chatView(){
  setScene('room');
  open('chat',`<div class="chat-cover"><div class="chat-buddy" aria-hidden="true">${mascotSVG}</div><div><p class="eyebrow">CHẬM MỘT CHÚT, KỂ MỘT CHÚT</p><h2 id="dialog-title">Mây nghe bạn.</h2><p>Một câu cũng được. Một sticker cũng được.</p></div><span class="cover-doodle" aria-hidden="true">✦<br>♡</span></div><div class="chat-core"><div class="chat-toprow"><div id="chat-service" class="chat-service" role="status">Đang kiểm tra kết nối AI…</div><div class="chat-kind" aria-label="Chế độ trò chuyện"><button id="use-ai" disabled aria-pressed="false">✦ AI</button><button id="use-demo" aria-pressed="false">☁ Bản viết sẵn</button></div></div><div id="chat-consent" class="chat-consent" hidden></div><div class="intent-tabs" aria-label="Cách chia sẻ"><button data-chat-intent="listen" aria-pressed="true">🫶 Chỉ nghe mình</button><button data-chat-intent="reflect" aria-pressed="false">🌱 Cùng nghĩ một chút</button></div><div id="chat-log" class="chat-log" role="log" aria-live="polite"></div><div id="chat-error" class="chat-error" role="status" hidden></div><div class="sticker-tray" aria-label="Gửi một sticker"><button data-sticker="Mình cần một cái ôm tinh thần" aria-label="Gửi sticker cần một cái ôm"><span>🫂</span><small>Cần một cái ôm</small></button><button data-sticker="Hôm nay mình hết pin rồi" aria-label="Gửi sticker hết pin"><span>🪫</span><small>Hết pin</small></button><button data-sticker="Có một điều nhỏ làm mình vui hôm nay" aria-label="Gửi sticker một chút vui"><span>🌈</span><small>Một chút vui</small></button><button data-sticker="Mình muốn được ngồi yên cùng một ai đó" aria-label="Gửi sticker ngồi yên"><span>🍵</span><small>Ngồi yên thôi</small></button></div><form id="chat-form"><label class="sr-only" for="chat-input">Điều bạn muốn chia sẻ</label><textarea id="chat-input" rows="2" maxlength="600" placeholder="Hôm nay của bạn thế nào?"></textarea><button class="send" type="submit" aria-label="Gửi lời chia sẻ">${icon('arrow')}</button></form><div class="chat-bottom"><button class="human-link" data-connect="talk">💌 Mở lời với người mình tin</button><button class="text-link" id="clear-chat">Xóa đoạn chat</button></div><p id="chat-privacy" class="privacy-note"></p></div>`);
  const root=$('#dialog-body'),controller=new AbortController(),signal=controller.signal;let requestController=null,messages=[],intent='listen',mode='loading',consent=false,busy=false,config=null,failed=false,generation=0;
  dispose=()=>{controller.abort();requestController?.abort();messages=[];};
  const active=()=>!signal.aborted&&$('#dialog').open;
  const welcome=()=>[{role:'assistant',content:'Chào bạn, Mây là một nhân vật ảo. Hôm nay bạn muốn kể điều gì, hay bắt đầu bằng một sticker?',source:'intro'}];
  messages=welcome();
  function render(){if(!active())return;$('#chat-log').innerHTML=messages.map(m=>`<div class="chat-line ${m.role==='user'?'line-you':''}">${m.role==='assistant'?'<span class="chat-avatar" aria-hidden="true">☁</span>':''}<div class="chat-message ${m.role==='user'?'from-you':'from-may'} ${m.kind==='urgent'?'urgent':''}"><span class="sender">${m.role==='user'?'BẠN':m.source==='ai'?'MÂY · AI':m.source==='demo'?'MÂY · VIẾT SẴN':m.source==='safety'?'HƯỚNG DẪN TÌM HỖ TRỢ':'MÂY'}</span>${m.sticker?`<span class="sent-sticker" aria-hidden="true">${m.sticker}</span>`:''}<p>${escape(m.content)}</p></div></div>`).join('')+(busy?'<div class="typing-dots" aria-label="Đang chờ dịch vụ AI phản hồi"><i></i><i></i><i></i></div>':'');$('#chat-log').scrollTop=$('#chat-log').scrollHeight;$('#chat-input').disabled=busy||mode==='loading'||(mode==='ai'&&!consent);$('.send').disabled=$('#chat-input').disabled;root.querySelectorAll('[data-sticker]').forEach(b=>b.disabled=$('#chat-input').disabled);}
  function changeMode(next){generation++;requestController?.abort();mode=next;consent=false;busy=false;failed=false;messages=welcome();$('#chat-error').hidden=true;$('#use-ai').setAttribute('aria-pressed',mode==='ai');$('#use-demo').setAttribute('aria-pressed',mode==='demo');const provider=config?.providerLabel||'dịch vụ AI';$('#chat-consent').hidden=mode!=='ai';if(mode==='ai')$('#chat-consent').innerHTML=`<span aria-hidden="true">🔐</span><div><strong>Trước khi mình bắt đầu</strong><p>Tối đa 12 tin gần nhất sẽ được gửi qua máy chủ tới ${escape(provider)} để trả lời. App không lưu nội dung chat. Nhà cung cấp có chính sách dữ liệu riêng. Đừng nhập thông tin định danh hoặc hồ sơ y tế.</p><button id="agree-chat">Đồng ý và bắt đầu</button></div>`;$('#chat-privacy').textContent=mode==='ai'?`Đóng cửa sổ sẽ xóa chat ở app; không thu hồi nội dung đã gửi tới ${provider}. AI có thể hiểu sai và không thay chuyên gia.`:'Phản hồi viết sẵn để thử giao diện, chưa phải AI. Nội dung không gửi lên máy chủ; đóng cửa sổ sẽ xóa chat.';render();}
  async function send(text,sticker=null,retry=false){
   if(busy||mode==='loading'||(mode==='ai'&&!consent))return;
   const content=String(text||'').trim().slice(0,600);if(!retry&&!content)return;
   $('#chat-error').hidden=true;failed=false;
   if(!retry){messages.push({role:'user',content,sticker});$('#chat-input').value='';}
   if(mode==='demo'){const r=replyTo(messages.at(-1).content,intent);messages.push({role:'assistant',content:r.text,kind:r.kind,source:'demo'});render();if(r.kind==='urgent')urgent();return;}
   busy=true;render();requestController=new AbortController();const currentRequest=requestController,gen=++generation;const timeout=setTimeout(()=>currentRequest.abort(),30000);
   try{
    const history=messages.filter(m=>m.source!=='intro').slice(-12).map(m=>({role:m.role,content:m.content}));
    const response=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:history,intent,consent:true}),signal:requestController.signal});
    const data=await response.json();if(!response.ok||!data.text)throw new Error(data.message||'Kết nối chưa sẵn sàng.');
    if(!active()||gen!==generation)return;messages.push({role:'assistant',content:data.text,kind:data.kind,source:data.source});react(data.kind==='urgent'?'calm':'wave');if(data.kind==='urgent')urgent();
   }catch(error){if(!active()||gen!==generation)return;failed=true;$('#chat-error').hidden=false;$('#chat-error').innerHTML=`<span>${escape(error.name==='AbortError'?'Chờ hơi lâu rồi. Bạn có thể thử lại.':error.message)}</span><button id="retry-chat">Thử lại</button>`;}
   finally{clearTimeout(timeout);if(gen===generation){busy=false;if(active())render();}}
  }
  function urgent(){document.body.dataset.urgent='true';$('#dialog-title').textContent='Nhờ người thật hỗ trợ ngay.';root.querySelector('.human-link').dataset.connect='urgent';root.querySelector('.human-link').textContent='Nhờ một người ở cạnh ngay';$('#chat-form').hidden=true;$('.sticker-tray').hidden=true;$('.intent-tabs').hidden=true;$('.chat-kind').hidden=true;}
  root.addEventListener('click',e=>{
   if(e.target.closest('#use-demo'))changeMode('demo');
   if(e.target.closest('#use-ai')&&config?.configured)changeMode('ai');
   if(e.target.closest('#agree-chat')){consent=true;$('#chat-consent').hidden=true;render();$('#chat-input').focus();}
   const it=e.target.closest('[data-chat-intent]');if(it){intent=it.dataset.chatIntent;root.querySelectorAll('[data-chat-intent]').forEach(b=>b.setAttribute('aria-pressed',b===it));}
   const s=e.target.closest('[data-sticker]');if(s)send(s.dataset.sticker,s.querySelector('span').textContent);
   if(e.target.closest('#retry-chat')&&failed)send('',null,true);
   if(e.target.closest('#clear-chat')){generation++;requestController?.abort();messages=welcome();busy=false;failed=false;$('#chat-error').hidden=true;document.body.dataset.urgent='false';$('#dialog-title').textContent='Mây nghe bạn.';$('#chat-form').hidden=false;$('.sticker-tray').hidden=false;$('.intent-tabs').hidden=false;$('.chat-kind').hidden=false;root.querySelector('.human-link').dataset.connect='talk';root.querySelector('.human-link').textContent='💌 Mở lời với người mình tin';render();}
  },{signal});
  root.addEventListener('submit',e=>{if(e.target.id==='chat-form'){e.preventDefault();send($('#chat-input').value);}},{signal});
  root.addEventListener('keydown',e=>{if(e.target.id==='chat-input'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(e.target.value);}},{signal});
  render();
  try{const response=await fetch('/api/config',{signal});if(!response.ok)throw new Error();config=await response.json();}catch{config={configured:false,providerLabel:'Google Gemini'};}
  if(!active())return;$('#chat-service').textContent=config.configured?`✦ ${config.providerLabel}`:'☁ AI chưa được cấu hình trên máy chủ này';$('#chat-service').classList.toggle('connected',config.configured);$('#use-ai').disabled=!config.configured;$('#use-ai').textContent=`✦ ${config.providerLabel}`;if(mode==='loading')changeMode(config.configured?'ai':'demo');
 }
 setScene('garden');
 return {chatView,seeds,setScene,cleanup};
}
