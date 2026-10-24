'use strict';
// Registration preview: native MailerLite form, submission disabled until release checks pass.
const offers = {
  pass: {
    title: 'Pase Del 11 al Uno', price: 'US$47 · Un solo pago',
    description: 'Para vivir las once jornadas sin contratar una suscripción.',
    summary: ['Pago en Hotmart; prácticas y grabaciones en Portal Origen, dentro de Skool.', 'Acceso al programa y estancia temporal hasta el 13 de diciembre de 2026.'],
    status: 'La inscripción al retiro abre el 26 de octubre, después del capítulo 3 del camino gratuito.'
  },
  premium: {
    title: 'Membresía Premium', price: 'US$37 al mes · Renovación mensual',
    description: 'Incluye el retiro Del 11 al Uno completo, más bibliotecas de meditación y clases y kriyas de Kundalini Yoga, cursos, desafíos, streaming y encuentros de comunidad según el calendario vigente.',
    summary: ['Contratación en Skool. El programa está incluido mientras tu membresía esté activa.', 'El cobro empieza al incorporarte; si entras antes del programa, la membresía puede renovar antes de su inicio.'],
    status: 'La inscripción al retiro abre el 26 de octubre, después del capítulo 3 del camino gratuito.'
  },
  standard: {
    title: 'Tu pase Estándar', price: 'US$37 · Un solo pago',
    description: 'Precio para miembros que ya pagan la membresía Estándar de Portal Origen.',
    summary: ['Se verificará tu membresía antes de darte el enlace de este pase.', 'Acceso al programa hasta el 13 de diciembre de 2026. Tu membresía Estándar se conserva después de esa fecha.'],
    status: 'La inscripción al retiro abre el 26 de octubre, después del capítulo 3 del camino gratuito.'
  },
  member: {
    title: 'Tu experiencia está incluida', price: 'Premium / VIP activo · Sin pago adicional',
    description: 'No necesitas comprar otro pase para participar en Del 11 al Uno.',
    summary: ['El programa aparecerá dentro de Portal Origen cuando esté disponible.', 'Te indicaremos el acceso y el canal de avisos que corresponda cuando estén confirmados.'],
    status: 'Primero confirmaremos que tu membresía Premium o VIP esté activa.'
  }
};
const dialog = document.querySelector('#offer-dialog');
const heading = document.querySelector('#offer-title');
let lastTrigger = null;
function openOffer(key, trigger) {
  const offer = offers[key];
  if (!offer) return;
  lastTrigger = trigger;
  heading.textContent = offer.title;
  document.querySelector('#offer-price').textContent = offer.price;
  document.querySelector('#offer-description').textContent = offer.description;
  const summary = document.querySelector('#offer-summary');
  summary.replaceChildren(...offer.summary.map(text => {
    const p = document.createElement('p'); p.textContent = text; return p;
  }));
  document.querySelector('#offer-status').textContent = enrollmentReady(key) ? 'Primero guardamos tus datos para acompañarte. Este paso no realiza ningún cobro.' : offer.status + ' Vista previa: todavía no se envían datos ni se realizan pagos.';
  document.querySelector('#checkout-button').textContent = key === 'member' ? 'Acceso al programa próximamente' : 'Inscripciones desde el 26 de octubre';
  dialog.dataset.offer = key;
  prepareEnrollment(key);
  document.body.classList.add('modal-open');
  dialog.showModal();
}
function closeOffer() { dialog.close(); }
document.querySelectorAll('[data-offer]').forEach(button => button.addEventListener('click', () => openOffer(button.dataset.offer, button)));
document.querySelector('.dialog-close').addEventListener('click', closeOffer);
document.querySelector('.dialog-back').addEventListener('click', closeOffer);
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastTrigger?.focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeOffer(); } });

// Responsive emblem: labels travel with the original art, never with the CTA.
const heroArt = document.querySelector('.hero-art');
function sizeHeroArt() {
  const bounds = heroArt.getBoundingClientRect();
  const width = innerWidth <= 720 ? bounds.width * 1.75 : Math.max(bounds.width, bounds.height * 1672 / 941);
  heroArt.style.setProperty('--art-w', width + 'px');
  heroArt.style.setProperty('--art-h', width * 941 / 1672 + 'px');
}
new ResizeObserver(sizeHeroArt).observe(heroArt); sizeHeroArt();

const stationDetail = document.querySelector('#station-detail');
document.querySelectorAll('[data-station]').forEach(button => button.addEventListener('click', () => {
  const item = journeyStations.find(s => s.number === Number(button.dataset.station));
  if (!item) return;
  document.querySelectorAll('[data-station]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const fields = {'.station-mark':item.number,'.station-meta':item.date + ' · ' + item.body.toUpperCase(), 'h3':item.title,'.station-guru':item.guru,'.station-meaning':item.meaning,'.station-question':item.question};
  Object.entries(fields).forEach(([selector, text]) => stationDetail.querySelector(selector).textContent = text);
}));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let userPaused = false;
const revealElements = [...document.querySelectorAll('.intro > div,.trinity-grid article,.daily-heading,.daily-steps li,.return-note,.contemplation-copy,.journey-heading > div,.stations-block,.journey-grid article,.guide,.section-heading,.price-card,.members,.arrival-grid li,.faq-layout,.community-proof')];
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), {threshold:0.07}) : null;
revealElements.forEach(el => { el.classList.add('reveal'); if (revealObserver && !reducedMotion.matches && el.getBoundingClientRect().top > innerHeight) { el.classList.add('is-pending'); revealObserver.observe(el); } });
function updateMotion() {
  const paused = userPaused || reducedMotion.matches;
  document.body.classList.toggle('motion-running', !paused);
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = reducedMotion.matches ? 'Movimiento reducido' : paused ? 'Activar movimiento' : 'Pausar movimiento';
  motionButton.disabled = reducedMotion.matches;
  if (paused) revealElements.forEach(el => el.classList.remove('is-pending'));
}
motionButton.addEventListener('click', () => { userPaused = !userPaused; updateMotion(); });
reducedMotion.addEventListener('change', updateMotion);
updateMotion();

// Personal data is sent only by the official form after explicit submission.
// No pixels, input tracking, URL parameters or localStorage store personal data.
const enrollmentForm = document.querySelector('#enrollment-form');
const registrationConfig = window.vuelveRegistration || {captureEnabled:false,destinations:{}};
const modalityValues = {pass:'Pase · US$47 · un pago',premium:'Premium · US$37 al mes',standard:'Pase Estándar · US$37 · requiere verificación',member:'Ya soy Premium o VIP activo'};
const captureState = { pending: false, acknowledged: false, token: null };
function resetCaptureState() {
  captureState.pending = false;
  captureState.acknowledged = false;
  captureState.token = null;
  document.querySelector('.loading').hidden = true;
  document.querySelector('#checkout-button').hidden = false;
}
function enrollmentReady(key) {
  if (!registrationConfig.captureEnabled) return false;
  if (key === 'premium') return Boolean(registrationConfig.destinations.premiumAbout || registrationConfig.destinations.premium);
  if (key === 'standard') return registrationConfig.verificationEnabled === true;
  if (key === 'member') return registrationConfig.verificationEnabled === true && Boolean(registrationConfig.destinations[key]);
  return Boolean(registrationConfig.destinations[key]);
}
function prepareEnrollment(key) {
  resetCaptureState();
  document.querySelector('#enroll-modality').value = modalityValues[key];
  document.querySelector('#enrollment-success').hidden = true;
  enrollmentForm.hidden = false;
  const ready = enrollmentReady(key);
  document.querySelector('#checkout-button').disabled = !ready;
  document.querySelector('#checkout-button').textContent = ready ? (key === 'standard' ? 'Guardar y verificar mi membresía' : key === 'member' ? 'Guardar y entrar al programa' : 'Guardar y continuar al pago') : 'Inscripciones desde el 26 de octubre';
}
enrollmentForm.addEventListener('submit', event => {
  const ready = enrollmentReady(dialog.dataset.offer);
  const phone = document.querySelector('#enroll-whatsapp');
  const compact = phone.value.replace(/[ ()-]/g, '');
  phone.setCustomValidity(/^\+[1-9]\d{6,14}$/.test(compact) ? '' : 'Escribe tu WhatsApp con + y código de país.');
  if (!ready || captureState.pending || !enrollmentForm.reportValidity()) { event.preventDefault(); event.stopImmediatePropagation(); return; }
  phone.value = compact;
  captureState.pending = true;
  captureState.token = (globalThis.crypto?.randomUUID?.() || String(Date.now()) + '-' + Math.random().toString(16).slice(2));
  const submit = document.querySelector('#checkout-button');
  submit.disabled = true;
  document.querySelector('.loading').hidden = false;
  document.querySelector('#offer-status').textContent = 'Estamos enviando tus datos. Revisa la confirmación del formulario para seguir con tu modalidad. Todavía no has realizado ningún pago.';
  // CSP-safe submit: the page CSP only allows scripts from 'self', so MailerLite's webforms.min.js
  // cannot load. Post the same fields with fetch (connect-src allows assets.mailerlite.com), as the landing does.
  event.preventDefault();
  event.stopImmediatePropagation();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  fetch(enrollmentForm.action, { method: 'POST', body: new FormData(enrollmentForm), signal: controller.signal, referrerPolicy: 'no-referrer' })
    .then(r => r.json().then(j => { if (r.ok && j.success === true) window.ml_webform_success_46869291(); else throw new Error('no-ack'); }))
    .catch(() => {
      captureState.pending = false;
      document.querySelector('.loading').hidden = true;
      submit.disabled = false;
      document.querySelector('#offer-status').textContent = 'No pudimos confirmar el registro. Revisa los datos o escríbenos por WhatsApp.';
    })
    .finally(() => clearTimeout(timer));
}, true);
document.querySelector('#enroll-whatsapp').addEventListener('input', event => event.target.setCustomValidity(''));
window.ml_webform_success_46869291 = function() {
  if (!captureState.pending) return;
  captureState.pending = false;
  captureState.acknowledged = true;
  document.querySelector('#offer-status').textContent = 'Tus datos fueron recibidos. Todavía no has realizado ningún pago.';
  enrollmentForm.hidden = true;
  document.querySelector('.loading').hidden = true;
  const next = document.querySelector('#enrollment-success');
  next.hidden = false;
  document.querySelector('#enrollment-next').textContent = 'Si recibes un correo para confirmar tu dirección, pulsa su botón. Luego sigue con tu modalidad.';
  const destination = document.querySelector('#enrollment-destination');
  destination.href = registrationConfig.localConfirmationPath + '?modalidad=' + encodeURIComponent(dialog.dataset.offer);
  destination.hidden = false;
  destination.textContent = dialog.dataset.offer === 'member' ? 'Ver mi acceso incluido' : 'Continuar con mi modalidad';
  next.focus();
};

const enrollmentError = enrollmentForm.querySelector('.ml-server-error');
new MutationObserver(() => {
  if (captureState.pending && enrollmentError.textContent.trim()) {
    captureState.pending = false;
    document.querySelector('.loading').hidden = true;
    document.querySelector('#checkout-button').disabled = false;
    document.querySelector('#offer-status').textContent = 'No pudimos confirmar el registro. Revisa los datos o escríbenos por WhatsApp.';
  }
}).observe(enrollmentError, {childList:true,subtree:true,characterData:true});
