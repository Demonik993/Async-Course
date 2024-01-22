'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const serchCountry = document.querySelector('.whatcountry');

///////////////////////////////////////
// https://countries-api-836d.onrender.com/countries/ //Countries API

const renderCountry = function (country) {
  const html = `<article class="country">
        <img class="country__img" alt=${country.flags.alt}  src=${
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
  countriesContainer.style.opacity = 1;
};

const getCountryWithNeighbourds = function (countryName) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${countryName}`);
  request.send();
  console.log(request.responseText);

  request.addEventListener('load', function () {
    //   console.log(this.responseText);
    const data = JSON.parse(this.responseText);
    const country = data[0];
    console.log(country);

    renderCountry(country);
  });
};
serchCountry.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchValue = document.querySelector('#country').value;
  const searchThis = searchValue.trim().toLowerCase();
  countriesContainer.innerHTML = '';
  getCountryWithNeighbourds(searchThis);

  console.log(searchThis);
});
// getCountry('usa');
// getCountry('portugal');
