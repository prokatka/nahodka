// Резервный лёгкий клиент Supabase (REST). Используется, если библиотека с CDN не загрузилась.
(function(){function C(url,key){url=url.replace(/\/$/,"");var SK="nd_sess_"+url.slice(8,20),sess=null;try{sess=JSON.parse(localStorage.getItem(SK))}catch(e){}
var H=function(x,t){var h={apikey:key};if(t)h.Authorization="Bearer "+t;for(var k in x||{})h[k]=x[k];return h},JH={"Content-Type":"application/json"};
var save=function(s){sess=s;try{s?localStorage.setItem(SK,JSON.stringify(s)):localStorage.removeItem(SK)}catch(e){}},tok=function(){return sess&&sess.access_token};
var mk=function(d){return d&&d.access_token?{access_token:d.access_token,refresh_token:d.refresh_token,expires_at:Math.floor(Date.now()/1000)+(d.expires_in||3600),user:d.user}:null};
async function J(path,o){try{var r=await fetch(url+path,o),t=await r.text(),d=null;try{d=t?JSON.parse(t):null}catch(e){}
if(!r.ok)return{data:null,error:{message:(d&&(d.msg||d.message||d.error_description||d.error))||("HTTP "+r.status),status:r.status},res:r};return{data:d,error:null,res:r}}catch(e){return{data:null,error:{message:"Failed to fetch"},res:null}}}
var auth={async signUp(a){var r=await J("/auth/v1/signup",{method:"POST",headers:H(JH),body:JSON.stringify({email:a.email,password:a.password,data:(a.options&&a.options.data)||{}})});if(r.error)return{data:{},error:r.error};var s=mk(r.data);if(s)save(s);return{data:{session:s,user:(r.data&&r.data.user)||r.data},error:null}},
async signInWithPassword(a){var r=await J("/auth/v1/token?grant_type=password",{method:"POST",headers:H(JH),body:JSON.stringify({email:a.email,password:a.password})});if(r.error)return{data:{},error:r.error};save(mk(r.data));return{data:{session:sess,user:sess&&sess.user},error:null}},
async getSession(){if(sess&&sess.expires_at-30<Date.now()/1000){var r=await J("/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:H(JH),body:JSON.stringify({refresh_token:sess.refresh_token})});if(r.error&&r.error.status)save(null);else if(!r.error)save(mk(r.data))}return{data:{session:sess}}},
async signOut(){if(sess)await J("/auth/v1/logout",{method:"POST",headers:H({},tok())});save(null);return{error:null}},
async updateUser(a){var r=await J("/auth/v1/user",{method:"PUT",headers:H(JH,tok()),body:JSON.stringify({data:a.data})});if(!r.error&&sess&&r.data){sess.user=r.data;save(sess)}return{data:r.data,error:r.error}},
onAuthStateChange:function(){return{data:{subscription:{unsubscribe:function(){}}}}}};
function from(t){var m="GET",q=[],body=null,pre=[],one=false,head=false,sel="*";
var b={select:function(c,o){sel=c||"*";if(o&&o.count)pre.push("count=exact");if(o&&o.head)head=true;return b},insert:function(x){m="POST";body=x;pre.push("return=minimal");return b},upsert:function(x){m="POST";body=x;pre.push("resolution=merge-duplicates","return=minimal");return b},"delete":function(){m="DELETE";return b},update:function(x){m="PATCH";body=x;pre.push("return=minimal");return b},
eq:function(c,v){q.push(c+"=eq."+encodeURIComponent(v));return b},"in":function(c,v){q.push(c+"=in.("+v.map(function(x){return'"'+x+'"'}).join(",")+")");return b},order:function(c,o){q.push("order="+c+"."+(o&&o.ascending===false?"desc":"asc"));return b},limit:function(n){q.push("limit="+n);return b},maybeSingle:function(){one=true;q.push("limit=1");return b},
then:function(ok,no){return run().then(ok,no)}};
async function run(){var u="/rest/v1/"+t+"?"+(m=="GET"?["select="+encodeURIComponent(sel)].concat(q):q).join("&"),hd=H(JH,tok());if(pre.length)hd.Prefer=pre.join(",");
var r=await J(u,{method:head?"HEAD":m,headers:hd,body:body?JSON.stringify(body):undefined}),c;if(r.res){var cr=r.res.headers.get("content-range");if(cr&&cr.indexOf("/")>0)c=+cr.split("/")[1]}
return{data:one?((r.data&&r.data[0])||null):r.data,error:r.error,count:c}}return b}
var storage={from:function(bk){return{async upload(p,blob,o){var r=await J("/storage/v1/object/"+bk+"/"+encodeURI(p),{method:"POST",headers:H({"Content-Type":(o&&o.contentType)||blob.type||"application/octet-stream","x-upsert":o&&o.upsert?"true":"false"},tok()),body:blob});return{data:r.data,error:r.error}},getPublicUrl:function(p){return{data:{publicUrl:url+"/storage/v1/object/public/"+bk+"/"+encodeURI(p)}}}}}};
return{auth:auth,from:from,storage:storage}}
window.supabaseLite={createClient:C}})();
