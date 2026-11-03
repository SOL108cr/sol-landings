(function () {
  'use strict';
  // Formulario MP (siempre) y formulario del camino 11:11 (solo si marcan la casilla).
  var BASE = 'https://assets.mailerlite.com/jsonp/2197783/forms/';
  var FORM_MP = '203069496292803657';
  var FORM_CAMINO = '200852478258841299';
  var KEY = 'sol_mente_v1';
  var form = document.getElementById('form-mente'), button = document.getElementById('enviar'), status = document.getElementById('estado');
  var nombre = form.elements.namedItem('nombre'), email = form.elements.namedItem('email');
  var trampa = form.elements.namedItem('sitio'), camino = form.elements.namedItem('camino');
  var ETIQUETA = button.textContent;
  var q = new URLSearchParams(location.search), acceso = q.get('ya') === '1';
  var cfg = window.SOL_MENTE || {};

  // Después del Portal 11:11 (mié 11-nov, 14:15 Chile) ya no se ofrece el camino.
  if (Date.now() >= Date.UTC(2026, 10, 11, 17, 15)) {
    var seguir = document.getElementById('seguir'); if (seguir) seguir.hidden = true;
    var casilla = camino && camino.closest('.casilla'); if (casilla) { casilla.hidden = true; camino.checked = false; }
  }

  function video(tipo, titulo, pendiente) {
    var c = cfg[tipo] || {}, host = document.getElementById('video-' + tipo), dur = document.getElementById('duracion-' + tipo);
    if (!host) return;
    if (c.publicable === true && /^[a-zA-Z0-9_-]{11}$/.test(c.id || '')) {
      host.className = 'video';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + c.id + '?rel=0';
      iframe.title = titulo; iframe.loading = 'lazy';
      iframe.allow = 'encrypted-media; picture-in-picture; fullscreen'; iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      host.replaceChildren(iframe);
      if (c.duracion && dur) dur.textContent = 'Video: ' + c.duracion + '.';
    } else {
      host.className = 'video-pendiente'; host.textContent = pendiente;
      if (dur) dur.hidden = true;
    }
  }
  video('mente', 'La mente protectora, explicada por Satya', 'La explicación en video llega muy pronto. La práctica ya está lista, más abajo.');

  function abrir(guardar, enfocar, conCamino) {
    document.getElementById('bloque-form').hidden = true;
    document.getElementById('bloque-regalo').hidden = false;
    document.getElementById('aviso-camino').hidden = !conCamino;
    video('practica', 'Práctica de la mente protectora con Satya', 'La práctica estará aquí en unas horas. Vuelve a esta misma página.');
    if (guardar) { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
    if (enfocar) document.getElementById('t-regalo').focus();
  }

  // ?ya=1 es un acceso voluntario (enlace del correo), no una prueba de registro.
  if (acceso) { abrir(false, true, false); return; }
  try { if (localStorage.getItem(KEY) === '1') { abrir(false, true, false); return; } } catch (e) {}

  // Canal de llegada (campo origen_mp): utm_source; si no hay, el dominio del referrer (sin ruta
  // ni parámetros, para no guardar datos de la otra página); si tampoco hay, «directo».
  function canal() {
    var u = (q.get('utm_source') || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 60);
    if (u) return u;
    try { if (document.referrer) { var h = new URL(document.referrer).hostname.toLowerCase().slice(0, 60); if (h) return h; } } catch (err) {}
    return 'directo';
  }
  var ORIGEN = canal();

  function enviar(formId, n, e, sinOrigen) {
    var fd = new FormData();
    fd.append('fields[name]', n); fd.append('fields[email]', e);
    if (!sinOrigen) fd.append('fields[origen_mp]', ORIGEN);
    fd.append('ml-submit', '1'); fd.append('anticsrf', 'true');
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 15000);
    return fetch(BASE + formId + '/subscribe', {method: 'POST', body: fd, signal: controller.signal, referrerPolicy: 'no-referrer'})
      .then(function (r) { return r.json().then(function (j) { return r.ok && j.success === true; }); })
      .catch(function () { return false; })
      .finally(function () { clearTimeout(timer); })
      // Si MailerLite rechaza el envío, un reintento sin origen_mp: el regalo no depende de la medición.
      .then(function (ok) { return ok || sinOrigen ? ok : enviar(formId, n, e, true); });
  }
  function aviso(texto, campo) {
    status.textContent = texto; status.className = 'estado error';
    if (campo) { campo.setAttribute('aria-invalid', 'true'); campo.focus(); }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); if (button.disabled) return;
    nombre.removeAttribute('aria-invalid'); email.removeAttribute('aria-invalid');
    var n = nombre.value.trim(), e = email.value.replace(/^\s*mailto:/i, '').replace(/\s+/g, ''); email.value = e;
    if (!n) { aviso('Escribe tu nombre para saber cómo llamarte.', nombre); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) { aviso('Revisa tu correo, por ejemplo nombre@correo.com.', email); return; }
    // Campo trampa: un bot lo completa; no se envía nada.
    if (trampa && trampa.value) { abrir(false, true, false); return; }
    var conCamino = !!(camino && camino.checked && !camino.closest('.casilla').hidden);
    button.disabled = true; button.textContent = 'Abriendo…'; form.setAttribute('aria-busy', 'true'); status.textContent = ''; status.className = 'estado';
    enviar(FORM_MP, n, e).then(function (ok) {
      if (!ok) throw new Error('Sin confirmación');
      // El regalo no depende de la casilla: si el camino falla, igual se abre la práctica.
      return conCamino ? enviar(FORM_CAMINO, n, e) : false;
    }).then(function (okCamino) {
      abrir(true, true, okCamino === true);
      if (conCamino && okCamino !== true) {
        var nota = document.getElementById('aviso-camino');
        nota.textContent = 'No pudimos sumarte al camino al Portal 11:11. Puedes hacerlo en vuelveati.schooloflove.cl.';
        nota.hidden = false;
      }
    }).catch(function () {
      aviso('No pudimos confirmar tu correo. Revisa que esté bien escrito antes de volver a enviar. Si necesitas ayuda, escríbenos a satya@schooloflove.cl.');
    }).finally(function () {
      button.disabled = false; button.textContent = ETIQUETA; form.removeAttribute('aria-busy');
    });
  });
})();
