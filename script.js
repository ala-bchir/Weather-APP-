// eslint-disable-next-line no-undef
const socket = io();
socket.on('emit', (msg) => {
  console.log(msg);
  const h1 = document.getElementById('titre');
  h1.innerHTML = msg.city;
  const p = document.getElementById('p');
  p.innerHTML = msg.weather;
  const t = document.getElementById('t');
  t.innerHTML = msg.temp;
});

const date = new Date();

const dateLocale = date.toLocaleString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

document.getElementById('current_date').innerHTML = dateLocale;
