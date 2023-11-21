

//Executes code when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const compareForm = document.getElementById("compareForm");
    const city1Data = document.getElementById("city1Data");
    const city2Data = document.getElementById("city2Data");
    const recentSearches = document.getElementById("recentSearches");
    const searchHistoryList = document.getElementById("searchHistory");

    // Initialize the map
    initMap();

    // Load recent searches from local storage
    loadRecentSearches();


    
    // Retrieve stored search values from local storage
    const storedSearch1 = localStorage.getItem("search1");
    const storedSearch2 = localStorage.getItem("search2");

    // Event listener for form submission
    compareForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Retrieve user input for both cities
        const search1 = document.getElementById("search1").value.trim();
        const search2 = document.getElementById("search2").value.trim();
        const citiesRequest = document.getElementById("citiesRequest");

        // Hide the cities request message
        citiesRequest.style.display = "none";

        // Checks if both cities are provided
        if (!search1 || !search2) {
            citiesRequest.style.display = "block";
            return;
        }

        // Store search values in local storage
        localStorage.setItem("search1", search1);
        localStorage.setItem("search2", search2);

        // Save the search in recent searches
        saveRecentSearch(search1);
        saveRecentSearch(search2);

        // Fetch and display data for City 1 (OpenWeatherMap API)
        fetchCityData(search1, city1Data);

        // Fetch and display data for City 2 (OpenWeatherMap API)
        fetchCityData(search2, city2Data);

        // Initialize or update the map (Google Maps API)
        updateMap(search1, search2);

        // Fetch and display images for City 1 and City 2 (Unsplash API)
        fetchUnsplashImage(search1, "left-banner");
        fetchUnsplashImage(search2, "right-banner");

        // Update recent searches display
        loadRecentSearches();
    });

    // Function to save a recent search in local storage
    function saveRecentSearch(city) {
        let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        if (recentSearches.length >= 5) {
            recentSearches.pop(); // Remove the oldest search
        }
        recentSearches.unshift(city); // Add the new search to the beginning
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }

    // Function to load and display recent searches
    function loadRecentSearches() {
        const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        searchHistoryList.innerHTML = ""; // Clear the previous list
        recentSearches.forEach(city => {
            const listItem = document.createElement("li");
            listItem.textContent = city;
            listItem.addEventListener("click", function () {
                // Handle click on a recent search
                const storedSearch1 = localStorage.getItem("search1");
                fetchCityData(city, city1Data);
                fetchCityData(storedSearch1, city2Data);
                updateMap(city, storedSearch1);
                fetchUnsplashImage(city, "left-banner");
                fetchUnsplashImage(storedSearch1, "right-banner");
                loadRecentSearches(); // Refresh the list after the comparison
            });
            searchHistoryList.appendChild(listItem);
        });
    }

    // If there are stored search values, fetch and display data for both cities
    if (storedSearch1 && storedSearch2) {
        // Fetch and display data for City 1 (OpenWeatherMap API)
        fetchCityData(storedSearch1, city1Data);

        // Fetch and display data for City 2 (OpenWeatherMap API)
        fetchCityData(storedSearch2, city2Data);

        // Initialize or update the map (Google Maps API)
        updateMap(storedSearch1, storedSearch2);

        // Fetch and display images for City 1 and City 2 (Unsplash API)
        fetchUnsplashImage(storedSearch1, "left-banner");
        fetchUnsplashImage(storedSearch2, "right-banner");
    }


    // Function to fetch weather data for a city from the OpenWeatherMap API
    function fetchCityData(city, displayElement) {
        // OpenWeatherMap API key and URL
        const openWeatherMapApiKey = '4e6e807ee59834126e8fdbcfad716167';
        const openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`;

        // Fetch data from the API
        fetch(openWeatherMapUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                   // Extract specific data from the API response
                    const { name, main, weather } = data;
                    const { temp, humidity } = main;
                    const { description } = weather[0];

                    // Display city data
                    displayCityData(displayElement, name, temp, humidity, description);
                } else {
                    displayCityData(displayElement, "City not found", "-", "-", "-");
                }
            })
            .catch(error => {
                 // Display an error message in case of a fetch error
                console.error(error);
                displayCityData(displayElement, "Error", "-", "-", "-");
            });
    }

    // Function to display weather data in the data container
    function displayCityData(element, cityName, temp, humidity, weather) {
        element.innerHTML = `
            <h4>${cityName}</h4>
            <p>Temp: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Weather: ${weather}</p>
        `;
    }

    // Function to update the map using the Google Maps API
    function updateMap(city1, city2) {
        const mapElement = document.getElementById("map-container");
        const resultWrapper = document.getElementById("result");
    
        // Set the display property to block to show the map
        mapElement.style.display = "block";
        resultWrapper.style.display = "block";
    
        // Clear the map container
        mapElement.innerHTML = "";
    
        // Set a specific height for the map container
        mapElement.style.height = "300px"; // Adjust the height as needed
    
        // Initialize a new map 
        map = new google.maps.Map(mapElement, {
            center: { lat: 40.674, lng: -73.945 }, // Center the map by default 
            zoom: 12, // Defines the default zoom
            //Styles the map into dark mode
            styles: [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }],
                },
                {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#2f3948" }],
                },
                {
                    featureType: "transit.station",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }],
                },
            ],
        });

    
        // Create LatLngBounds object
        const bounds = new google.maps.LatLngBounds();
    
        // Geocode City 1
        geocodeCity(city1, function (result1) {
            if (result1) {
                const marker1 = new google.maps.Marker({
                    position: result1.geometry.location,
                    map: map,
                    title: city1,
                });
    
                // Extend bounds to include City 1
                bounds.extend(marker1.getPosition());
            }
        });
    
        // Geocode City 2
        geocodeCity(city2, function (result2) {
            if (result2) {
                const marker2 = new google.maps.Marker({
                    position: result2.geometry.location,
                    map: map,
                    title: city2,
                });
    
                // Extend bounds to include City 2
                bounds.extend(marker2.getPosition());
            }
    
            // Fit the map to the bounds
            map.fitBounds(bounds);
    
            // Center the map if there's only one marker
            if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                const center = bounds.getCenter();
                map.setCenter(center);
                map.setZoom(12);
            }
        });
    }
    
    
    
        // Create LatLngBounds object
        const bounds = new google.maps.LatLngBounds();
    
    
    
    
    
    
    // Function to geocode a city using the Google Maps Geocoding API
    function geocodeCity(city, callback) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: city }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
                const result = results[0];
                callback(result);
            } else {
                console.error(`Geocoding error for ${city}: ${status}`);
                callback(null);
            }
        });
    }

    // Function to fetch and display an image for a city from the Unsplash API
    function fetchUnsplashImage(city, bannerClass) {
        //Unsplash API access key and URL
        const unsplashAccessKey = '2lV0OAt5aYO0BI3SaBX7whHE3sBxKNPAwXB1_3jdHbg';
        const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashAccessKey}`;
    
        // Fetch data from the Unsplash API
        fetch(unsplashUrl)
            .then(response => response.json())
            .then(imageData => {
                const imageUrl = imageData.urls.regular;
    
                // Display image with fixed dimensions
                const bannerElement = document.querySelector(`.${bannerClass} .splashImage`);
                bannerElement.src = imageUrl;
                bannerElement.alt = city;
            })

            // Display a placeholder image in case of a fetch error
            .catch(error => {
                console.error(error);
                const bannerElement = document.querySelector(`.${bannerClass} .splashImage`);
                bannerElement.src = "https://via.placeholder.com/150";
                bannerElement.alt = city;
            });
    }

});

//Function to initialize the map
function initMap() {
}

