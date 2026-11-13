/* Práctica de hoy · retiro Del 11 al Uno. Lee window.RETIRO_PRACTICA (practica-config.js).
   Todo se decide con marcas UTC fijas a partir de la hora de Chile de la config;
   la zona del navegador solo se usa para mostrar la hora local de quien mira. */
(function () {
  'use strict';
  var C = window.RETIRO_PRACTICA || {};
  var DIAS = C.dias || [];
  var HORAS = C.horas || ['13:00', '20:00'];
  var OFF = typeof C.utcChile === 'number' ? C.utcChile : -3;
  var CURSO = C.curso || '#';
  var MIN = 60000, HORA = 3600000, DIA = 86400000;
  var ZOOM_ANTES = 30 * MIN, ZOOM_DESPUES = 90 * MIN;
  var SEM = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // Reloj. Parámetro solo para QA: ?ahora=2026-11-15T16:05:00Z
  var desfaseReloj = 0;
  try {
    var qa = new URLSearchParams(location.search).get('ahora');
    if (qa && !isNaN(Date.parse(qa))) desfaseReloj = Date.parse(qa) - Date.now();
  } catch (e) {}
  function ahora() { return Date.now() + desfaseReloj; }

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function dos(n) { return (n < 10 ? '0' : '') + n; }

  // ---------- Calendario en hora de Chile ----------
  function partesFecha(f) { var p = String(f).split('-'); return {y: +p[0], m: +p[1] - 1, d: +p[2]}; }
  function inicioDiaChile(f) { var p = partesFecha(f); return Date.UTC(p.y, p.m, p.d) - OFF * HORA; }
  function marcaChile(f, hhmm) { var h = String(hhmm).split(':'); return inicioDiaChile(f) + (+h[0]) * HORA + (+h[1]) * MIN; }
  function nombreDia(f) { var p = partesFecha(f); return SEM[new Date(Date.UTC(p.y, p.m, p.d)).getUTCDay()]; }
  function fechaLarga(f) { var p = partesFecha(f); return nombreDia(f) + ' ' + p.d + ' de ' + MES[p.m]; }

  function fuente(o) {
    o = o || {};
    var yt = String(o.youtube || '').trim(), bn = String(o.bunny || '').trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(yt)) return {tipo: 'youtube', id: yt};
    if (/^https:\/\/(iframe|player)\.mediadelivery\.net\/(embed|play)\/\d+\/[0-9a-f-]{36}/i.test(bn)) {
      return {tipo: 'bunny', url: bn.split('?')[0].replace('player.mediadelivery.net', 'iframe.mediadelivery.net').replace('/play/', '/embed/')};
    }
    return null;
  }

  function sesiones(d) {
    var base = d.practica || C.practicaGrabada || {};
    return HORAS.map(function (hh, i) {
      var s = d[hh] || {};
      var tipo = s.tipo || 'video';
      var inicio = marcaChile(d.fecha, hh);
      if (tipo === 'zoom') return {i: i, hh: hh, tipo: 'zoom', url: s.url || '', inicio: inicio, abre: inicio - ZOOM_ANTES, cierra: inicio + ZOOM_DESPUES};
      var src = d[hh] ? s : base;
      var dur = +(src.duracionSeg || base.duracionSeg || 1500);
      return {i: i, hh: hh, tipo: 'video', video: fuente(src), dur: dur, inicio: inicio, abre: inicio, cierra: inicio + dur * 1000};
    });
  }

  function estado(t) {
    if (!DIAS.length) return {k: 'fuera'};
    var primero = DIAS[0], ultimo = DIAS[DIAS.length - 1];
    if (t < inicioDiaChile(primero.fecha)) return {k: 'antes', dia: primero, ses: sesiones(primero)[0], ss: sesiones(primero)};
    if (t >= inicioDiaChile(ultimo.fecha) + DIA) return {k: 'cierre'};
    var idx = 0;
    for (var j = 0; j < DIAS.length; j++) if (t >= inicioDiaChile(DIAS[j].fecha)) idx = j;
    var d = DIAS[idx], ss = sesiones(d), sig = DIAS[idx + 1] || null;
    for (var i = 0; i < ss.length; i++) {
      var s = ss[i];
      if (t >= s.abre && t < s.cierra) {
        if (s.tipo === 'zoom') return {k: 'zoom', dia: d, ss: ss, ses: s};
        if (!s.video) return {k: 'sinvideo', dia: d, ss: ss, ses: s};
        return {k: 'video', dia: d, ss: ss, ses: s};
      }
    }
    var prox = null, previa = null;
    for (var n = 0; n < ss.length; n++) { if (ss[n].abre > t && !prox) prox = ss[n]; if (ss[n].cierra <= t) previa = ss[n]; }
    if (prox) return {k: 'espera', dia: d, ss: ss, ses: prox, previa: previa};
    return {k: 'pasada', dia: d, ss: ss, siguienteDia: sig, ses: sig ? sesiones(sig)[0] : null};
  }
  function clave(e) { return e.k + ':' + (e.dia ? e.dia.dia : '') + ':' + (e.ses ? e.ses.i : ''); }

  // ---------- Hora local de quien mira ----------
  var fmtHora = null, fmtDia = null, zonaLocal = '';
  try {
    fmtHora = new Intl.DateTimeFormat('es', {hour: '2-digit', minute: '2-digit', hourCycle: 'h23'});
    fmtDia = new Intl.DateTimeFormat('es', {weekday: 'long'});
    zonaLocal = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch (e) {}
  function horaLocal(ms) { return fmtHora ? fmtHora.format(new Date(ms)) : ''; }
  function diaLocalDistinto(ms, fecha) {
    var dl = new Date(ms);
    var p = partesFecha(fecha);
    return dl.getFullYear() !== p.y || dl.getMonth() !== p.m || dl.getDate() !== p.d;
  }
  function etiquetaLocal(ms, fecha) {
    var h = horaLocal(ms);
    if (h && fmtDia && diaLocalDistinto(ms, fecha)) h += ' del ' + fmtDia.format(new Date(ms));
    return h;
  }
  function mismaHoraQueChile(ss, fecha) {
    if (zonaLocal === 'America/Santiago') return true;
    return ss.every(function (s) { return horaLocal(s.inicio) === s.hh && !diaLocalDistinto(s.inicio, fecha); });
  }
  function lineaHoras(ss, fecha) {
    var chile = ss.map(function (s) { return s.hh; }).join(' y ') + ' de Chile';
    if (!fmtHora || mismaHoraQueChile(ss, fecha)) return chile;
    return 'En tu hora: ' + ss.map(function (s) { return etiquetaLocal(s.inicio, fecha); }).join(' y ') + '. ' + chile + '.';
  }
  function horaSesion(s, fecha) {
    var txt = 'a las ' + s.hh + ' de Chile';
    if (fmtHora && !(zonaLocal === 'America/Santiago' || (horaLocal(s.inicio) === s.hh && !diaLocalDistinto(s.inicio, fecha)))) txt += ' (' + etiquetaLocal(s.inicio, fecha) + ' en tu hora)';
    return txt;
  }

  // ---------- Encabezado ----------
  function pintarEncabezado(e) {
    var ojo = $('ojo'), h1 = $('titulo'), cuerpo = $('cuerpo'), llave = $('llave'), horas = $('horas');
    llave.hidden = true;
    if (e.k === 'antes') {
      ojo.textContent = 'DEL 11 AL UNO · PRÁCTICA DIARIA';
      h1.replaceChildren(document.createTextNode('Empezamos el '), el('em', null, 'sábado 14'));
      cuerpo.textContent = 'Día 1 · ' + e.dia.palabra + ' · ' + e.dia.cuerpo;
      horas.textContent = lineaHoras(e.ss, e.dia.fecha);
      return;
    }
    if (e.k === 'cierre' || e.k === 'fuera') {
      ojo.textContent = 'DEL 11 AL UNO';
      h1.replaceChildren(document.createTextNode('Once días, '), el('em', null, 'hasta el uno.'));
      cuerpo.textContent = '';
      horas.textContent = '';
      return;
    }
    var d = e.dia;
    ojo.textContent = 'PRÁCTICA DE HOY · ' + fechaLarga(d.fecha).toUpperCase();
    h1.replaceChildren(document.createTextNode('Día ' + d.dia + ' · '), el('em', null, d.palabra));
    cuerpo.textContent = d.cuerpo;
    if (d.llave) { llave.textContent = 'Llave del día: ' + d.llave; llave.hidden = false; }
    horas.textContent = lineaHoras(e.ss, d.fecha);
  }

  // ---------- Panel ----------
  var panel = $('panel'), contador = null, objetivo = 0, montado = null;

  function botonCurso(txt, cls) {
    var a = el('a', 'button ' + (cls || 'gold'), txt || 'Ir a la lección del día');
    a.href = CURSO; a.target = '_blank'; a.rel = 'noopener';
    return a;
  }
  function textoFalta(ms) {
    if (ms < 0) ms = 0;
    var h = Math.floor(ms / HORA), m = Math.floor(ms % HORA / MIN), s = Math.floor(ms % MIN / 1000);
    if (h >= 1) return 'Faltan ' + h + ' h ' + dos(m) + ' min';
    return 'Faltan ' + m + ' min ' + dos(s) + ' s';
  }
  function cuenta(destino) {
    objetivo = destino;
    contador = el('p', 'pr-cuenta', textoFalta(destino - ahora()));
    contador.setAttribute('aria-live', 'off');
    return contador;
  }
  function preparacion() { return el('p', 'pr-prep', 'Busca tu lugar, deja el teléfono lejos, ten agua cerca.'); }
  function caja(cls) { var c = el('div', 'pr-caja ' + (cls || '')); return c; }

  function pintarPanel(e) {
    contador = null; montado = null;
    var c;
    switch (e.k) {
      case 'antes':
        c = caja('pr-espera');
        c.appendChild(el('p', 'pr-etiqueta', 'PRIMER ENCUENTRO, EN VIVO'));
        c.appendChild(el('p', 'pr-grande', 'Sábado 14 ' + horaSesion(e.ses, e.dia.fecha)));
        c.appendChild(cuenta(e.ses.inicio));
        c.appendChild(el('p', 'pr-nota', 'El botón para entrar aparece aquí 30 minutos antes.'));
        break;
      case 'espera':
        c = caja('pr-espera');
        if (e.previa) c.appendChild(el('p', 'pr-nota pr-previa', 'La práctica de las ' + e.previa.hh + ' ya terminó. Si no alcanzaste, la grabación está en la lección del día.'));
        c.appendChild(el('p', 'pr-etiqueta', e.ses.tipo === 'zoom' ? 'PRÓXIMO ENCUENTRO, EN VIVO' : 'PRÓXIMA PRÁCTICA'));
        c.appendChild(el('p', 'pr-grande', 'Hoy ' + horaSesion(e.ses, e.dia.fecha)));
        c.appendChild(cuenta(e.ses.inicio));
        c.appendChild(preparacion());
        if (e.ses.tipo === 'zoom') c.appendChild(el('p', 'pr-nota', 'El botón para entrar aparece aquí 30 minutos antes.'));
        else c.appendChild(el('p', 'pr-nota', 'A la hora, el video parte solo y lo vemos todos a la vez.'));
        if (e.previa) { var acc = el('div', 'pr-acciones'); acc.appendChild(botonCurso('Ir a la lección del día', 'outline-claro')); c.appendChild(acc); }
        break;
      case 'zoom':
        c = caja('pr-espera');
        c.appendChild(el('p', 'pr-etiqueta', 'ENCUENTRO EN VIVO'));
        var empezo = ahora() >= e.ses.inicio;
        c.appendChild(el('p', 'pr-grande', empezo ? 'Estamos en vivo desde las ' + e.ses.hh + ' de Chile.' : 'Hoy ' + horaSesion(e.ses, e.dia.fecha)));
        if (!empezo) c.appendChild(cuenta(e.ses.inicio));
        var z = el('a', 'button gold pr-entrar', 'Entrar al encuentro en vivo');
        z.href = e.ses.url || '#'; z.rel = 'noopener';
        var accz = el('div', 'pr-acciones'); accz.appendChild(z); c.appendChild(accz);
        c.appendChild(preparacion());
        break;
      case 'video':
        c = pintarVideo(e);
        break;
      case 'sinvideo':
        c = caja('pr-espera');
        c.appendChild(el('p', 'pr-etiqueta', 'PRÁCTICA DE LAS ' + e.ses.hh));
        c.appendChild(el('p', 'pr-grande', 'La práctica de hoy está en la lección del día.'));
        var accs = el('div', 'pr-acciones'); accs.appendChild(botonCurso()); c.appendChild(accs);
        c.appendChild(preparacion());
        break;
      case 'pasada':
        c = caja('pr-espera');
        c.appendChild(el('p', 'pr-grande', 'La práctica de hoy ya pasó. La grabación está en la lección del día.'));
        var accp = el('div', 'pr-acciones'); accp.appendChild(botonCurso()); c.appendChild(accp);
        if (e.ses && e.siguienteDia) {
          c.appendChild(el('p', 'pr-nota', 'Próxima práctica: mañana, ' + fechaLarga(e.siguienteDia.fecha) + ', ' + horaSesion(e.ses, e.siguienteDia.fecha) + '. Día ' + e.siguienteDia.dia + ' · ' + e.siguienteDia.palabra + '.'));
        } else {
          c.appendChild(el('p', 'pr-nota', 'Hoy cerramos los once días. Gracias por llegar hasta aquí.'));
        }
        break;
      default:
        c = caja('pr-espera');
        c.appendChild(el('p', 'pr-grande', 'Gracias por recorrer los once días.'));
        c.appendChild(el('p', 'pr-nota', 'Las once lecciones siguen en el curso del retiro. Puedes volver a ellas cuando quieras.'));
        var accc = el('div', 'pr-acciones'); accc.appendChild(botonCurso('Abrir el curso del retiro')); c.appendChild(accc);
    }
    panel.replaceChildren(c);
  }

  // ---------- Reproductor como transmisión ----------
  function transcurrido(s) { return Math.max(0, Math.floor((ahora() - s.inicio) / 1000)); }
  function minuto(seg) { var m = Math.floor(seg / 60); return m < 1 ? 'recién empieza' : 'va en el minuto ' + m; }

  function pintarVideo(e) {
    var s = e.ses;
    var c = caja('pr-video');
    var marco = el('div', 'pr-marco');
    var tapa = el('div', 'pr-tapa');
    tapa.appendChild(el('p', 'pr-etiqueta', 'PRÁCTICA DE LAS ' + s.hh + ' · AHORA'));
    var b = el('button', 'button gold pr-entrar', 'Entrar a la práctica');
    b.type = 'button';
    tapa.appendChild(b);
    var va = el('p', 'pr-nota', 'Empezó a las ' + s.hh + ' de Chile y ' + minuto(transcurrido(s)) + '. Entras donde va.');
    tapa.appendChild(va);
    marco.appendChild(tapa);
    c.appendChild(marco);
    c.appendChild(el('p', 'pr-nota pr-bajo', 'Es una transmisión: todos la vemos a la vez. Si pausas, al seguir vuelves a donde va la práctica.'));
    montado = {clave: clave(e), ses: s, entro: false, termino: false, fin: s.cierra, actualizar: function () { va.textContent = 'Empezó a las ' + s.hh + ' de Chile y ' + minuto(transcurrido(s)) + '. Entras donde va.'; }};
    b.addEventListener('click', function () { entrar(marco, s); });
    return c;
  }

  function entrar(marco, s) {
    var t0 = transcurrido(s);
    var f = document.createElement('iframe');
    f.title = 'Práctica del día · retiro Del 11 al Uno';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    if (s.video.tipo === 'youtube') {
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(s.video.id) +
        '?autoplay=1&start=' + t0 + '&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&enablejsapi=1&origin=' + encodeURIComponent(location.origin);
    } else {
      f.src = s.video.url + '?autoplay=true&preload=true&responsive=true&t=' + t0;
    }
    f.setAttribute('data-desfase', String(t0));
    marco.replaceChildren(f);
    if (montado) montado.entro = true;
    sincronizar(f, s);
  }

  function sincronizar(f, s) {
    var yt = s.video.tipo === 'youtube';
    var ultimoAjuste = 0;
    function enviar(obj) { try { f.contentWindow.postMessage(JSON.stringify(obj), '*'); } catch (e) {} }
    function ytCmd(func, args) { enviar({event: 'command', func: func, args: args || []}); }
    function pjs(method, value) { var m = {context: 'player.js', version: '0.0.11', method: method}; if (value !== undefined) m.value = value; enviar(m); }
    function corregir(actual) {
      var debe = transcurrido(s);
      if (debe >= s.dur) return;
      if (Math.abs(actual - debe) > 8 && Date.now() - ultimoAjuste > 4000) {
        ultimoAjuste = Date.now();
        if (yt) ytCmd('seekTo', [debe, true]); else pjs('setCurrentTime', debe);
      }
    }
    f.addEventListener('load', function () {
      var escuchar = function () {
        if (yt) enviar({event: 'listening', id: 1, channel: 'widget'});
        else { pjs('addEventListener', 'ready'); pjs('addEventListener', 'play'); pjs('addEventListener', 'timeupdate'); pjs('addEventListener', 'ended'); }
      };
      escuchar(); setTimeout(escuchar, 1500); setTimeout(escuchar, 4000);
    });
    window.addEventListener('message', function (ev) {
      if (ev.source !== f.contentWindow) return;
      var d; try { d = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data; } catch (e) { return; }
      if (!d) return;
      if (yt) {
        if (d.event === 'onReady') { ytCmd('unMute'); ytCmd('playVideo'); }
        var info = d.info || {};
        if (info.playerState === 0 && montado) montado.termino = true;
        if (typeof info.currentTime === 'number' && (info.playerState === 1 || info.playerState === undefined)) {
          f.setAttribute('data-tiempo', String(Math.round(info.currentTime)));
          if (info.playerState === 1) corregir(info.currentTime);
        }
      } else if (d.context === 'player.js') {
        if (d.event === 'ready') { pjs('play'); }
        if (d.event === 'ended' && montado) montado.termino = true;
        if (d.event === 'play') corregir(-999);
        if (d.event === 'timeupdate' && d.value && typeof d.value.seconds === 'number') {
          f.setAttribute('data-tiempo', String(Math.round(d.value.seconds)));
          corregir(d.value.seconds);
        }
      }
    });
  }

  // ---------- Bucle ----------
  var actual = '';
  function tick() {
    var t = ahora(), e = estado(t), k = clave(e);
    if (k !== actual) {
      // No cortar a quien está viendo: el reproductor sigue hasta que el video termina (máx. 10 min de gracia).
      var retener = montado && montado.entro && !montado.termino && t < montado.fin + 10 * MIN;
      if (!retener) {
        actual = k;
        pintarEncabezado(e);
        pintarPanel(e);
      }
    } else if (e.k === 'zoom' && contador && t >= e.ses.inicio) {
      pintarPanel(e);
    }
    if (contador) contador.textContent = textoFalta(objetivo - t);
    if (montado && !montado.entro) montado.actualizar();
    // Hora local de la próxima sesión se recalcula al cambiar de estado; nada más que hacer.
  }

  // Enlaces fijos
  var curso = $('ir-curso'), cal = $('ir-calendario');
  if (curso) curso.href = CURSO;
  if (cal && C.calendario) cal.href = C.calendario;

  tick();
  setInterval(tick, 1000);
})();
