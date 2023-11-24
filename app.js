window.addEventListener("load", () =>{

    const AP1_KEY = "91708598cfe80c01a2b7c3a05968e6aa"

const submitButton = document.querySelector(".submit-btn")
let nameInput = document.querySelector("#name-input")
let cityInput = document.querySelector("#city-input")
let countryInput = document.querySelector("#country-input")
const weatherCardsDiv = document.querySelector(".weather-cards")
const currenWeatherDiv = document.querySelector(".current-weather")
let paragph = document.querySelector(".fact")


const createWeatherCard = (cityName, weatherItem, fullName, countryCode, index) => {
    if(index === 0){
      
       return `<div class="details">
       <h2>${fullName}</h2>
       <h2>${countryCode}</h2>
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        <h4>Visibility: ${weatherItem.visibility}M</h4>
        <h4>Pressure: ${weatherItem.main.pressure}hPa</h4>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"alt="weather icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`
    
    }else{
        return ` <li class="card">
        <h3> (${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"alt="weather icon">
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        <h4>Visibility: ${weatherItem.visibility}M</h4>
        <h>Pressure: ${weatherItem.main.pressure}hPa</h4>
        </li>
        `;
        
    }

    } 
 
async function getLocationCoordinates() {
    try{
        const fullName = nameInput.value.trim().toUpperCase()
    const cityName = cityInput.value.trim().toUpperCase()
    const countryCode = countryInput.value.trim().toUpperCase()
    if (!cityName || !countryCode) return alert("put in city and country")
    const GEO_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=1&appid=${AP1_KEY}`

    fetch(GEO_URL).then(res => res.json()).then(data => {
        if(!data) return alert(`no coordinate for ${cityName}`)
        const {name,lat,lon} = data[0];

        getWeatherDetails(cityName, fullName, countryCode, lat, lon);

         fetch(`https://restcountries.com/v3.1/name/${countryCode}`).then(res =>res.json()).then(dataa => {
            let x = dataa[0]
            paragph.textContent = (`The Capital of ${x.name.common} is ${x.capital}, It is in the ${x.continents} continent. Thier Population is ${x.population}.  `) 
               
        })
    })

    }

    catch(error){
        alert("An error ocuurred while fetching the coordinates")
    }
        
}

async  function getWeatherDetails(cityName, fullName, countryCode, lat, lon) {
    try{
        let weatherUrl_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${AP1_KEY}`
   fetch(weatherUrl_API).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];
        const daysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
               
            } 
        });
        

        cityInput.value = "";
        currenWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        nameInput.value = "";
        countryInput.value = "";
 
        daysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currenWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem, fullName, countryCode, index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName,weatherItem, fullName, countryCode, index));
            }

            
        });
    })
    }
    catch(error){alert("An Error occur while fetching weather details")}
    
      
        
}

submitButton.addEventListener("click", (e)=> {
    e.preventDefault();
    getLocationCoordinates();
   
} )
})