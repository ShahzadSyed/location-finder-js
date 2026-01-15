console.log("JavaScript Is Running...!");

const btn = document.getElementById("btnLocation");
const loader = document.getElementById("loader");
const card = document.getElementById("countryCard");

btn.addEventListener("click", getLocation);

function getLocation() {
    loader.classList.remove("hidden");
    card.classList.add("hidden");

    navigator.geolocation.getCurrentPosition(
        function (success) {
            const { latitude, longitude } = success.coords;
            countryName(latitude, longitude);
        },
        function (error) {
            loader.classList.add("hidden");
            alert("Location access denied");
        }
    );
}

function countryName(lat, long) {
    fetch(`https://geocode.xyz/${lat},${long}?geoit=json`)
        .then(res => res.json())
        .then(data => {
            countryDetailsFoo(data.country);
        });
}

function countryDetailsFoo(countryName) {
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(res => res.json())
        .then(result => {
            const country = result[0];

            document.getElementById("flag").src = country.flags.png;
            document.getElementById("countryName").innerText = country.name.common;
            document.getElementById("capital").innerText = country.capital?.[0] || "N/A";
            document.getElementById("region").innerText = country.region;
            document.getElementById("population").innerText = country.population.toLocaleString();

            showBorders(country.borders);

            loader.classList.add("hidden");
            card.classList.remove("hidden");
        });
}

function showBorders(borders) {
    const bordersDiv = document.getElementById("borders");
    bordersDiv.innerHTML = "";

    if (!borders) {
        bordersDiv.innerHTML = "<p>No border countries</p>";
        return;
    }

    fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`)
        .then(res => res.json())
        .then(countries => {
            countries.forEach(c => {
                const span = document.createElement("span");
                span.className = "border-item";
                span.innerText = c.name.common;
                bordersDiv.appendChild(span);
            });
        });
}
