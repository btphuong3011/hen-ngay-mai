// Shared by the Worker and local server so narrated audio can seek consistently.
export function assetResponse(request,bytes,type){
 const headers=new Headers({'content-type':type,'content-length':String(bytes.length),'accept-ranges':'bytes','cache-control':'no-cache','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"});
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{allow:'GET, HEAD'}});
 const range=request.method==='GET'?request.headers.get('range'):null;
 if(range){
  const m=/^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if(m&&(m[1]||m[2])){
   const start=m[1]?Number(m[1]):Math.max(0,bytes.length-Number(m[2]));
   const end=m[1]?(m[2]?Math.min(Number(m[2]),bytes.length-1):bytes.length-1):bytes.length-1;
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=bytes.length||end<start){headers.set('content-range',`bytes */${bytes.length}`);headers.set('content-length','0');return new Response(null,{status:416,headers});}
   headers.set('content-range',`bytes ${start}-${end}/${bytes.length}`);headers.set('content-length',String(end-start+1));return new Response(bytes.slice(start,end+1),{status:206,headers});
  }
 }
 return new Response(request.method==='HEAD'?null:bytes,{headers});
}
