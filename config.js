// Находка Dubai — подключение к Supabase (публичные данные, их можно хранить в сайте).
// Ключ с фото содержит символ, который можно прочитать как «I» или «l»:
// приложение один раз проверяет оба варианта и запоминает рабочий.
(function(){var url="https://paicpxjwgzsmutncjeyb.supabase.co",
ks=["sb_publishable_6ELIgojt1ZRf1Gu58p1sqg_tWpnqP_4","sb_publishable_6ELlgojt1ZRf1Gu58p1sqg_tWpnqP_4"],key=ks[0];
try{var c=localStorage.getItem("nd_key");if(c&&ks.indexOf(c)>=0)key=c;else for(var i=0;i<ks.length;i++){var x=new XMLHttpRequest();x.open("GET",url+"/rest/v1/listings?select=id&limit=1",false);x.setRequestHeader("apikey",ks[i]);try{x.send()}catch(e){break}if(x.status==0)break;if(x.status!=401&&x.status!=403){key=ks[i];localStorage.setItem("nd_key",key);break}}}catch(e){}
window.NAHODKA={url:url,key:key};})();
