export function formatTime(seconds){const n=Number.isFinite(seconds)?Math.max(0,Math.floor(seconds)):0;return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
export function createNarrator({onState=()=>{},root=globalThis.document,createAudio=src=>new Audio(src),speech=globalThis.speechSynthesis,createUtterance=text=>new SpeechSynthesisUtterance(text)}={}){
 const $=s=>root.querySelector(s);
 let mode='recorded',rate=1,volume=.85,track=null,audio=null,utterance=null,status='idle',generation=0,operation=0,timer=null,bindings=null,wanted=false;
 const active=()=>$('#dialog')?.open&&$('#dialog').dataset.kind==='listen';
 function state(next,message){status=next;if(active())onState(next,message);}
 function progress(){if(!active())return;const duration=audio?.duration||0,current=audio?.currentTime||0,seek=$('#narration-seek');if(!seek)return;seek.disabled=mode!=='recorded'||!Number.isFinite(duration)||duration<=0;seek.max=Number.isFinite(duration)?duration:0;seek.value=current;$('#narration-elapsed').textContent=formatTime(current);$('#narration-duration').textContent=formatTime(duration);}
 function stop(){generation++;operation++;wanted=false;clearTimeout(timer);const player=audio;audio=null;if(player){player.pause();player.removeAttribute('src');player.load();}speech?.cancel();utterance=null;state('idle');progress();}
 function select(next){stop();track=next;if(mode==='recorded')prepare();progress();}
 function prepare(){if(!track||audio)return;const id=generation,player=createAudio(`assets/narration/${track.id}.mp3`);audio=player;player.preload='metadata';player.volume=volume;player.playbackRate=rate;player.preservesPitch=true;
  const valid=()=>id===generation&&audio===player&&active();
  player.addEventListener('loadedmetadata',()=>{if(valid())progress();});player.addEventListener('timeupdate',()=>{if(valid())progress();});
  player.addEventListener('playing',()=>{if(!valid()||!wanted){player.pause();return;}clearTimeout(timer);state('playing','Đang kể · giọng AI của Mây');});
  player.addEventListener('pause',()=>{if(valid()&&!player.ended&&status==='playing'){wanted=false;state('paused');}});
  player.addEventListener('ended',()=>{if(valid()){wanted=false;clearTimeout(timer);state('ended');progress();}});
  player.addEventListener('error',()=>{if(valid()){wanted=false;clearTimeout(timer);state('error','Chưa mở được bản kể AI. Bạn có thể chọn giọng thiết bị.');}});
 }
 async function toggle(){
  if(status==='playing'||status==='waiting'){pause();return;}
  if(!track){state('error','Bạn chọn một câu chuyện trước nhé.');return;}
  if(mode==='recorded'){
   prepare();const player=audio,id=generation,op=++operation;wanted=true;if(status==='ended')player.currentTime=0;state('waiting','Đang mở bản kể AI…');
   clearTimeout(timer);timer=setTimeout(()=>{if(id===generation&&op===operation&&status==='waiting'){wanted=false;player.pause();state('error','Bản kể đang tải chậm. Bạn có thể thử lại.');}},12000);
   try{await player.play();if(id!==generation||!wanted||!active())player.pause();}
   catch{if(id===generation&&op===operation&&wanted){wanted=false;clearTimeout(timer);state('error','Chưa phát được âm thanh. Bạn có thể thử lại.');}}return;
  }
  if(!speech){state('error','Thiết bị chưa có giọng đọc. Hãy chọn bản kể AI hoặc đọc bản chữ.');return;}
  if(status==='paused'&&utterance){wanted=true;speech.resume();state('playing','Đang đọc · giọng của thiết bị');return;}
  stop();const id=generation;wanted=true;utterance=createUtterance(track.text);utterance.lang='vi-VN';utterance.rate=rate;utterance.volume=volume;const vn=speech.getVoices().find(v=>v.lang.toLowerCase().startsWith('vi'));if(vn)utterance.voice=vn;
  utterance.onstart=()=>{if(id===generation&&wanted&&active()){clearTimeout(timer);state('playing','Đang đọc · giọng của thiết bị');}};
  utterance.onend=()=>{if(id===generation){clearTimeout(timer);wanted=false;utterance=null;state('ended');}};
  utterance.onerror=()=>{if(id===generation){clearTimeout(timer);wanted=false;state('error','Giọng thiết bị chưa phát được. Bạn có thể chọn bản kể AI.');}};
  state('waiting','Đang mở giọng thiết bị…');timer=setTimeout(()=>{if(id===generation&&status==='waiting'){stop();state('error','Giọng thiết bị chưa mở được. Bạn có thể chọn bản kể AI.');}},8000);speech.speak(utterance);
 }
 function pause(){if(!['playing','waiting'].includes(status))return;const pending=status==='waiting';operation++;wanted=false;clearTimeout(timer);if(mode==='recorded')audio?.pause();else if(pending){generation++;speech?.cancel();utterance=null;}else speech?.pause();state('paused');}
 function hint(){const badge=$('#narration-badge');if(badge)badge.textContent=mode==='recorded'?'✦ Giọng Mây · AI tạo sẵn':'♫ Giọng của thiết bị';$('#narration-hint').textContent=mode==='recorded'?'Giọng AI tạo sẵn · bạn có thể tua và chỉnh nhịp kể.':'Giọng thiết bị · đổi tốc độ sẽ đọc lại từ đầu. Âm lượng áp dụng từ lần đọc tiếp theo.';}
 function bind(){bindings?.abort();bindings=new AbortController();const opts={signal:bindings.signal};$('#voice-source').value=mode;$('#voice-speed').value=String(rate);$('#voice-volume').value=volume;hint();
  $('#voice-source').addEventListener('change',e=>{stop();mode=e.target.value==='device'?'device':'recorded';if(mode==='recorded')prepare();hint();progress();},opts);
  $('#voice-speed').addEventListener('change',e=>{rate=Number(e.target.value);if(mode==='recorded'&&audio)audio.playbackRate=rate;else{const was=status==='playing';stop();if(was)toggle();}},opts);
  $('#voice-volume').addEventListener('input',e=>{volume=Number(e.target.value);if(audio)audio.volume=volume;},opts);
  $('#narration-seek').addEventListener('input',e=>{if(audio&&Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Math.max(0,Math.min(audio.duration,Number(e.target.value)));if(status==='ended')state('paused');progress();}},opts);progress();
 }
 root.addEventListener('visibilitychange',()=>{if(root.hidden)pause();});
 return {bind,select,toggle,pause,stop,get mode(){return mode;},get status(){return status;}};
}
