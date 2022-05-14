const wrapper = document.querySelector(".wrapper");
const input_part = document.querySelector(".input-part");
const info_text = document.querySelector(".info-txt");
const input_field = document.querySelector("input");
const location_button = document.querySelector("button");
const weather_part = document.querySelector(".weather-part");
const animated_icons = document.querySelector("img");
const return_arrow = document.querySelector("header i");

let api;

input_field.addEventListener("keyup", e => { //KeyUp is basically an event invoked for keyboard when any key is pressed.
    if (e.key == "Enter" && input_field.value != "") // when enter key is pressed and the input value is not null then request API
    {
        requesttheApi(input_field.value);
    } else if (e.key == "Enter" && input_field.value == "") {
        info_text.innerText = "you must enter a city name or can go with current location";
    }
});

location_button.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function requesttheApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=47d975f8a5c14f093d3adaf7538c3aba`;

    fetchData();
}

function onSuccess(position) {
    const {
        latitude,
        longitude
    } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=47d975f8a5c14f093d3adaf7538c3aba`;
    fetchData();
}

function onError(error) {
    info_text.innerText = error.message;
    info_text.classList.add("error");
}

function fetchData() {
    info_text.innerText = "Please wait while details are being fetched...";
    info_text.classList.add("info");
    fetch(api).then(response => {
        return response.json();
    }).then(result => {
        weatherDetails(result).catch(() => {
            info_text.innerText = "Whoops! Something went wrong. Please try again later.";
            info_text.classList.replace("pending", "error");
        });
    });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        info_text.classList.replace("pending", "error");
        info_text.innerText = `${input_field.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {
            description,
            id
        } = info.weather[0];
        const {
            temp,
            feels_like,
            humidity
        } = info.main;

        if (id == 800) {
            animated_icons.src = "res/sun.gif";
        } else if (id >= 200 && id <= 232) {
            
            animated_icons.src = "res/whirlwind.gif";
        } else if (id >= 600 && id <= 622) {
           
            animated_icons.src = "res/snow.gif";
        } else if (id >= 701 && id <= 781) {
           
            animated_icons.src = "res/foggy.gif";
        } else if (id >= 801 && id <= 804) {
           
            animated_icons.src = "res/clouds.gif";
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            
            animated_icons.src = "res/rain.gif";
        }

        weather_part.querySelector(".temp .numb").innerText = Math.floor(temp);
        weather_part.querySelector(".weather").innerText = description;
        weather_part.querySelector(".location span").innerText = `${city}, ${country}`;
        weather_part.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weather_part.querySelector(".Humidity span").innerText = `${humidity}%`;
        info_text.classList.remove("pending", "error");
        info_text.innerText = "";
        input_field.value = "";
        wrapper.classList.add("active");
    }
}
  
return_arrow.addEventListener("click", () => {
    wrapper.classList.remove("active");
});