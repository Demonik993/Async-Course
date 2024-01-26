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
    country.name.common
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
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=147265429663054124807x78512`
      );
    })
    .then(response => {
      if (!response.ok)
        throw new Error(
          `There is a problem to check geocoding ${response.status}`
        );
      return response.json();
    })
    .then(data => {
      return data.country.toLowerCase();
    })
    .then(country => getCountry(country))
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
btn.addEventListener('click', whereAmI);
// function () {
//   navigator.geolocation.getCurrentPosition(
//     position => {
//       const lat = position.coords.latitude;
//       const lng = position.coords.longitude;
//   whereAmI().then(data => getCountry(data));
// },
// error => {
//   console.error('Error getting the current position:', error.message);
// });

//   getJSON(`https://restcountries.com/v3.1/alpha/${location.slice(-2)}`)
//     .then(data => {
//       const country = data[0].name.common.toLowerCase();
//       if (!country) throw new Error('Something went wrong');
//       return country;
//     })
//     .then(data => getCountry(data));
// });

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

// // new Promise:

// const promiseLottery = new Promise(function (resolve, reject) {
//   console.log('Lottery is run...');
//   setTimeout(function () {
//     if (Math.random() >= 0.5) resolve('You win ');
//     else reject(new Error('You lost'));
//   }, 2000);
// });
// promiseLottery.then(res => console.log(res)).catch(err => console.error(err));

// //Promising setTimeOut
const wait = seconds => {
  return new Promise(res => setTimeout(res, seconds * 1000));
};
// wait(2)
//   .then(() => {
//     console.log('Waited 2 seconds');
//     return wait(3);
//   })
//   .then(() => console.log('I waited for 3 seconds'));
// // to call promise imediately - put it in micro line
// Promise.resolve('abc').then(res => console.log(res));
// Promise.reject(new Error('f**ck this')).catch(res => console.error(res));
///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on
 your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a 
new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is 
done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should
 be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools 
Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/
serchCountry.innerHTML = '';
countriesContainer.innerHTML = '';
btn.remove();
const imgContainer = document.querySelector('.images');

const createImage = function (url) {
  return new Promise(function (res, rej) {
    const img = document.createElement('img');
    img.src = url;
    // img.classList.add = 'images';
    // if (img) res(body.appendChild(img));
    // else rej(new Error(`Can't load this shit`));
    img.addEventListener('load', () => {
      imgContainer.append(img);
      res(img);
    });
    img.addEventListener('error', () => {
      rej(new Error('Image not found'));
    });
  });
};
// createImage('img/img-1.jpg')
//   .then(img => console.log('Img loaded'))
//   .catch(err => console.error(err));
// createImage('img/img-4.jpg')
//   .then(img => console.log('Img loaded'))
//   .catch(err => console.error(err));
// createImage('img/img-2.jpg');
// createImage('img/img-3.png');
let currentImg;
createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log(`Img 1 loaded`);
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log(`Img 2 loaded`);
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log(`Img 3 loaded`);
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-4.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log(`Img 4 loaded`);
    return wait(2);
  })
  .catch(err => console.error(err));
