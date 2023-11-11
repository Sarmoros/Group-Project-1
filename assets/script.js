document.addEventListener("DOMContentLoaded", function () {
    const locationInput = document.getElementById("location");
    const getWeatherButton = document.getElementById("get-weather");
    const weatherData = document.getElementById("weather-data");
    const eventRecommendationText = document.getElementById("event-recommendation-text");

    getWeatherButton.addEventListener("click", function () {
        const location = locationInput.value;

        const apiKey = '4e6e807ee59834126e8fdbcfad716167'; // Replace with your OpenWeatherMap API key
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

        // Fetch weather data from OpenWeatherMap
        fetch(weatherApiUrl)
            .then(response => response.json())
            .then(weatherData => {
                if (weatherData.cod === 200) {
                    const { name, main, weather } = weatherData;
                    const { temp, humidity } = main;
                    const { description } = weather[0];

                    // Display weather information
                    weatherData.innerHTML = `
                        <p>Location: ${name}</p>
                        <p>Temperature: ${temp}°C</p>
                        <p>Humidity: ${humidity}%</p>
                        <p>Weather: ${description}</p>
                    `;

                    // Generate event recommendations based on weather and location
                    generateEventRecommendations(location, description);
                } else {
                    weatherData.innerHTML = "Location not found";
                }
            })
            .catch(error => {
                console.error(error);
            });
    });

    function generateEventRecommendations(location, weatherDescription) {
        // Create a request to ChatGPT for event recommendations
        const chatGptApiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

        // Use a specific prompt for event recommendations based on location and weather
        const prompt = `Suggest outdoor events in ${location} based on the weather "${weatherDescription}".`;

        const requestBody = {
            prompt,
            max_tokens: 100,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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', // Replace with your ChatGPT API key
        };

        // Make a POST request to ChatGPT API
        fetch(chatGptApiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('ChatGPT API request failed');
            }
        })
        .then(responseData => {
            // Display the event recommendation from ChatGPT
            const recommendation = responseData.choices[0].text;
            eventRecommendationText.textContent = recommendation;
        })
        .catch(error => {
            console.error(error);
        });
    }
});
