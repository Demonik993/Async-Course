'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// https://countries-api-836d.onrender.com/countries/ //Countries API

const request = new XMLHttpRequest();
request.open('GET', 'https://restcountries.com/v3.1/name/poland');
request.send();
console.log(request.responseText);

request.addEventListener('load', function () {
  //   console.log(this.responseText);
  const data = JSON.parse(this.responseText);
  const country = data[0];
  console.log(country);

  const html = `<article class="country">
    <img class="country__img" alt=${country.flags.alt}  src=${country.flags.png} />
    <div class="country__data">
        <h3 class="country__name">${country.name.official} (${country.name.nativeName.pol.official})</h3>
        <h4 class="country__region">${country.population} </h4>
        <p class="country__row"><span>👫</span>${country.region}</p>
        <p class="country__row"><span>🗣️</span>${country.languages.pol}</p>
        <p class="country__row"><span>💰</span>${country.currencies.PLN.name}</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
});
