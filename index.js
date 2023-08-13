import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import {api_key} from "./config.js";
import pkg from 'qr-image';
const {pkg} = pkg;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/",async(req,res)=>{
  res.render("index.ejs",{starterPage : true , locationAllowed: true});
});

app.post("/weatherbylocation",async(req,res)=>{
    const latitude = req.query.latitude;
    const longitude =  req.query.longitude;
    try {
        const provinceData = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        const cityName = String(provinceData.data.address.province);
        const countryName = String(provinceData.data.address.country);
        const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const currentWeatherData = currentWeather.data;
        const dailyWeather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const dailyWeatherData = dailyWeather.data;
        res.render("index.ejs",{weatherByLocation : true,cityName : (cityName.split(','))[0], currentWeatherData : currentWeatherData, dailyWeatherData : dailyWeatherData, countryName : countryName, current_lat: latitude, current_long:longitude})
    } catch (error) {
        res.render("index.ejs", { errorMessage: error });
    }
});

app.post("/weatherbycity",async(req,res)=>{

    const cityName =  req.body["city"];


    try {
        const provinceData = await axios.get(`https://geocode.maps.co/search?q=${cityName}`);
        const parsedData = provinceData.data;
        const city = String(parsedData[0].display_name);
        const latitude = String(parsedData[0].lat);
        const longitude = String(parsedData[0].lon);
        const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const currentWeatherData = currentWeather.data;
        const dailyWeather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const dailyWeatherData = dailyWeather.data;
        res.render("index.ejs",{weatherByCity : true, cityName : (city.split(','))[0], currentWeatherData : currentWeatherData, dailyWeatherData : dailyWeatherData, countryName : (city.split(','))[-1] , current_lat: latitude, current_long:longitude})
    } catch (error) {
        res.render("index.ejs", { errorMessage: error });
    }
    
});

/*app.get("/qrweather",async(req,res)=>{
    const latitude = req.query.latitude;
    const longitude =  req.query.longitude;
    try {
        const provinceData = await axios.get(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        const cityName = String(provinceData.data.address.province);
        const countryName = String(provinceData.data.address.country);
        const currentWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`);
        const currentWeatherData = currentWeather.data;
        const dailyWeather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const dailyWeatherData = dailyWeather.data;
        res.render("index.ejs",{weatherByLocation : true,cityName : (cityName.split(','))[0], currentWeatherData : currentWeatherData, dailyWeatherData : dailyWeatherData, countryName : countryName })
    } catch (error) {
        res.render("index.ejs", { errorMessage: error });
    }
});*/

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  