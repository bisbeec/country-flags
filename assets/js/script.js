document.addEventListener('DOMContentLoaded', () => {

  let allCountries = [];

  // Fetch country data from data.json
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      allCountries = data;  // Store all fetched countries
      displayCountries(allCountries);  // Display all countries initially
    })
    .catch(error => console.error('Error loading country data:', error));

  // Function to display countries in the grid
  function displayCountries(data) {
    const countryGrid = document.getElementById('country-grid');
    countryGrid.innerHTML = ''; // Clear the grid before displaying new data

    // Loop through the country data and create a div for each country
    data.forEach(country => {
      const countryCard = document.createElement('div');
      countryCard.classList.add('country-card');

      // Fill the card with country details
      countryCard.innerHTML = `
        <div class="flag-wrap">
          <img src="${country.flag}" alt="Flag of ${country.name}">
        </div>

        <div class="country-info">
          <div class="country-name">${country.name}</div>
          <div><strong>Population:</strong> ${country.population.toLocaleString()}</div>
          <div><strong>Region:</strong> ${country.region}</div>
          <div><strong>Capital:</strong> ${country.capital}</div>
        </div>
        <button></button>
      `;

      // Append the card to the grid
      countryGrid.appendChild(countryCard);

      // Add click event to show detailed view
      countryCard.addEventListener('click', () => {
        showCountryDetails(country);
      });
    });

    // Show the "Back" button if search or filter is active
    toggleBackButton(data.length < allCountries.length);
  }

  // Function to show country details
  function showCountryDetails(country) {
    const countryGrid = document.getElementById('country-grid');
    const topUserArea = document.querySelector('.top-user-area'); // Get the search/filter area

    // Hide the top-user-area section
    topUserArea.style.display = 'none';

    countryGrid.innerHTML = ''; // Clear grid

    // Handle cases where there are no bordering countries
    const borderCountries = country.borders && country.borders.length > 0 
      ? country.borders.map(borderCode => {
          const borderCountry = allCountries.find(c => c.alpha3Code === borderCode);
          return borderCountry ? borderCountry.name : borderCode;  // Return the full name or the code if not found
        })
      : [];  // If no borders, return an empty array

    // Create a detailed view for the selected country
    const countryDetail = document.createElement('div');
    countryDetail.classList.add('country-detail');

    // Generate span elements for each bordering country or show a message if there are none
    const borderSpans = borderCountries.length 
      ? borderCountries.map(borderName => `<span class="border-country">${borderName}</span>`).join('')
      : '<span class="border-country">No bordering countries</span>';  // Show this message if no borders

    countryDetail.innerHTML = `

        <button class="back-button">Back</button>

        <div class="country-detail-inner">
          <div class="flag-wrap">
              <img src="${country.flag}" alt="Flag of ${country.name}">
          </div>
          
          <div class="country-info">
          <h2>${country.name}</h2>
            <div class="d-flex">
              <div class="col">
                <div><strong>Native Name:</strong> ${country.nativeName}</div>
                <div><strong>Population:</strong> ${country.population.toLocaleString()}</div>
                <div><strong>Region:</strong> ${country.region}</div>
                <div><strong>Sub Region:</strong> ${country.subregion}</div>
                <div><strong>Capital:</strong> ${country.capital}</div>
              </div>
              <div class="col">
                <div><strong>Top Level Domain:</strong> ${country.topLevelDomain}</div>
                <div><strong>Currencies:</strong> ${country.currencies.map(currency => currency.name).join(', ')}</div>
                <div><strong>Languages:</strong> ${country.languages.map(lang => lang.name).join(', ')}</div>
              </div>
            </div>
            <div class="border-countries">
              <strong>Border Countries:</strong> ${borderSpans}
            </div>
          </div>
        </div>

    `;

    countryGrid.appendChild(countryDetail);

    // Add back button functionality
    const backButton = countryDetail.querySelector('.back-button');
    backButton.addEventListener('click', () => {
      displayCountries(allCountries); // Show all countries again

      // Show the top-user-area section again
      topUserArea.style.display = 'flex';
    });
  }

  // Search functionality - filter as the user types
  const searchInput = document.querySelector('input[type="search"]');
  searchInput.addEventListener('input', () => {  // 'input' event fires on every keystroke
    const searchTerm = searchInput.value.toLowerCase();
    const filteredCountries = allCountries.filter(country =>
      country.name.toLowerCase().includes(searchTerm)
    );
    displayCountries(filteredCountries);
  });


  // Filter by region functionality
const regionButtons = document.querySelectorAll('.region-filter-dropdown ul button');
const regionFilterButton = document.querySelector('.region-filter-dropdown button');

regionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedRegion = button.textContent;

    // Update the filter button text while keeping the dropdown icon
    regionFilterButton.innerHTML = `${selectedRegion} <i class="fa fa-angle-down" aria-hidden="true"></i>`;

    // Filter countries based on selected region
    const filteredCountries = allCountries.filter(country =>
      country.region === selectedRegion
    );
    displayCountries(filteredCountries);
  });
});



  // Show or hide the back button based on whether the user is filtering or searching
  function toggleBackButton(show) {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
      backButton.style.display = show ? 'block' : 'none';
    }
  }

  // Dark mode toggle
  const modeToggleButton = document.getElementById('mode-toggle-button');
  modeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Toggle the button text without affecting the icon
    if (modeToggleButton.textContent.includes('Dark Mode')) {
      modeToggleButton.innerHTML = '<i class="fa fa-thin fa-moon"></i> Light Mode';
    } else {
      modeToggleButton.innerHTML = '<i class="fa fa-thin fa-moon"></i> Dark Mode';
    }
  });



  // Region dropdown functionality
  document.querySelector("#region-toggle-button").addEventListener('click', () => {
    document.querySelector("#regionsList").classList.toggle("list-show");
  });

  document.querySelectorAll("#regionsList li button").forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector("#regionsList").classList.remove("list-show");
    });
  });

});
