//main import -> express
import express from "express";
//module imports
import bodyParser from "body-parser";
import axios from "axios";
//import config variables, edit config.js if you haven't yet
import {api_key, website_url} from "./config.js";
import QRCode from 'qrcode'

const app = express();
const port = 3000;

//use public folder for static files
app.use(express.static("public"));
//use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/",async(req,res)=>{
  res.render("index.ejs",{starterPage : true , locationAllowed: true});
});

app.post("/weatherbylocation",async(req,res)=>{
    //query data from client request
    const latitude = req.query.latitude;
    const longitude =  req.query.longitude;
    try {
        //get json data with axios from the api servers
        const provinceData = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        const cityName = String(provinceData.data.address.province);
        const countryName = String(provinceData.data.address.country);
        const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const currentWeatherData = currentWeather.data;
        const dailyWeather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const dailyWeatherData = dailyWeather.data;
        const url = await QRCode.toDataURL( website_url + '/qrweather/?latitude=' + latitude + '&longitude=' + longitude);
        //send data and render index.ejs
        res.render("index.ejs",{weatherByLocation : true,cityName : (cityName.split(','))[0], currentWeatherData : currentWeatherData, dailyWeatherData : dailyWeatherData, countryName : countryName, current_lat: latitude, current_long:longitude, data_url : url})
    } catch (error) {
        //send error if there is an error and render index.ejs
        res.render("index.ejs", { errorMessage: error });
    }
});

app.post("/weatherbycity",async(req,res)=>{

    //body element data (available with body-parser) from client request
    const cityName =  req.body["city"];
    

    try {
        //get json data with axios from the api servers
        const provinceData = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`);
        const parsedData = provinceData.data;
        const city = String(parsedData[0].name);
        const latitude = String(parsedData[0].lat);
        const longitude = String(parsedData[0].lon);
        const countryName = String(parsedData[0].country);
        const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const currentWeatherData = currentWeather.data;
        const dailyWeather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const dailyWeatherData = dailyWeather.data;
        const url = await QRCode.toDataURL( website_url + '/qrweather/?latitude=' + latitude + '&longitude=' + longitude);
        //send data and render index.ejs
        res.render("index.ejs",{weatherByCity : true, cityName : city, currentWeatherData : currentWeatherData, dailyWeatherData : dailyWeatherData, countryName : countryName , current_lat: latitude, current_long:longitude, data_url : url})
    } catch (error) {
        //send error if there is an error and render index.ejs
        res.render("index.ejs", { errorMessage: error });
    }
    
});

app.get("/qrweather",async(req,res)=>{
    //query data from client request
    const latitude = req.query.latitude;
    const longitude =  req.query.longitude;
    try {
        //get json data with axios from the api servers
        const provinceData = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        const cityName = String(provinceData.data.address.province);
        const countryName = String(provinceData.data.address.country);
        const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const currentWeatherData = currentWeather.data;
        const dailyWeather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const dailyWeatherData = dailyWeather.data;
        //send data and render index.ejs
        res.render("index.ejs",{weatherByQr : true,cityName : (cityName.split(','))[0], currentWeatherData : currentWeatherData, dailyWeatherData : dailyWeatherData, countryName : countryName })
    } catch (error) {
        //send error if there is an error and render index.ejs
        res.render("index.ejs", { errorMessage: error });
    }
});

//broadcast from the selected port (3000)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  