import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
input.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));

function inputSearch(event) {
  event.preventDefault;
  if (!event.target.value.trim()) {
      countryList.innerHTML = '';
       countryInfo.innerHTML ='';
      return;
  }
  fetchCountries(event.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 2) {
          countryInfo.innerHTML ='';
        const dataMarkup = data
          .map(({ name, flags }) => {
            return ` <li class="country-item"><img class="country-img" width="25"  src="${flags.svg}" alt="flag of ${name.official}" /><h3>${name.official}</h3></li> `;
          })
          .join('');
        countryList.innerHTML = dataMarkup;
        
      } else if ((data.length = 1)) {
        countryList.innerHTML = '';
        const dataMarkup = data
          .map(({ name, flags, capital, population, languages }) => {
            return `<img class="info-img" width="200" src="${
              flags.svg
            }" alt="flag of ${name.official}" />
                          <h2>${name.official}</h2>
                       <h3>Capital: ${capital}</h3>
    <h3>Population: ${population}</h3>
    <h3>Languages: ${Object.values(languages)}</h3> `;
          })
          .join('');
        countryInfo.innerHTML = dataMarkup;
       
      }
    })
      .catch(error => {
        countryList.innerHTML = '';
       countryInfo.innerHTML ='';
          return Notify.failure('Oops, there is no country with that name')
      });
}

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
