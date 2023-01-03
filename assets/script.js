//global variables 
var apiKey = '964e5f167554db8244f18278f0957f32'
var ApiRootUrl = 'https://api.openweathermap.org';
var cityHistory = [];

// DOM element references
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayBlock = document.querySelector('#today');
var forecastBlock = document.querySelector('#forecast');
var searchHistoryBlock = document.querySelector('#history');


// fetch the weather via the API
function cityWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var URL = `${ApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(URL)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        showItems(city,data);
    })
    .catch(function (err) {
        console.error(err);
    })
}

function getCoordinates(search) {
    var URL = `${ApiRootUrl}/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(URL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        cityWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function emptySearchSubmit(e) {
    if (!searchInput.value) {
        return;
    }
    e.preventDefault();
    var search = searchInput.value.trim();
    getCoordinates(search);
    searchInput.value = '';
}

function showCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  var temperatureF = weather.main.temp;
  var windMPH = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var temp = document.createElement('p');
  var wind = document.createElement('p');
  var humidity = document.createElement('p');

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  heading.setAttribute('class', 'h3 card-title');
  temp.setAttribute('class', 'card-text');
  wind.setAttribute('class', 'card-text');
  humidity.setAttribute('class', 'card-text');

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  temp.textContent = `Temp: ${temperatureF}°F`;
  wind.textContent = `Wind: ${windMPH} MPH`;
  humidity.textContent = `Humidity: ${humidity} %`;
  cardBody.append(heading, temp, wind, humidity);

  todayContainer.innerHTML = '';
  todayContainer.append(card);
};

function showForecast(dailyForecast) {
  var startDate = dayjs().add(1, 'day').startOf('day').unix();
  var endDate = dayjs().add(6, 'day').startOf('day').unix();

  var headingCol = document.createElement('div');
  var heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12')
  heading.textContent = '5-day Forecast:';
  headingCol.append(heading);
  forecastBlock.innerHTML = '';
  forecastBlock.append(headingCol);

  for (var i = 0; i < dailyForecast.length; i++) {
    if (dailyForecast[i].dt >= startDate && dailyForecast [i].dt <endDate) {
      if (dailyForecast[i].dt_txt.slice(11,13) == "12") {
        forecastCard(dailyForecast[i]);
      }
    }
  }

};

function showItems(city, data) {
  showCurrentWeather(city, data.list[0], data.city.timezone);
  showForecast(data.list);
}


// daily forecast
function forecastCard(forecast) {
  var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iconDescription = forecast.weather[0].description;
  var temperatureF = forecast.main.temp;
  var humidity = forecast.main.humidity;
  var windMPH = forecast.wind.speed;

  // Create elements for a card
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var temp = document.createElement('p');
  var wind = document.createElement('p');
  var humidity = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, temp, wind, humidity);

  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  temp.setAttribute('class', 'card-text');
  wind.setAttribute('class', 'card-text');
  humidity.setAttribute('class', 'card-text');

  // Add content to elements
  cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  temp.textContent = `Temp: ${temperatureF} °F`;
  wind.textContent = `Wind: ${windMPH} MPH`;
  humidity.textContent = `Humidity: ${humidity} %`;

  forecastContainer.append(col);
}



searchForm.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);