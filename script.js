'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const serchCountry = document.querySelector('.whatcountry');

///////////////////////////////////////
// https://countries-api-836d.onrender.com/countries/ //Countries API

const renderCountry = function (country, className = '') {
  const html = `<article class="country ${className}">
        <img class="country__img" alt=${country.flags.alt} src=${
    country.flags.png
  } />
        <div class="country__data">
            <h3 class="country__name">${country.name.official} (${
    Object.values(country.name)[1]
  })</h3>
            <h4 class="country__region">${country.region}</h4>
            <p class="country__row"><span>👫</span>${(
              country.population / 1000000
            ).toFixed(2)} mln people</p>
            <p class="country__row"><span>🗣️</span>${
              Object.values(country.languages)[0]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.values(country.currencies)[0].name
            }</p>
        </div>
      </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};
/*
const getCountryWithNeighbourds = function (countryName) {
  //country call AJAX 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${countryName}`);
  request.send();

  request.addEventListener('load', function () {
    //   console.log(this.responseText);
    const data = JSON.parse(this.responseText);
    const country = data[0];
    console.log(country);
    // render country 1
    renderCountry(country);
    //get neighbours
    const [neighbour] = country.borders;
    console.log(neighbour);
    if (!neighbour) return;
    //neighbour call AJAX 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();
    console.log(request2.responseText);
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2[0]);

      renderCountry(data2[0], 'neighbour');
    });
  });
};
*/
const renderError = function (msg) {
  //   countriesContainer.innerHTML = '';
  countriesContainer.insertAdjacentText('beforeend', msg);
};
serchCountry.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchValue = document.querySelector('#country').value;
  const searchThis = searchValue.trim().toLowerCase();
  countriesContainer.innerHTML = '';
  getCountry(searchThis);
});
// getCountryWithNeighbourds('poland');
// getCountry('portugal');
// const request = fetch(`https://restcountries.com/v3.1/name/poland`);
// console.log(request);
const getJSON = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errMsg}: (error:${response.status})`);
    }
    return response.json();
  });
};
const whereAmI = function (lat, lng) {
  return fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=147265429663054124807x78512`
  )
    .then(response => {
      if (!response.ok)
        throw new Error(
          `There is a problem to check geocoding ${response.status}`
        );
      return response.json();
    })
    .then(data => {
      const country = data.country;
      const city = data.city;
      return data.country.toLowerCase();
    })
    .catch(err => alert(err));
};
// const getCountry = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       console.log(response);
//       if (!response.ok) {
//         throw new Error(
//           `The ${country} wasn't found (error:${response.status})`
//         );
//       }
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbours = data[0].borders;
//       console.log(neighbours);

//       if (!neighbours) return;
//       neighbours.forEach(element => {
//         return fetch(`https://restcountries.com/v3.1/alpha/${element}`)
//           .then(response => response.json())
//           .then(data => renderCountry(data[0], 'neighbour'));
//       });
//     })
//     .catch(err => {
//       console.error(`${err}`);
//       renderError(`Something went wrong ${err}, try again.`);
//     })
//     .finally(() => (countriesContainer.style.opacity = 1));
// };
const getCountry = function (country) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    `Country ${country} wasn't found`
  )
    .then(data => {
      renderCountry(data[0]);
      const neighbours = data[0].borders;

      //   if (!neighbours) throw new Error(`Neighbour wasn't found`);
      if (!neighbours) return;
      neighbours.forEach(element => {
        return getJSON(
          `https://restcountries.com/v3.1/alpha/${element}`,
          `Neighbour ${element} wasn't found`
        ).then(data => renderCountry(data[0], 'neighbour'));
      });
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err}, try again.`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
      btn.style.opacity = 0;
    });
};
btn.addEventListener('click', function () {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      whereAmI(lat, lng).then(data => getCountry(data));
    },
    error => {
      console.error('Error getting the current position:', error.message);
    }
  );

  //   getJSON(`https://restcountries.com/v3.1/alpha/${location.slice(-2)}`)
  //     .then(data => {
  //       const country = data[0].name.common.toLowerCase();
  //       if (!country) throw new Error('Something went wrong');
  //       return country;
  //     })
  //     .then(data => getCountry(data));
});

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. 
For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS 
    coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful 
location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API 
and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided
location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. 
This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject 
the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, a
nd plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, 
    no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474
147265429663054124807x78512 
GOOD LUCK 😀
*/
// const whereAmI = function (lat, lng) {
//   fetch(
//     `https://geocode.xyz/${lat},${lng}?geoit=json&auth=147265429663054124807x78512`
//   )
//     .then(response => response.json())
//     .then(data => {
//       const country = data.country;
//       const city = data.city;
//       console.log(`You are in ${city}, ${country}`);
//       console.log(data.country);
//       return data.country.toLowerCase();
//     })
//     .catch(err => console.error(err));
// };
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
