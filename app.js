document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const loadingPage = document.getElementById("loading-page");
    const dashboardPage = document.getElementById("dashboard-page");

    const loginButton = document.getElementById("login-button");

    // Fake Login Process
    loginButton.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username && password) {
            loginPage.classList.remove("active");
            loadingPage.classList.add("active");

            setTimeout(() => {
                loadingPage.classList.remove("active");
                dashboardPage.classList.add("active");

                fetchDataAndUpdateGraphs();
            }, 2000); // Simulate a 2-second load time
        } else {
            alert("Please enter a valid name and password.");
        }
    });

    // Fetch data from the cloud server (ThingSpeak or custom server)
    async function fetchData() {
        const response = await fetch("https://api.thingspeak.com/channels/<CHANNEL_ID>/feeds.json?api_key=<READ_API_KEY>&results=10");
        return response.json();
    }

    function fetchDataAndUpdateGraphs() {
        fetchData().then(data => {
            const voltage = data.feeds.map(feed => parseFloat(feed.field1));
            const current = data.feeds.map(feed => parseFloat(feed.field2));
            const temperature = data.feeds.map(feed => parseFloat(feed.field3));
            const timestamps = data.feeds.map(feed => feed.created_at);

            document.getElementById("voltage").innerText = voltage[voltage.length - 1];
            document.getElementById("current").innerText = current[current.length - 1];
            document.getElementById("temperature").innerText = temperature[temperature.length - 1];

            updateGraphs(timestamps, voltage, current, temperature);
        });
    }

    function updateGraphs(timestamps, voltage, current, temperature) {
        const ctxVoltage = document.getElementById("voltageChart").getContext("2d");
        const ctxCurrent = document.getElementById("currentChart").getContext("2d");
        const ctxTemperature = document.getElementById("temperatureChart").getContext("2d");

        new Chart(ctxVoltage, {
            type: "line",
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: "Voltage (V)",
                        data: voltage,
                        borderColor: "blue",
                        backgroundColor: "blue",
                        fill: false,
                    },
                ],
            },
        });

        new Chart(ctxCurrent, {
            type: "line",
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: "Current (A)",
                        data: current,
                        borderColor: "green",
                        backgroundColor: "green",
                        fill: false,
                    },
                ],
            },
        });

        new Chart(ctxTemperature, {
            type: "line",
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: "Temperature (°C)",
                        data: temperature,
                        borderColor: "red",
                        backgroundColor: "red",
                        fill: false,
                    },
                ],
            },
        });
    }
});
