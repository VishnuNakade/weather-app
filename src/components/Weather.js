import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

export default function Weather() {

    const inputRef = useRef()
    // Set initial weatherData state to null
    const [weatherData, setWeatherData] = useState(null);

    // Mapping of weather icons
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    // Search function to fetch weather data
    const search = async (city) => {
        if (city === "") {
            alert("Please Enter City Name")
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f9fbe9e4996c6565e9bb732a9b9f4210`;
            const response = await fetch(url);
            const data = await response.json();

            // Check if the response is OK
            if (!response.ok) {
                // throw new Error("Weather data could not be fetched."); 
                alert(data.message);
                return;
            }
            
            

            // Correct path for weather icon
            const icon = allIcons[data.weather[0].icon] || clear_icon;

            // Update weatherData state with the fetched data
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });

        } catch (error) {
            setWeatherData(false);
            console.error("Error fetching weather data:", error);
        }
    };

    // Effect hook to fetch data on mount
    useEffect(() => {
        search("Nagpur");
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' />
                <img src={search_icon} alt="Search Icon" onClick={()=>search(inputRef.current.value)} />
            </div>
            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className="col">
                            <img src={wind_icon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Loading state or placeholder if data is not available yet
                <p style={{marginRight:"55px",marginTop:"10px"}}>Please Enter correct City Name</p>
            )}
        </div>
    );
}
