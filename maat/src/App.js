import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";

const CountryList = ({
  countriesToShow,
  setWeather,
  weather,
  handleFilter
}) => {
  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countriesToShow.length > 1) {
    return (
      <div>
        {countriesToShow.map(country => {
          return (
            <p key={country.name}>
              {country.name}{" "}
              <button onClick={event => handleFilter(country.name)}>
                show
              </button>
            </p>
          );
        })}
      </div>
    );
  }
  if (countriesToShow.length === 1) {
    return (
      <Country
        country={countriesToShow[0]}
        setWeather={setWeather}
        weather={weather}
      />
    );
  }
  return <div />;
};

const Country = ({ country, weather, setWeather }) => {
  let city = country.capital;
  const weatherHook = () => {
    Axios.get(
      "http://api.apixu.com/v1/current.json?key=07987bb6bb724f32b6f114034192701&q=" +
        city
    ).then(response => {
      setWeather(response.data);
    });
  };

  useEffect(weatherHook, []);

  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(lang => {
          return <li key={lang.name}>{lang.name}</li>;
        })}
      </ul>
      <img
        src={country.flag}
        alt="${country.name} flag"
        height="100"
        width="200"
      />
      <Weather weather={weather} />
    </div>
  );
};

const Weather = ({ weather }) => {
  if (weather === undefined || weather.name === "empty") {
    return <p>Waiting for weather data</p>;
  }
  return (
    <div>
      <h1>Weather in {weather.location.name}</h1>
      <p>Temperature: {weather.current.temp_c} Celsius</p>
      <img
        src={weather.current.condition.icon}
        alt="Condition ${weather.current.condition.text}"
      />
      <p>
        wind: {weather.current.wind_kph} kph direction{" "}
        {weather.current.wind_dir}
      </p>
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [weather, setWeather] = useState({ name: "empty" });

  const countryHook = () => {
    Axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      setCountries(response.data);
    });
  };

  useEffect(countryHook, []);

  const countriesToShow =
    filter.length === 0
      ? countries
      : countries.filter(country => {
          return country.name
            .toLowerCase()
            .includes(filter.trim().toLowerCase());
        });

  return (
    <div>
      <p>
        find countries
        <input
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />
      </p>
      <CountryList
        handleFilter={newFilter => setFilter(newFilter)}
        countriesToShow={countriesToShow}
        weather={weather}
        setWeather={newW => {
          setWeather(newW);
        }}
      />
    </div>
  );
};

export default App;
