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
