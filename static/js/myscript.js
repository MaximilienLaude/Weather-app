//optenir le nom du jour
let jours = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
let newDate = new Date();
let jour = 0;
function creeDate(jour){
    let date = newDate.getDay()+jour;
    dateFinal = jours[date%7]; 
}


//optenir les coordoneret la meteo d'un lieux fournis par l'utilisateur
const OpenCage = "https://api.opencagedata.com/geocode/v1/json";
const OpenWeather = "https://api.openweathermap.org/data/2.5/onecall"
const OpenCageKey = "599efefdaf9a4f51aef20a7d62c6a24a"
const OpenWeatherKey = "fbdf674d2b1cb40b9353b7df77c51a99"

function HTTPGet(search, callback){
    const xmlHTTP = new XMLHttpRequest();
    xmlHTTP.onreadystatechange = function(){
        if(xmlHTTP.readyState === 4) {callback(JSON.parse(xmlHTTP.responseText))}
    };
    xmlHTTP.open("GET", OpenCage+"?key="+OpenCageKey+"&q="+search);
    xmlHTTP.send(null);
};

function getMeteo(callback){
    const xmlHTTP2 = new XMLHttpRequest();
    xmlHTTP2.onreadystatechange = function(){
        if(xmlHTTP2.readyState === 4) {callback(JSON.parse(xmlHTTP2.responseText))}
    };
    xmlHTTP2.open("GET", OpenWeather+"?lat="+lat+"&lon="+lng+"&appid="+OpenWeatherKey);
    xmlHTTP2.send(null);
}

function createDiv(i){
    document.getElementById("div").appendChild(document.createElement("div")).setAttribute("id", i);
    document.getElementById(i).appendChild(document.createElement("h2")).setAttribute("id", "h"+i);
    document.getElementById("h"+i).innerHTML = dateFinal;
    document.getElementById(i).appendChild(document.createElement("img")).setAttribute("id", "img"+i);
};

function fillDiv(location, i){
    document.getElementById("img"+i).setAttribute("src", "static/images/"+location);
};

function chooseLogo(meteo, nuage, i){
    if(meteo == "Clear"){fillDiv("sun.svg", i)}
    else if(meteo == "Clouds"){
        if(nuage > 50){fillDiv("clouds.svg", i)}
        else{fillDiv("cloudy.svg", i)}
    }
    else if(meteo == "Snow"){fillDiv("snow.svg", i)}
    else{fillDiv("rain.svg", i)}
};

function nuit(data){
    let dayTime = data.current.dt
    let sunrise = data.current.sunrise
    let sunset = data.current.sunset
    if (sunset < dayTime == true && dayTime < sunrise == true){
        document.getElementById("body").setAttribute("class", "nuit")
    };
}

function Jour1(data){
    creeDate(0);
    createDiv(0);
    meteo = data.current.weather[0].main;
    nuage = data.current.clouds;
    if(meteo == "Clear"){fillDiv("sun.svg", 0)}
    else if(meteo == "Clouds"){
        if(nuage > 50){fillDiv("clouds.svg", 0)}
        else{fillDiv("cloudy.svg", 0)}
    }
    else if(meteo == "Snow"){fillDiv("snow.svg", 0)}
    else{fillDiv("rain.svg", 0)}
};

function getSelectValue(selectId){
    var selectElmt = document.getElementById(selectId);
    selectElmt.options
	selectElmt.selectedIndex
    return selectElmt.options[selectElmt.selectedIndex].value;
}

function dataMeteo(data){
    let i = 0
    var n = getSelectValue('select');
    for (i=1; i < n ; i++){
        creeDate(i);
        createDiv(i);
        meteo = data.daily[i-1].weather[0].main;
        nuage = data.daily[i-1].clouds;
        chooseLogo(meteo, nuage, i);
    };
};

function stockData(data){
    lat = data.results[0].geometry.lat;
    lng = data.results[0].geometry.lng;
    getMeteo(Jour1);
    getMeteo(dataMeteo);
    getMeteo(nuit)
}


//fabrication et affichage des info meteo   
document.getElementById("boutton").addEventListener("click", function(){
    let coord = document.getElementById("ville").value;
    HTTPGet(coord, stockData);
})
