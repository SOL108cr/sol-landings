/* MAN·TRA: capítulos del audio. Sin dependencias; la página funciona sin este archivo. */
(function () {
  var audio = document.getElementById('viaje');
  if (!audio) return;
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.chapters button'));
  function seek(t) {
    var go = function () {
      try { audio.currentTime = t; } catch (e) {}
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    };
    if (audio.readyState >= 1) go();
    else { audio.addEventListener('loadedmetadata', go, { once: true }); audio.load(); }
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { seek(parseFloat(b.getAttribute('data-t'))); });
  });
  function mark() {
    var now = audio.currentTime, active = -1;
    buttons.forEach(function (b, i) { if (now >= parseFloat(b.getAttribute('data-t')) - 0.3) active = i; });
    buttons.forEach(function (b, i) {
      if (i === active) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
  }
  audio.addEventListener('timeupdate', mark);
  audio.addEventListener('seeked', mark);
})();

/* MAN·TRA: la banda del jueves 26 es para gente cercana. Se oculta a quien llega desde redes (instagram, facebook, youtube)
   y para todos desde el jue 26 a las 22:30 de Chile. Sin JS, la banda se ve (es lo seguro para quien llega por correo o 1 a 1). */
(function () {
  var band = document.querySelector('.jueves-band');
  if (!band) return;
  var src = '';
  try { src = (new URLSearchParams(location.search).get('utm_source') || '').toLowerCase(); } catch (e) {}
  var social = ['instagram', 'facebook', 'youtube', 'ig', 'fb', 'yt'].indexOf(src) !== -1;
  var vencida = Date.now() > Date.parse('2026-11-27T01:30:00Z');
  if (social || vencida) band.hidden = true;
})();

/* MAN·TRA: video de la landing. Fachada con póster local; al tocar se carga el iframe youtube-nocookie (no listado). */
(function () {
  var btn = document.getElementById('film-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/qq68A21tGcM?rel=0&autoplay=1&playsinline=1';
    frame.title = 'MAN·TRA en dos minutos · Satya · School of Love';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    btn.replaceWith(frame);
    try { frame.focus(); } catch (e) {}
  });
})();
