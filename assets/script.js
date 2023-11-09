document.addEventListener("DOMContentLoaded", function () {
    const eventForm = document.getElementById("event-form");
    const eventList = document.getElementById("event-list");
    const eventDetails = document.getElementById("event-details");
    const eventInfo = document.getElementById("event-info");
    const eventPasswordInput = document.getElementById("event-password-input");
    const joinEventButton = document.getElementById("join-event");
    const cancelEventButton = document.getElementById("cancel-event");

    eventForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get event details from the form
        const eventName = document.getElementById("event-name").value;
        const eventDate = document.getElementById("event-date").value;
        const eventTime = document.getElementById("event-time").value;
        const eventPassword = document.getElementById("event-password").value;

        // Create an event card and add it to the event list
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <h3>${eventName}</h3>
            <p>Date: ${eventDate}</p>
            <p>Time: ${eventTime}</p>
            <button class="join-event">Join Event</button>
        `;
        eventCard.setAttribute("data-password", eventPassword); // Store the password as a data attribute
        eventList.appendChild(eventCard);

        // Clear the form
        eventForm.reset();
    });

    // Event Listeners for Joining an Event
    eventList.addEventListener("click", function (e) {
        if (e.target.classList.contains("join-event")) {
            // Show the event details section
            eventDetails.classList.remove("hidden");
            eventInfo.textContent = e.target.parentElement.textContent;
        }
    });

    joinEventButton.addEventListener("click", function () {
        const selectedEvent = document.querySelector(".event-card.selected");
        const enteredPassword = eventPasswordInput.value;

        if (selectedEvent && enteredPassword) {
            const eventPassword = selectedEvent.getAttribute("data-password");

            if (enteredPassword === eventPassword) {
                alert("Event joined successfully!");
                eventDetails.classList.add("hidden");
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            alert("Select an event and enter the password.");
        }
    });

    cancelEventButton.addEventListener("click", function () {
        // Hide the event details section
        eventDetails.classList.add("hidden");
    });
});
