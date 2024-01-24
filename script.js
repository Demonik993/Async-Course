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
    .finally(() => (countriesContainer.style.opacity = 1));
};
btn.addEventListener('click', function () {
  const location = navigator.language;
  getJSON(`https://restcountries.com/v3.1/alpha/${location.slice(-2)}`)
    .then(data => {
      const country = data[0].name.common.toLowerCase();
      if (!country) throw new Error('Something went wrong');
      return country;
    })
    .then(data => getCountry(data));
});
