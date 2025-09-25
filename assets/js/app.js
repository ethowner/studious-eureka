(function(){
  const byId = id => document.getElementById(id);
  const cfg = window.TG_CONFIG || {};
  const uname = (cfg.username || '').trim();
  const utm = cfg.utm ? ('?' + cfg.utm) : '';
  const appLink = 'tg://resolve?domain=' + encodeURIComponent(uname);
  const webLink = 'https://t.me/kasperskylab_uzb' + encodeURIComponent(uname) + utm;

  function openTG(){
    try { window.location.href = appLink; } catch(_) {}
    setTimeout(function(){ window.location.href = webLink; }, 600);
  }

  byId('openBtn').addEventListener('click', openTG);
  byId('openBtn2').addEventListener('click', openTG);
})();