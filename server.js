const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
let request = require('request');

app.use("/",express.static(__dirname))

app.get("/", function(req,res){
    res.sendFile(__dirname + '/index.html')

})



// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }

// sleep fct allows to send a request every "n" milliseconds
function sleep(n) {
    const start = Date.now();
    while (Date.now() - start < n);
}

let cities = ["Casablanca",  "Paris","Monastir","Sousse","Toulouse","Mahdia","Dijon","Marseille"];




io.on('connection', (socket)=>{
    console.log('connected')
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
              'x-rapidapi-key': '82769fa3e5mshf3f542b33552eafp1b810fjsn27353da6bdf5',
              useQueryString: true
            }
          };
          
          
          
          
          
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let jo = JSON.parse(body); // convert body to a json object
        // console.log(body)
        let cityName = jo.list[0].name
        let weather_status = jo.list[0].weather[0].description
        let temp = Math.floor((jo.list[0].main.temp)- 273.15)+' C°'
        // console.log(cityName,temp)
        io.emit('status', weather_status)
        io.emit('temperature',temp)
        io.emit('city', cityName)
        sleep(30000)
            
        })
    
            
            
        
    }
    socket.on('disconnect', ()=>{
        console.log('disconnected')
        
    })
});









server.listen(3000, function(){
  console.log('Server running at https://127.0.0.1:3000/');
})