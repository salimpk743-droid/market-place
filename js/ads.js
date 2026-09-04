(function () {
  var cfg = window.MW_ADS || {};
  if (!cfg.enabled || !cfg.client) return;
  if (window.__mwAdsLoaded) return;
  window.__mwAdsLoaded = true;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.client);
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);

  function fill(id, slot) {
    var el = document.getElementById(id);
    if (!el || !slot) return;
    el.hidden = false;
    el.innerHTML =
      '<ins class="adsbygoogle" style="display:block;min-height:90px" data-ad-client="' +
      cfg.client +
      '" data-ad-slot="' +
      slot +
      '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }

  window.addEventListener("load", function () {
    fill("ad-home", cfg.slots.home);
    fill("ad-list", cfg.slots.list);
  });
})();
