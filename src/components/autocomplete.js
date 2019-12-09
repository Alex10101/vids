import { getData } from 'store/data';

export default function setAutocomplete(elementGlob) {
  let currentFocus = null;
  const element = elementGlob;

  function closeCallback(ev) {
    // eslint-disable-next-line no-use-before-define
    closeAllLists(ev.target);
  }

  function closeAllLists(elemArg) {
    const x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i += 1) {
      if (elemArg !== x[i] && elemArg !== element) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
    document.removeEventListener('click', closeCallback);
  }

  element.addEventListener('input', async function(e) {
    const arr = await getData(e.target.value);

    let sugesstionsContainer = null;
    let sugesstionElement = null;
    const inputValue = this.value;

    closeAllLists();

    if (!inputValue) {
      return false;
    }
    currentFocus = -1;

    sugesstionsContainer = document.createElement('DIV');
    sugesstionsContainer.setAttribute('id', `${this.id}autocomplete-list`);
    sugesstionsContainer.setAttribute('class', 'autocomplete-items');

    sugesstionsContainer.addEventListener('click', function(ev) {
      element.value = ev.target.value;
      closeAllLists();
    });

    this.parentNode.appendChild(sugesstionsContainer);

    for (let i = 0; i < arr.length; i++) {
      sugesstionElement = document.createElement('DIV');

      if (arr[i].substr(0, inputValue.length).toUpperCase() === inputValue.toUpperCase()) {
        sugesstionElement.innerHTML = `<strong>${arr[i].substr(0, inputValue.length)}</strong>`;
        sugesstionElement.innerHTML += arr[i].substr(inputValue.length);
        sugesstionElement.value = arr[i];
      } else {
        sugesstionElement.value = arr[i];
      }

      sugesstionsContainer.appendChild(sugesstionElement);
    }
  });

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  }

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add('autocomplete-active');
  }

  element.addEventListener('keydown', function(e) {
    let x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode === 40) {
      // DOWN
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      // UP
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) {
      // ENTER
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  document.addEventListener('click', closeCallback);
}

// function getMockData() {
//   let arr = [
//     'Afghanistan',
//     'Albania',
//     'Algeria',
//     'Andorra',
//     'Angola',
//     'Anguilla',
//     'Antigua &amp; Barbuda',
//     'Argentina',
//     'Armenia',
//     'Aruba',
//     'Australia',
//     'Austria',
//     'Azerbaijan',
//     'Bahamas',
//     'Bahrain',
//     'Bangladesh',
//     'Barbados',
//     'Belarus',
//     'Belgium',
//     'Belize',
//     'Benin',
//     'Bermuda',
//     'Bhutan',
//     'Bolivia',
//     'Bosnia &amp; Herzegovina',
//     'Botswana',
//     'Brazil',
//     'British Virgin Islands',
//     'Brunei',
//     'Bulgaria',
//     'Burkina Faso',
//     'Burundi',
//     'Cambodia',
//     'Cameroon',
//     'Canada',
//     'Cape Verde',
//     'Cayman Islands',
//     'Central Arfrican Republic',
//     'Chad',
//     'Chile',
//     'China',
//     'Colombia',
//     'Congo',
//     'Cook Islands',
//     'Costa Rica',
//     'Cote D Ivoire',
//     'Croatia',
//     'Cuba',
//     'Curacao',
//     'Cyprus',
//     'Czech Republic',
//     'Denmark',
//     'Djibouti',
//     'Dominica',
//     'Dominican Republic',
//     'Ecuador',
//     'Egypt',
//     'El Salvador',
//     'Equatorial Guinea',
//     'Eritrea',
//     'Estonia',
//     'Ethiopia',
//     'Falkland Islands',
//     'Faroe Islands',
//     'Fiji',
//     'Finland',
//     'France',
//     'French Polynesia',
//     'French West Indies',
//     'Gabon',
//     'Gambia',
//     'Georgia',
//     'Germany',
//     'Ghana',
//     'Gibraltar',
//     'Greece',
//     'Greenland',
//     'Grenada',
//     'Guam',
//     'Guatemala',
//     'Guernsey',
//     'Guinea',
//     'Guinea Bissau',
//     'Guyana',
//     'Haiti',
//     'Honduras',
//     'Hong Kong',
//     'Hungary',
//     'Iceland',
//     'India',
//     'Indonesia',
//     'Iran',
//     'Iraq',
//     'Ireland',
//     'Isle of Man',
//     'Israel',
//     'Italy',
//     'Jamaica',
//     'Japan',
//     'Jersey',
//     'Jordan',
//     'Kazakhstan',
//     'Kenya',
//     'Kiribati',
//     'Kosovo',
//     'Kuwait',
//     'Kyrgyzstan',
//     'Laos',
//     'Latvia',
//     'Lebanon',
//     'Lesotho',
//     'Liberia',
//     'Libya',
//     'Liechtenstein',
//     'Lithuania',
//     'Luxembourg',
//     'Macau',
//     'Macedonia',
//     'Madagascar',
//     'Malawi',
//     'Malaysia',
//     'Maldives',
//     'Mali',
//     'Malta',
//     'Marshall Islands',
//     'Mauritania',
//     'Mauritius',
//     'Mexico',
//     'Micronesia',
//     'Moldova',
//     'Monaco',
//     'Mongolia',
//     'Montenegro',
//     'Montserrat',
//     'Morocco',
//     'Mozambique',
//     'Myanmar',
//     'Namibia',
//     'Nauro',
//     'Nepal',
//     'Netherlands',
//     'Netherlands Antilles',
//     'New Caledonia',
//     'New Zealand',
//     'Nicaragua',
//     'Niger',
//     'Nigeria',
//     'North Korea',
//     'Norway',
//     'Oman',
//     'Pakistan',
//     'Palau',
//     'Palestine',
//     'Panama',
//     'Papua New Guinea',
//     'Paraguay',
//     'Peru',
//     'Philippines',
//     'Poland',
//     'Portugal',
//     'Puerto Rico',
//     'Qatar',
//     'Reunion',
//     'Romania',
//     'Russia',
//     'Rwanda',
//     'Saint Pierre &amp; Miquelon',
//     'Samoa',
//     'San Marino',
//     'Sao Tome and Principe',
//     'Saudi Arabia',
//     'Senegal',
//     'Serbia',
//     'Seychelles',
//     'Sierra Leone',
//     'Singapore',
//     'Slovakia',
//     'Slovenia',
//     'Solomon Islands',
//     'Somalia',
//     'South Africa',
//     'South Korea',
//     'South Sudan',
//     'Spain',
//     'Sri Lanka',
//     'St Kitts &amp; Nevis',
//     'St Lucia',
//     'St Vincent',
//     'Sudan',
//     'Suriname',
//     'Swaziland',
//     'Sweden',
//     'Switzerland',
//     'Syria',
//     'Taiwan',
//     'Tajikistan',
//     'Tanzania',
//     'Thailand',
//     "Timor L'Este",
//     'Togo',
//     'Tonga',
//     'Trinidad &amp; Tobago',
//     'Tunisia',
//     'Turkey',
//     'Turkmenistan',
//     'Turks &amp; Caicos',
//     'Tuvalu',
//     'Uganda',
//     'Ukraine',
//     'United Arab Emirates',
//     'United Kingdom',
//     'United States of America',
//     'Uruguay',
//     'Uzbekistan',
//     'Vanuatu',
//     'Vatican City',
//     'Venezuela',
//     'Vietnam',
//     'Virgin Islands (US)',
//     'Yemen',
//     'Zambia',
//     'Zimbabwe'
//   ];
//   return arr;
// }
