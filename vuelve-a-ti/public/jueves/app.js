/* /jueves · inscripción al encuentro «31 minutos juntos» (jue 26-nov-2026).
   Tres formularios nativos de MailerLite (cuenta 2197783), mismo patrón que /sabado y /mente:
   1) inscritos  2) recordatorio por WhatsApp (opcional)  3) vio el programa MAN·TRA (clic, en segundo plano). */
(function () {
  'use strict';
  var BASE = 'https://assets.mailerlite.com/jsonp/2197783/forms/';
  var FORM_INSCRITOS = '205041860533552578'; // grupo «MAN·TRA · jueves 26 · inscritos»
  var FORM_WHATSAPP = '205041861199398443';  // grupo «… recordatorio WhatsApp»
  var FORM_PROGRAMA = '205041861829592700';  // grupo «… vio el programa»
  var WA_AYUDA = 'https://wa.me/56983108065?text=' + encodeURIComponent('Quiero ir el jueves');
  var CLAVE = 'jueves26-registro';
  var FIN_EVENTO = Date.parse('2026-11-27T01:30:00Z'); // 22:30 de Chile, jueves 26
  var INICIO_UTC = '2026-11-27T00:00:00Z';

  function $(id) { return document.getElementById(id); }
  function url(id) { return BASE + (window.JUEVES_FORMS && window.JUEVES_FORMS[id] || id) + '/subscribe'; }

  var memoria = { n: '', e: '' }; // respaldo si localStorage no está disponible
  function guardar(n, e) {
    memoria = { n: n, e: e };
    try { localStorage.setItem(CLAVE, JSON.stringify({ ok: 1, n: n, e: e })); } catch (x) {}
  }
  function leer() {
    try { var g = JSON.parse(localStorage.getItem(CLAVE) || 'null'); if (g && g.ok) return g; } catch (x) {}
    return null;
  }

  $('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('31 minutos juntos con Satya · School of Love')
    + '&dates=20261127T000000Z/20261127T011000Z'
    + '&details=' + encodeURIComponent('Zoom: https://us06web.zoom.us/j/84821757001?pwd=HaZdzuXKsmtZGPmaqQyx3ClhR2k3ri.1\nID 848 2175 7001 · código 492325\nCantamos 31 minutos un mantra de la mañana, silencio, y después Satya cuenta MAN·TRA y responde preguntas. Unos 70 minutos.\nhttps://vuelveati.schooloflove.cl/jueves')
    + '&location=' + encodeURIComponent('Zoom');

  try {
    var txt = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' }).format(new Date(INICIO_UTC));
    $('tuhora').textContent = 'En tu dispositivo: ' + txt + '.';
    $('tuhora-hero').textContent = txt;
  } catch (e) {}

  var q = new URLSearchParams(location.search);
  function limpio(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30); }
  var fuente = 'jueves26_' + (limpio(q.get('utm_source')) || 'directo') + '_' + (limpio(q.get('utm_medium')) || 'directo');

  function esEmail(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(e); }
  function limpiaEmail(v) { return v.replace(/^\s*mailto:/i, '').replace(/\s+/g, ''); }
  function campo(idInput, idErr, msg) {
    var i = $(idInput), er = $(idErr);
    if (msg) { er.textContent = msg; er.hidden = false; i.setAttribute('aria-invalid', 'true'); }
    else { er.hidden = true; er.textContent = ''; i.removeAttribute('aria-invalid'); }
  }
  function falla(el, texto) {
    el.hidden = false; el.textContent = texto + ' ';
    var a = document.createElement('a'); a.href = WA_AYUDA; a.rel = 'noopener'; a.textContent = 'Escríbenos por WhatsApp';
    el.appendChild(a);
  }
  // POST a MailerLite: resuelve true si guardó. Rechazo explícito o timeout => false; falla de red => un reintento sin CORS.
  function enviar(fd, id) {
    var controller = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);
    return fetch(url(id), { method: 'POST', body: fd, referrerPolicy: 'no-referrer', signal: controller ? controller.signal : undefined })
      .then(function (res) { return res.json().catch(function () { return { success: res.ok }; }); })
      .then(function (j) { clearTimeout(timer); return !(j && j.success === false); },
        function () {
          clearTimeout(timer);
          return fetch(url(id), { method: 'POST', body: fd, mode: 'no-cors', referrerPolicy: 'no-referrer' }).then(function () { return true; }, function () { return false; });
        });
  }
  function datos(n, e, extra) {
    var fd = new FormData();
    fd.append('fields[name]', n); fd.append('fields[email]', e);
    for (var k in extra) fd.append('fields[' + k + ']', extra[k]);
    fd.append('ml-submit', '1'); fd.append('anticsrf', 'true');
    return fd;
  }

  function mostrarGracias(nombre, enfocar) {
    $('bloque-form').hidden = true;
    $('g-nombre').textContent = nombre || 'Listo';
    var g = $('gracias'); g.hidden = false;
    $('p2-mail-wrap').hidden = !!(memoria.e);
    try { if (location.hash !== '#listo') history.replaceState(null, '', location.pathname + location.search + '#listo'); } catch (e) {}
    if (enfocar) { try { g.focus(); g.scrollIntoView({ block: 'start' }); } catch (e) {} }
  }

  if (Date.now() > FIN_EVENTO) {
    $('bloque-form').hidden = true; $('paso').hidden = false;
    $('hero-cta').hidden = true; $('nav-join').hidden = true;
  } else {
    var g0 = leer();
    if (g0) { memoria = { n: g0.n || '', e: g0.e || '' }; mostrarGracias(g0.n || '', false); }
  }

  /* Paso 1: nombre y correo */
  var f = $('f'), b = $('b'), status = $('status'), ETIQ = b.textContent, enviando = false;
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (enviando) return;
    status.hidden = true;
    var n = $('n').value.trim().replace(/\s+/g, ' '), e = limpiaEmail($('e').value);
    var primero = null;
    campo('n', 'e-n', n.length < 2 ? 'Escribe tu nombre.' : ''); if (n.length < 2) primero = $('n');
    var mal = !esEmail(e);
    campo('e', 'e-e', mal ? 'Revisa tu correo, por ejemplo nombre@correo.com.' : ''); if (mal) primero = primero || $('e');
    if (primero) { primero.focus(); return; }
    var primer = n.split(' ')[0];
    if ($('web').value) { mostrarGracias(primer, true); return; } // trampa: simula sin enviar
    enviando = true; b.disabled = true; b.textContent = 'Guardando…'; f.setAttribute('aria-busy', 'true');
    enviar(datos(n, e, { fuente: fuente }), FORM_INSCRITOS).then(function (ok) {
      enviando = false; b.disabled = false; b.textContent = ETIQ; f.removeAttribute('aria-busy');
      if (!ok) { falla(status, 'No pudimos guardar tu inscripción. Revisa que el correo esté bien escrito y vuelve a intentar.'); return; }
      guardar(primer, e); mostrarGracias(primer, true);
    });
  });

  /* Paso 2: recordatorio por WhatsApp (opcional) */
  function normalizaWa(w) {
    var s = w.trim().replace(/[\s().-]/g, '');
    if (/^00/.test(s)) s = '+' + s.slice(2);
    var dig = s.replace(/\D/g, '');
    if (s.charAt(0) === '+' || (dig.length >= 10 && dig.length <= 15)) s = '+' + dig;
    return { s: s, dig: dig };
  }
  var f2 = $('f2'), b2 = $('b2'), status2 = $('status2'), ETIQ2 = b2.textContent, enviando2 = false;
  f2.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (enviando2) return;
    status2.hidden = true;
    var e = memoria.e || limpiaEmail($('e2').value), mal = false, primero = null;
    if (!memoria.e) { mal = !esEmail(e); campo('e2', 'e-e2', mal ? 'Revisa tu correo, por ejemplo nombre@correo.com.' : ''); if (mal) primero = $('e2'); }
    var wa = normalizaWa($('w').value), wmal = wa.dig.length < 8 || wa.dig.length > 15;
    campo('w', 'e-w', wmal ? 'Escribe tu WhatsApp con código de país, por ejemplo +56 9 1234 5678.' : ''); if (wmal) primero = primero || $('w');
    var ok = $('wa-ok').checked, eok = $('e-ok');
    if (!ok) { eok.textContent = 'Marca la casilla para que podamos escribirte por WhatsApp.'; eok.hidden = false; $('wa-ok').setAttribute('aria-invalid', 'true'); primero = primero || $('wa-ok'); }
    else { eok.hidden = true; $('wa-ok').removeAttribute('aria-invalid'); }
    if (primero) { primero.focus(); return; }
    enviando2 = true; b2.disabled = true; b2.textContent = 'Guardando…'; f2.setAttribute('aria-busy', 'true');
    var nombre = memoria.n || $('g-nombre').textContent;
    enviar(datos(nombre, e, { whatsapp: wa.s, fuente: 'jueves26_recordatorio_wa' }), FORM_WHATSAPP).then(function (res) {
      enviando2 = false; b2.disabled = false; b2.textContent = ETIQ2; f2.removeAttribute('aria-busy');
      if (!res) { falla(status2, 'No pudimos guardar tu número. Vuelve a intentar.'); return; }
      $('p2-form').hidden = true; $('p2-ok').hidden = false; $('p2-t').hidden = true;
    });
  });

  /* Bloque MAN·TRA: registra el clic en segundo plano y navega */
  $('ver-mantra').addEventListener('click', function (ev) {
    var e = memoria.e; if (!e) return; // sin correo guardado: navega normal
    try {
      var fd = datos(memoria.n || '', e, { fuente: 'jueves26_gracias' });
      if (!(navigator.sendBeacon && navigator.sendBeacon(url(FORM_PROGRAMA), fd))) {
        fetch(url(FORM_PROGRAMA), { method: 'POST', body: fd, keepalive: true, mode: 'no-cors', referrerPolicy: 'no-referrer' }).catch(function () {});
      }
    } catch (x) {}
  });
})();
