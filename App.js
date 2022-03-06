import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "9d7e33f70d13758915255b604437efd9";
const weatherRequestUrl = (latitude, longitude, apiKey) => {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${apiKey}&units=metric`
}

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const getWeather = async () => {
    let { granted } = await Location.requestForegroundPermissionsAsync();
    
    if (!granted) {
      setErrorMsg('Permission to access location was denied!');
      return;
    }

    const {
      coords: {latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    
    setCity(location[0].city);

    const response = await fetch(weatherRequestUrl(latitude, longitude, API_KEY));

    const json = await response.json();

    setDays(json.daily);
  }

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View
      style={styles.container}
    >
      <StatusBar style='light'/>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        contentContainerStyle={styles.weather}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={ false } 
      >
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10}}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View 
              key={index}
              style={styles.day}
            >
              <Text style={styles.date}>
                {new Date(day.dt*1000).toString().substring(0,10)}
              </Text>
              <View 
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <View>
                <Text style={styles.temp}>
                  <Text>
                  {`${parseFloat(day.temp.day).toFixed(1)}`}
                  </Text>
                  <Text style={{fontSize: 40}}>
                    {" ℃"}
                  </Text>
                </Text>
                </View>
                <Fontisto
                  style={{marginTop: 50}}
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: { },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 40,
    marginBottom: -20,
    color: "white",
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: "600",
    color: "white",
  },
  description: {
    marginTop: -10,
    fontWeight: "500",
    fontSize: 30,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
    marginTop: 5,
    fontWeight: "500",
  }
});
