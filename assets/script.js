document.addEventListener("DOMContentLoaded", function () {
    const locationsInput = document.getElementById("locations");
    const compareWeatherButton = document.getElementById("compare-weather");
    const weatherData = document.getElementById("weather-data");
    const imageContainer = document.getElementById("images");
    let map;

    compareWeatherButton.addEventListener("click", function () {
        const locations = locationsInput.value.split(",").map(location => location.trim());

        if (locations.length < 2) {
            alert("Please enter at least two locations for comparison.");
            return;
        }

        if (locations.length >= 4) {
            alert("Please enter 3 locations or less.");
            return;
        }

        // Clear previous data
        weatherData.innerHTML = "";
        imageContainer.innerHTML = "";

        // Fetch weather data and images for each location
        locations.forEach(location => {
            const openWeatherMapApiKey = '4e6e807ee59834126e8fdbcfad716167';
            const unsplashAccessKey = '2lV0OAt5aYO0BI3SaBX7whHE3sBxKNPAwXB1_3jdHbg'; // Replace with your actual Unsplash access key
            const openWeatherMapUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openWeatherMapApiKey}&units=metric`;
            const unsplashUrl = `https://api.unsplash.com/photos/random?query=${location}&client_id=${unsplashAccessKey}`;

            // Fetch weather data
            fetch(openWeatherMapUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        const { name, main, weather } = data;
                        const { temp, humidity } = main;
                        const { description } = weather[0];

                        // Display weather data
                        weatherData.innerHTML += `
                            <div>
                                <h3>${name}</h3>
                                <p>Temperature: ${temp}°C</p>
                                <p>Humidity: ${humidity}%</p>
                                <p>Weather: ${description}</p>
                            </div>
                        `;

                        // Display the map for the event location
                        showMap(data.coord.lat, data.coord.lon, name);
                    } else {
                        weatherData.innerHTML += `<p>${location}: Location not found</p>`;
                    }
                })
                .catch(error => {
                    console.error(error);
                });

            // Fetch images from Unsplash
            fetch(unsplashUrl)
                .then(response => response.json())
                .then(imageData => {
                    const imageUrl = imageData.urls.regular;

                    // Display image
                    imageContainer.innerHTML += `
                        <div>
                            <h3>${location}</h3>
                            <img src="${imageUrl}" alt="${location}">
                        </div>
                    `;
                })
                .catch(error => {
                    console.error(error);
                });
        });
    });

    // Function to initialize the map
    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 0, lng: 0 },
            zoom: 2
        });
    }

    // Function to show the map for the event location
    function showMap(latitude, longitude, locationName) {
        const eventLocation = new google.maps.LatLng(latitude, longitude);
        map.setCenter(eventLocation);
        map.setZoom(2); // You can adjust the zoom level as needed

        const marker = new google.maps.Marker({
            position: eventLocation,
            map: map,
            title: locationName
        });
    }

    // Ensure that the map is initialized after the Google Maps API is fully loaded
    google.maps.event.addDomListener(window, 'load', initMap);
});
