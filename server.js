const express = require('express');

const app = express();
const http = require('http');

const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);

const request = require('request');

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});
server.listen(3000, () => {
  console.log('Server running at https://127.0.0.1:3000/');
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const cities = ['Casablanca', 'Paris', 'Monastir', 'Sousse', 'Toulouse', 'Mahdia', 'Dijon', 'Marseille'];

function extract() {
  const options = {
    method: 'GET',
    url: 'https://community-open-weather-map.p.rapidapi.com/find',
    qs: {
      q: cities[getRandomInt((cities.length) - 1)],
      cnt: '1',
      mode: 'null',
      lon: '0',
      type: 'link, accurate',
      lat: '0',
      units: 'imperial, metric',
    },
    headers: {
      'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
      'x-rapidapi-key': 'b209e27b05mshe18481996bba2b3p105839jsn442355d06914',
      useQueryString: true,
    },
  };

  request(options, async (error, response, body) => {
    if (error) throw new Error(error);
    const jo = JSON.parse(body); // convert body to a json object

    const cityName = jo.list[0].name;
    const weatherStatus = jo.list[0].weather[0].description;
    const temp = `${Math.floor((jo.list[0].main.temp) - 273.15)} C°`;
    // console.log(cityName, weatherStatus, temp);
    io.emit('emit', { city: cityName, weather: weatherStatus, temp });
  });
}

io.on('connection', (socket) => {
  console.log('connected');

  // eslint-disable-next-line no-unused-vars
  const intervalID = setInterval(extract, 30000);

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
