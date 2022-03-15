const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
let request = require('request');

app.get("/", function(req,res){
    res.sendFile(__dirname + '/index.html')
})


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// sleep fct allows to send a request every "n" milliseconds
function sleep(n) {
    const start = Date.now();
    while (Date.now() - start < n);
}

let cities = ["casablanca", "tunis", "paris"];



// const Id = setInterval(()=>{


    

//       if(i == 4) clearInterval(Id);

//       i++
// },1000)

for(let city of cities){

    const options = {
        method: 'GET',
        url: 'https://community-open-weather-map.p.rapidapi.com/find',
        qs: {
          q: city,
          cnt: '1',
          mode: 'null',
          lon: '0',
          type: 'link, accurate',
          lat: '0',
          units: 'imperial, metric'
        },
        headers: {
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
          'x-rapidapi-key': '8a345fcc6amshe00c0e37b584ee8p13a2e9jsn8eafe56699c5',
          useQueryString: true
        }
      };
      
      
      
      
      
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
          let jo = JSON.parse(body); // convert body to a json object
          
            
    
          let cityName = jo.list[0].name;
          let weather_status = jo.list[0].weather[0].main;
          console.log(cityName,weather_status);
          sleep(3000)
      
          
          io.on('connection', (socket)=>{
              console.log('connected')
              socket.on('disconnect', ()=>{
                  console.log('disconnected')
                  
              })
              io.emit('city', cityName)
              io.emit('status', weather_status)
              
              
          })
      
          
          
      });
}







server.listen(3000, function(){
  console.log('Server running at https://127.0.0.1:3000/');
})
