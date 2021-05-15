//gets result for search box
getAddressSearchValue();
function getAddressSearchValue() {
  const searchButton = document.querySelector('.search__button');

  searchButton.addEventListener('click', function () {
    event.preventDefault();
    let searchFor = document.querySelector('.search__input').value;
    getGeoLocation(searchFor);
  });
}

//

//get geolocation latitude and longitude
const getGeoLocation = async function (address) {
  let locationGeo;
  let locationDataFor;
  try {
    //fetch geo location
    let getGeo = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA8-bJwYvWll9l7TwFW5b9TiJ9HMWPDljU`
    );
    //parse data
    let geoData = await getGeo.json();
    console.log(geoData);
    locationDataFor = geoData.results[0].formatted_address;
    console.log(locationDataFor);
    //catch errors
    if (geoData.status != 'OK') {
      throw new Error();
    }
    // get latitude and longitude
    locationGeo = geoData.results[0].geometry.location;
  } catch (error) {
    let selectContainer = document.querySelector(`.container`);
    let html = `<p id="geo_error">Please enter a valid town</p>`;
    selectContainer.insertAdjacentHTML('afterbegin', html);
  }
  //get weather according to location
  getWeather(locationGeo);
  renderLocationTitle(locationDataFor);
};

//get weather
getWeather = async function (location) {
  try {
    //get weather using latitute and longitute from geo location
    let getWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely&units=metric&appid=ce96bebb0d2a102f5cda8e9f1d1b7c58`
    );
    //parse weather data
    let weatherData = await getWeather.json();
    console.log(weatherData);
    if (weatherData.cod === '400') {
      throw new Error();
    }

    //render weather data
    renderWeatherData(weatherData);
  } catch (error) {
    let selectColumn = document.querySelector(`.container`);
    let html = `<p id="weather_error">Error getting location</p>`;
    selectColumn.insertAdjacentHTML('afterbegin', html);
  }
};

function renderLocationTitle(location) {
  let selectColumn = document.querySelector(`.container`);
  let html = `<p id="location">Weather for ${location}</p>`;
  selectColumn.insertAdjacentHTML('afterbegin', html);
}

//render weather data
function renderWeatherData(weatherData) {
  //removes error messages if required
  let geoError = document.getElementById('geo_error');
  if (geoError) {
    geoError.remove();
  }

  let weatherError = document.getElementById('weather_error');
  if (weatherError) {
    weatherError.remove();
  }

  //render date
  for (let i = 0; i < 7; i++) {
    let weather = weatherData.daily[0].dt;
    let date = new Date((weather + i * 86400) * 1000).toString().slice(0, 10);
    let selectColumn = document.querySelector(`.a${i}col`);
    let html = `<b>${date}</b>&nbsp: &nbsp&nbsp`;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //render weather max temp
    weather = Math.floor(weatherData.daily[`${i}`].temp.max);
    selectColumn = document.querySelector(`.a${i}col`);
    html = `Max &nbsp${weather} &deg C &nbsp&nbsp&nbsp`;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //render max temp
    weather = weatherData.daily[`${i}`].weather[0].main;
    selectColumn = document.querySelector(`.a${i}col`);
    html = `${weather} `;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //render max temp
    weather = weatherData.daily[`${i}`].weather[0].icon;
    selectColumn = document.querySelector(`.a${i}col`);
    html = `<img src="http://openweathermap.org/img/wn/${weather}@2x.png">`;
    selectColumn.insertAdjacentHTML('beforeend', html);

    //set weather display to visable
    document.querySelector('.row').style.visibility = 'visible';

    removeSearchFunction();
  }
}

//remove search button to stop rendering issues
function removeSearchFunction() {
  let searchButton = document.querySelector('.search__form');
  let searhHtml = `<input type="text" placeholder="" class="search__input"/>
                  <button class="btn search__dead">Reset</button>'`;
  searchButton.innerHTML = searhHtml;

  searchButton.addEventListener('click', function () {
    const searchButton = document.querySelector('.search__button');
  });
}
