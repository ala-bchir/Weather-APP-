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
server.listen(3000, function(){
  console.log('Server running at https://127.0.0.1:3000/');
})





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
              'x-rapidapi-key': 'b209e27b05mshe18481996bba2b3p105839jsn442355d06914',
              useQueryString: true
            }
          };
          
          
          
          
          
        request(options,async function (error, response, body) {
        if (error) throw new Error(error);
        let jo = JSON.parse(body); // convert body to a json object
        
        let cityName = jo.list[0].name
        let weather_status = jo.list[0].weather[0].description
        let temp = Math.floor((jo.list[0].main.temp)- 273.15)+' C°'
        console.log(cityName,weather_status,temp)
        io.emit('emit', {'city':cityName,'weather':weather_status,'temp':temp})
        await sleep(30000)
            
        })
    
            
            
        
    }
    socket.on('disconnect', ()=>{
        console.log('disconnected')
        
    })
});









