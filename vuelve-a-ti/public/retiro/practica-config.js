/* Práctica de hoy · retiro Del 11 al Uno (14 al 24 de noviembre de 2026).
   Se sirve en /retiro/practica. Cambiar un video aquí NO exige tocar practica.html.

   CÓMO PONER LOS VIDEOS
   1) La práctica grabada (la misma los once días): pega el id de YouTube (11 caracteres,
      lo que va después de "watch?v=" o "youtu.be/") en practicaGrabada.youtube,
      y su duración real en segundos en practicaGrabada.duracionSeg.
      Si prefieres Bunny, deja youtube vacío y pega en practicaGrabada.bunny la URL del
      reproductor (https://iframe.mediadelivery.net/embed/BIBLIOTECA/VIDEO).
   2) La grabación de un encuentro en vivo (días 1, 5 y 11, sesión de las 20:00): rellena
      youtube (o bunny) y duracionSeg en la línea '20:00' de ese día.
   3) Para cambiar un video solo un día, agrega a ese día:
        practica: {youtube: 'XXXXXXXXXXX', duracionSeg: 1500}
      o, para una sola sesión:
        '13:00': {tipo: 'video', youtube: 'XXXXXXXXXXX', duracionSeg: 1500}
   Con el id vacío la página no muestra reproductor: manda a la lección del día.

   Las horas son de Chile (UTC-3 en noviembre). Un encuentro tipo 'zoom' muestra el botón
   desde 30 minutos antes hasta 90 minutos después de la hora. */
window.RETIRO_PRACTICA = {
  curso: 'https://www.skool.com/portal-origen-5852/classroom/a4167109',
  calendario: 'https://www.skool.com/portal-origen-5852/calendar',
  utcChile: -3,
  horas: ['13:00', '20:00'],

  practicaGrabada: {youtube: '', bunny: '', duracionSeg: 1500},

  dias: [
    {dia: 1, fecha: '2026-11-14', cuerpo: 'El once', palabra: 'Integración', llave: '',
      '13:00': {tipo: 'zoom', url: '/sabado'},
      '20:00': {tipo: 'video', youtube: 'xhpvHw4zstw', bunny: '', duracionSeg: 4325}},
    {dia: 2, fecha: '2026-11-15', cuerpo: 'Cuerpo radiante', palabra: 'Coraje', llave: '',
      practica: {youtube: 'z2wrbzGE8HQ', duracionSeg: 1914}},
    {dia: 3, fecha: '2026-11-16', cuerpo: 'Cuerpo sutil', palabra: 'Sutileza', llave: '',
      practica: {youtube: 'uoUd_c9oryg', duracionSeg: 1901}},
    {dia: 4, fecha: '2026-11-17', cuerpo: 'Cuerpo pránico', palabra: 'Pureza', llave: '',
      practica: {youtube: 'scGKJfTr7zU', duracionSeg: 1888}},
    {dia: 5, fecha: '2026-11-18', cuerpo: 'Aura', palabra: 'Compasión', llave: '',
      '13:00': {tipo: 'zoom', url: '/vivo'},
      '20:00': {tipo: 'video', youtube: 'kyxGMvuYZZA', bunny: '', duracionSeg: 3483}},
    {dia: 6, fecha: '2026-11-19', cuerpo: 'Línea de arco', palabra: 'Enfoque', llave: '',
      practica: {youtube: 'wXSKIiTW0PM', duracionSeg: 1853}},
    {dia: 7, fecha: '2026-11-20', cuerpo: 'Cuerpo físico', palabra: 'Equilibrio', llave: '',
      practica: {youtube: 'VbtAQ7TV8_o', duracionSeg: 1872}},
    {dia: 8, fecha: '2026-11-21', cuerpo: 'Mente neutral', palabra: 'Servicio', llave: '',
      practica: {youtube: 'umepx5UYzIw', duracionSeg: 1882}},
    {dia: 9, fecha: '2026-11-22', cuerpo: 'Mente positiva', palabra: 'Apertura', llave: '',
      practica: {youtube: 'z7TaPZgQo6c', duracionSeg: 1891}},
    {dia: 10, fecha: '2026-11-23', cuerpo: 'Mente protectora', palabra: 'Discernimiento', llave: '',
      practica: {youtube: 'mwl6UTqt51o', duracionSeg: 1892}},
    {dia: 11, fecha: '2026-11-24', cuerpo: 'Alma', palabra: 'Humildad', llave: '',
      '13:00': {tipo: 'zoom', url: '/vivo'},
      '20:00': {tipo: 'video', youtube: 'xjC5gsbuLdA', bunny: '', duracionSeg: 5012}}
  ]
};
