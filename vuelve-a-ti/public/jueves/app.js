/* /jueves · inscripción al encuentro «31 minutos juntos» (jue 26-nov-2026).
   Envía nombre, correo y (opcional, con consentimiento) WhatsApp al formulario nativo de MailerLite,
   igual que /sabado y /mente: POST a assets.mailerlite.com, ya permitido por la CSP de _headers. */
(function () {
  'use strict';
  var ACCOUNT_ID = '2197783';
  // TODO(Satya/Rosario): crear en MailerLite el grupo «MAN·TRA · jueves 26», un formulario embebido que lo
  // asigne (campos name, email, whatsapp, fuente) y pegar aquí el ID del formulario. Mientras diga TODO,
  // la página NO finge éxito: muestra el WhatsApp de respaldo.
  var FORM_ID = 'TODO';
  var FORM_URL = 'https://assets.mailerlite.com/jsonp/' + ACCOUNT_ID + '/forms/' + FORM_ID + '/subscribe';
  var WA_AYUDA = 'https://wa.me/56983108065?text=' + encodeURIComponent('Quiero ir el jueves');
  var CLAVE = 'jueves26-registro';
  var FIN_EVENTO = Date.parse('2026-11-27T01:30:00Z'); // 22:30 de Chile, jueves 26
  var INICIO_UTC = '2026-11-27T00:00:00Z';

  function $(id) { return document.getElementById(id); }
  var f = $('f'), b = $('b'), status = $('status');
  var ETIQUETA = b.textContent;

  // Enlace de Google Calendar
  $('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('31 minutos juntos con Satya · School of Love')
    + '&dates=20261127T000000Z/20261127T011000Z'
    + '&details=' + encodeURIComponent('Zoom: https://us06web.zoom.us/j/84821757001?pwd=HaZdzuXKsmtZGPmaqQyx3ClhR2k3ri.1\nID 848 2175 7001 · código 492325\nCantamos 31 minutos un mantra de la mañana, silencio, y después Satya cuenta MAN·TRA y responde preguntas. Unos 70 minutos.\nhttps://vuelveati.schooloflove.cl/jueves')
    + '&location=' + encodeURIComponent('Zoom');

  // «Tu hora» según el huso del navegador
  try {
    var d = new Date(INICIO_UTC);
    var txt = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' }).format(d);
    $('tuhora').textContent = 'En tu dispositivo: ' + txt + '.';
    $('tuhora-hero').textContent = txt;
  } catch (e) {}

  // Origen (canal) sin guardar nada más que utm_source/medium
  var q = new URLSearchParams(location.search);
  function limpio(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30); }
  var fuente = 'jueves26_' + (limpio(q.get('utm_source')) || 'directo') + (q.get('utm_medium') ? '_' + limpio(q.get('utm_medium')) : '');

  function mostrarGracias(nombre) {
    $('bloque-form').hidden = true;
    $('suave').hidden = true;
    $('g-nombre').textContent = nombre ? nombre : 'Listo';
    var g = $('gracias'); g.hidden = false;
    try { g.focus(); g.scrollIntoView({ block: 'start' }); } catch (e) {}
  }

  // Después del encuentro: sin formulario ni Zoom.
  if (Date.now() > FIN_EVENTO) {
    $('bloque-form').hidden = true; $('suave').hidden = true; $('paso').hidden = false;
    $('hero-cta').hidden = true; $('nav-join').hidden = true;
  } else {
    try {
      var g = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (g && g.ok) mostrarGracias(g.n || '');
    } catch (e) {}
  }

  function campo(idInput, idErr, msg) {
    var i = $(idInput), er = $(idErr);
    if (msg) { er.textContent = msg; er.hidden = false; i.setAttribute('aria-invalid', 'true'); }
    else { er.hidden = true; er.textContent = ''; i.removeAttribute('aria-invalid'); }
  }
  function falla(html, texto) {
    status.hidden = false;
    status.innerHTML = '';
    status.appendChild(document.createTextNode(texto + ' '));
    var a = document.createElement('a'); a.href = WA_AYUDA; a.rel = 'noopener'; a.textContent = 'Escríbenos por WhatsApp';
    status.appendChild(a);
  }

  // El consentimiento de WhatsApp aparece solo si escriben un número
  $('w').addEventListener('input', function () {
    var hay = this.value.replace(/\D/g, '').length > 0;
    $('wrap-wa').hidden = !hay;
    if (!hay) $('wa-ok').checked = false;
  });

  function normalizaWa(w) {
    var s = w.trim().replace(/[\s().-]/g, '');
    if (/^00/.test(s)) s = '+' + s.slice(2);
    var dig = s.replace(/\D/g, '');
    if (s.charAt(0) !== '+' && dig.length >= 10 && dig.length <= 15) s = '+' + dig; else if (s.charAt(0) === '+') s = '+' + dig;
    return { s: s, dig: dig };
  }

  var enviando = false, rechazos = 0;
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (enviando) return;
    status.hidden = true;
    var n = $('n').value.trim().replace(/\s+/g, ' ');
    var e = $('e').value.replace(/^\s*mailto:/i, '').replace(/\s+/g, '');
    var w = $('w').value.trim();
    var ok = true, primero = null;
    campo('n', 'e-n', n.length < 2 ? 'Escribe tu nombre.' : '');
    if (n.length < 2) { ok = false; primero = primero || $('n'); }
    var emailMal = !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(e);
    campo('e', 'e-e', emailMal ? 'Revisa tu correo, por ejemplo nombre@correo.com.' : '');
    if (emailMal) { ok = false; primero = primero || $('e'); }
    var wa = null, waMsg = '';
    if (w) {
      wa = normalizaWa(w);
      if (wa.dig.length < 8 || wa.dig.length > 15) waMsg = 'Escribe tu WhatsApp con código de país, por ejemplo +56 9 1234 5678, o déjalo vacío.';
      else if (!$('wa-ok').checked) waMsg = 'Marca la casilla si quieres recibir el recordatorio por WhatsApp, o borra el número.';
    }
    campo('w', 'e-w', waMsg);
    if (waMsg) { ok = false; primero = primero || (w && wa && wa.dig.length >= 8 && wa.dig.length <= 15 ? $('wa-ok') : $('w')); }
    if (!ok) { primero.focus(); return; }

    var primer = n.split(' ')[0];
    // Campo trampa: un bot lo completa; se simula éxito sin enviar.
    if ($('web').value) { mostrarGracias(primer); return; }

    if (FORM_ID === 'TODO' && !window.JUEVES_FORM_ID) {
      falla('', 'La inscripción todavía no está abierta en esta página.');
      return;
    }
    var url = window.JUEVES_FORM_ID
      ? 'https://assets.mailerlite.com/jsonp/' + ACCOUNT_ID + '/forms/' + window.JUEVES_FORM_ID + '/subscribe' : FORM_URL;

    var fd = new FormData();
    fd.append('fields[name]', n);
    fd.append('fields[email]', e);
    if (wa && $('wa-ok').checked) fd.append('fields[whatsapp]', wa.s);
    fd.append('fields[fuente]', fuente + (wa && $('wa-ok').checked ? '_wa' : ''));
    fd.append('ml-submit', '1'); fd.append('anticsrf', 'true');

    enviando = true; b.disabled = true; b.textContent = 'Guardando…'; f.setAttribute('aria-busy', 'true');
    var fin = function () { enviando = false; b.disabled = false; b.textContent = ETIQUETA; f.removeAttribute('aria-busy'); };
    var listo = function () {
      try { localStorage.setItem(CLAVE, JSON.stringify({ ok: 1, n: primer })); } catch (x) {}
      fin(); mostrarGracias(primer);
    };
    var error = function () { fin(); falla('', 'No pudimos guardar tu inscripción. Revisa que el correo esté bien escrito y vuelve a intentar.'); };
    var controller = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);
    fetch(url, { method: 'POST', body: fd, referrerPolicy: 'no-referrer', signal: controller ? controller.signal : undefined })
      .then(function (res) { return res.json().catch(function () { return { success: res.ok }; }); })
      .then(function (j) {
        clearTimeout(timer);
        if (j && j.success === false) { rechazos++; error(); return; }
        listo();
      }, function () {
        clearTimeout(timer);
        // Falla de red o de CORS: un solo reintento sin leer la respuesta.
        fetch(url, { method: 'POST', body: fd, mode: 'no-cors', referrerPolicy: 'no-referrer' }).then(listo).catch(error);
      });
  });
})();
