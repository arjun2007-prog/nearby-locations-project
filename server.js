require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser")
const http = require("https");
const { access } = require("fs");
const request = require('request');
let accessToken;
let nearbyplaces;

const app = express();
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended:true}));

let clientId = process.env.CLIENT_ID;
let clientSecret = process.env.CLIENT_SECRET;
let apiKey = process.env.API_KEY;

let longitude;
let latitude;
let place; 

app.route("/")
   .get((req,res)=>{
    //Here we get our bearer key for the authorization 
    //We are calling a function that is gonna get us a new key for making futher api calls
    const url = "https://outpost.mapmyindia.com/api/security/oauth/token?grant_type=client_credentials&client_id=" + clientId + "&client_secret=" + clientSecret ;
    options ={
      method:"POST"
    }
  
    const sendData = http.request(url,options,(response)=>{
         console.log(response);
         response.on("data",(data)=>{
           data = JSON.parse(data)
           accessToken = data.access_token
           console.log(accessToken);
         })
    })
    sendData.end();
    res.render("home")

   })
   .post((req,res)=>{
       console.log(req.body); 
       longitude = parseFloat(req.body.longitude);
       latitude = parseFloat(req.body.latitude);
       place = req.body.place

       console.log(longitude,latitude);
       res.redirect("/nearby")
   })


app.route("/nearby")
   .get((req,res)=>{
     console.log("IN");
     const url = "https://atlas.mapmyindia.com/api/places/nearby/json?keywords=" + place + "&refLocation=" + latitude + "," + longitude
     console.log(url);
     console.log(accessToken);
     const object = {
       method:"GET",
       url: url,
       headers :{
        Authorization: "Bearer " + accessToken,
       }
       
     }

      request(object,(err,response,body)=>{
        let nearbyplaces = JSON.parse(body);
        // res.send(nearbyplaces)
        console.log(nearbyplaces);
     })

    })


app.listen(process.env.PORT || 3000,()=>{
    console.log("Sucessfully hosted the files on the port 3000.");
})