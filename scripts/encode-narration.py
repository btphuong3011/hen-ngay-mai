"""Offline MP3 encoder; the game does not load this Python dependency."""
from pathlib import Path
import sys, wave, json
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/'tmp'/'audio_tools'))
import lameenc
root=Path(__file__).resolve().parents[1]
source=root.parent/'audio-masters-v4'
target=root/'dist'/'assets'/'narration'
target.mkdir(parents=True,exist_ok=True)
meta=[]
for p in sorted(source.glob('*.wav')):
    with wave.open(str(p),'rb') as w:
        assert w.getsampwidth()==2 and w.getnchannels()==1
        frames=w.readframes(w.getnframes()); rate=w.getframerate(); seconds=w.getnframes()/rate
    encoder=lameenc.Encoder();encoder.set_bit_rate(64);encoder.set_in_sample_rate(rate);encoder.set_channels(1);encoder.set_quality(2)
    encoded=encoder.encode(frames)+encoder.flush()
    output=target/(p.stem+'.mp3');output.write_bytes(encoded)
    meta.append({'id':p.stem,'duration':round(seconds,2),'bytes':len(encoded),'file':'assets/narration/'+output.name,'aiGenerated':True,'voice':'Sulafat','model':'gemini-3.8-flash-lite-tts'})
(target/'manifest.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(meta))
