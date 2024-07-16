const express = require("express");
const app = express();
const https = require("https")
const bodyParser = require("body-parser");
const path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('Views directory:', app.get('views')); 
app.get("/", (req, res) => {
    res.render("index", { t: null });
})

app.post("/", async (req, res) => {
    try{ const key = req.body.cityName;
        // const url="https://api.openweathermap.org/data/2.5/weather?q=Pune"&callback=test&appid=542885aff3ed68bbe340ef4a8a40ed30";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + key + "&appid=542885aff3ed68bbe340ef4a8a40ed30&units=metric"
    
        https.get(url, (response) => {
            console.log(response.statusCode);
    
            response.on("data", (data) => {
                const d = JSON.parse(data);
                if(d && d.main){
                const t = d.main.temp;
                const f = d.weather[0].description;
                const icon = d.weather[0].icon;
                //    console.log(d)
                const imagurl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
                res.render('index', { t, f, key, imagurl })
                }
                else{
                    res.send("Sorry,Weather is not available for your city")
                }
            })
        })
    }
    catch(err){
        res.send(err);
    } 
})
const port = process.env.PORT || 1400;
app.listen(port, () => {
    console.log("i am back ");
})