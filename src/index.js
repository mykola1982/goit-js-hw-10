import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    inputSearchCountry: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

const notifyOptions = {
    position: 'center-center',
    width: '400px',
    fontSize: '20px',
};

refs.inputSearchCountry.addEventListener(
    'input',
    debounce(onInputSearchCountry, DEBOUNCE_DELAY)
);

function onInputSearchCountry(evt) {
    const name = evt.target.value.trim();

    fetchCountries(name)
        .then(data => {
            createMarkup(data);
        })
        .catch(error => {
            console.log(error);
            Notify.failure('Oops, there is no country with that name', notifyOptions);
            clearMarkup();
        });
}

function createMarkup(data) {
    if (data.length > 10) {
        Notify.info(
            'Too many matches found. Please enter a more specific name.',
            notifyOptions
        );
        clearMarkup();
        return;
    }
    if (data.length > 1 && data.length <= 10) {
        refs.countryInfo.innerHTML = '';

        const markupCountryList = data.map(({ name, flags }) => {
            return `<li class="country-item">
                       <img src="${flags.svg}" alt="" width="60px" height="40px"/>
                       <h3 class="country">${name.official}</h3>
                   </li>`;
        });
        refs.countryList.innerHTML = markupCountryList.join('');
        return;
    }

    if ((data.length = 1)) {
        refs.countryList.innerHTML = '';

        const { name, capital, population, flags, languages } = data[0];
        const languagesNormaleize = Object.values(languages).join(', ');

        const markupCountryInfo = ` <div class="wrapper-name-country">
                <img src="${flags.svg}" alt=""  width="60px"  height="40px" ; />
                <h1 class="country">${name.official}</h1>
            </div>
            <ul class="info-list">
                <li class ="info-item">
                    Capital:&nbsp<span> ${capital[0]}</span>
                </li>
                <li class ="info-item">
                    Population:&nbsp<span> ${population}</span>
                </li >
                <li class ="info-item">
                    Languages:&nbsp<span> ${languagesNormaleize}</span>
                </li>
            </ul>`;

        refs.countryInfo.innerHTML = markupCountryInfo;
        return;
    }
}

function clearMarkup() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}
