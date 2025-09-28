
(function(){
  'use strict';
  var b64 = function(s){ try{ return atob(s||''); }catch(_){ return ''; } };
  var TG_SCHEME = b64(window.__TG_SCHEME_B64);
  var TG_WEB    = b64(window.__TG_WEB_B64);

  var isAndroid = /Android/i.test(navigator.userAgent);
  var isFBInApp = /(FBAN|FBAV|FB_IAB|Instagram)/i.test(navigator.userAgent);
  var isChrome  = /Chrome\/\d+/i.test(navigator.userAgent) && !/Edg|OPR|SamsungBrowser/i.test(navigator.userAgent);

  function openTG(ev){
    if(ev && ev.preventDefault) ev.preventDefault();
    // Track real click to Telegram
    try { fbq && fbq('trackCustom','GoToTelegram'); } catch(_){}

    var cancelled = false, timer;

    function cancel(){ cancelled = true; if(timer){clearTimeout(timer);}}
    document.addEventListener('visibilitychange', function once(){
      if(document.hidden) { cancel(); document.removeEventListener('visibilitychange', once); }
    });
    window.addEventListener('blur', function once(){ cancel(); window.removeEventListener('blur', once); }, true);
    window.addEventListener('pagehide', cancel, {once:true});

    try{
      // Best path: Android Chrome (outside FB In-App) via intent://
      if(isAndroid && isChrome && !isFBInApp){
        var intent = "intent://resolve?domain="+encodeURIComponent(TG_WEB.split('/').pop())+
          "#Intent;scheme=tg;package=org.telegram.messenger;S.browser_fallback_url="+encodeURIComponent(TG_WEB)+";end";
        window.location.href = intent;
        return;
      }
    }catch(_){}

    // Default: try tg:// then fallback to https
    try { window.location.href = TG_SCHEME; } catch(_){}
    timer = setTimeout(function(){
      if(!cancelled){
        try {
          var a = document.createElement('a');
          a.href = TG_WEB; a.target = "_blank"; a.rel = "noopener";
          document.body.appendChild(a); a.click(); a.remove();
        } catch(_){ window.location.href = TG_WEB; }
      }
    }, 700);
  }

  function ready(){
    var openers = document.querySelectorAll('.open-telegram, #openBtn, #openBtn2, #cta, #main-btn, #primary, #install, #join');
    openers.forEach(function(el){ el.addEventListener('click', openTG); });

    // Android gating & user help
    var iosInfo = document.getElementById('iosInfo');
    var fallback = document.getElementById('fallbackLink');
    if(!isAndroid){
      if(iosInfo) iosInfo.classList.remove('hide');
      if(fallback){ 
        fallback.classList.remove('hide'); 
        fallback.addEventListener('click', function(e){ e.preventDefault(); window.open(b64(window.__TG_WEB_B64), '_blank'); });
      }
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
