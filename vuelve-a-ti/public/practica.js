(function () {
  'use strict';
  var ENDPOINT = 'https://assets.mailerlite.com/jsonp/2197783/forms/200852478258841299/subscribe';
  var KEY = 'vat_practica_v2';
  var form = document.getElementById('form-practica'), button = document.getElementById('enviar'), status = document.getElementById('estado');
  var q = new URLSearchParams(location.search), acceso = q.get('ya') === '1';
  var nombre = form.elements.namedItem('nombre'), email = form.elements.namedItem('email');
  if (q.has('name')) nombre.value = q.get('name').slice(0,80);
  if (q.has('email')) email.value = q.get('email').slice(0,120);
  // Retira datos personales de la barra antes de cargar servicios externos. No los persiste.
  if (q.has('name') || q.has('email')) {
    q.delete('name'); q.delete('email');
    try { history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : '') + location.hash); } catch (e) {}
  }
  function video(tipo) {
    var config = (window.VAT_PRACTICA || {})[tipo] || {}, host = document.getElementById('video-' + tipo);
    if (config.publicable === true && /^[a-zA-Z0-9_-]{11}$/.test(config.id || '')) {
      host.className = 'video';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + config.id;
      var sem = /^s3/.test(tipo) ? '3' : (/^s2/.test(tipo) ? '2' : '1');
      iframe.title = (/completa$/.test(tipo) ? 'Práctica completa' : 'Práctica diaria') + ' de la semana ' + sem + ' con Satya';
      iframe.loading = 'lazy'; iframe.allow = 'encrypted-media; picture-in-picture; fullscreen'; iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin'; host.replaceChildren(iframe);
      if (config.duracion) document.getElementById('duracion-' + tipo).textContent = 'Video: ' + config.duracion + '.';
    } else {
      host.className = 'video-pendiente'; host.textContent = /^s3/.test(tipo) ? 'La práctica de esta semana llega el martes 27. Mientras tanto, puedes hacer la de la semana pasada, más abajo.' : /^s2/.test(tipo) ? (tipo === 's2completa' ? 'La práctica de esta semana llega el martes 20. Mientras tanto, puedes hacer la de la semana pasada, más abajo.' : 'La versión diaria llega el martes 20 en la noche. Mientras tanto, haz la completa o elige la versión suave.') : (tipo === 'completa' ? 'Estamos preparando la práctica completa. Vuelve a esta misma página para verla.' : 'La versión diaria estará aquí cuando esté lista. Mientras tanto puedes volver a la completa y elegir la versión suave.');
    }
  }
  function abrir(guardar, enfocar) {
    document.getElementById('bloque-form').hidden = true;
    document.getElementById('bloque-practica').hidden = false;
    ['s3completa','s3diaria','s2completa','s2diaria','completa','diaria'].forEach(video);
    if (guardar) { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
    if (enfocar) document.getElementById('antes').focus();
  }
  // ?ya=1 es un acceso voluntario para integrantes, no una prueba de registro ni autenticación.
  if (acceso) { abrir(false, false); return; }
  try { if (localStorage.getItem(KEY) === '1') { abrir(false, false); return; } } catch (e) {}
  form.addEventListener('submit', async function (ev) {
    ev.preventDefault(); if (button.disabled) return;
    var n = nombre.value.trim(), e = email.value.replace(/^\s*mailto:/i, '').replace(/\s+/g, ''); email.value = e;
    if (!n || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) {
      status.textContent = !n ? 'Escribe tu nombre.' : 'Revisa tu correo, por ejemplo nombre@correo.com.';
      (!n ? nombre : email).focus(); return;
    }
    button.disabled = true; button.textContent = 'Abriendo…'; status.textContent = '';
    var fd = new FormData(); fd.append('fields[name]', n); fd.append('fields[email]', e); fd.append('ml-submit','1'); fd.append('anticsrf','true');
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 15000);
    try {
      var r = await fetch(ENDPOINT, {method:'POST', body:fd, signal:controller.signal, referrerPolicy:'no-referrer'});
      var data = await r.json();
      if (!r.ok || data.success !== true) throw new Error('Sin confirmación');
      abrir(true, true);
    } catch (err) {
      status.textContent = 'No pudimos confirmar tu inscripción. Revisa tu correo antes de volver a enviar. Si necesitas ayuda, escríbenos a satya@schooloflove.cl.';
    } finally { clearTimeout(timer); button.disabled = false; button.textContent = 'Recibir la práctica gratis'; }
  });
})();
