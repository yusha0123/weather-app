import {
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import "./App.css";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";
import Swal from "sweetalert2";
import clear from "./icons/clear.svg";
import storm from "./icons/storm.svg";
import rain from "./icons/rain.svg";
import snow from "./icons/snow.svg";
import haze from "./icons/haze.svg";
import cloud from "./icons/cloud.svg";
import { styled } from "@mui/material/styles";

function App() {
  const [input, setInput] = useState("");
  const [responseObj, setresponseObj] = useState({});
  const [data, isdata] = useState(false);
  const [loading, isLoading] = useState(false);
  const StyledButton = styled(Button)(() => ({
    textTransform: "none",
    letterSpacing: "1px",
    color: "#FFF",
    padding: "5px 10px",
    backgroundColor: "#394867",
    ":hover": {
      backgroundColor: " #212A3E",
    },
  }));
  const fetchWeather = (latitude, longitude) => {
    let url;
    if (latitude && longitude) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
    }
    isLoading(true);
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.cod === "404") {
          Swal.fire({
            icon: "error",
            title: `${input} is not a valid City!`,
            showConfirmButton: true,
          });
        } else {
          let icon;
          const id = data.weather[0].id;
          if (id === 800) {
            icon = clear;
          } else if (id >= 200 && id <= 232) {
            icon = storm;
          } else if (id >= 600 && id <= 622) {
            icon = snow;
          } else if (id >= 701 && id <= 781) {
            icon = haze;
          } else if (id >= 801 && id <= 804) {
            icon = cloud;
          } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            icon = rain;
          }
          setresponseObj({
            name: data.name,
            icon: icon,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            time: new Date(data.dt * 1000).toLocaleString(),
          });
          isdata(true);
        }
      })
      .finally(() => {
        setInput("");
        isLoading(false);
      });
  };

  const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
  };

  const onError = (error) => {
    Swal.fire(error.message, "", "error");
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
      width={"100%"}
    >
      <Paper elevation={6} sx={{ p: 4 }}>
        <Stack direction={"column"} alignItems={"center"} gap={2}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchWeather();
            }}
          >
            <TextField
              label="Enter City"
              value={input}
              sx={{
                width: "100%",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      color="secondary"
                      type="submit"
                      disabled={!input}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </form>
          {!data && !loading && (
            <StyledButton
              onClick={() =>
                navigator.geolocation.getCurrentPosition(onSuccess, onError)
              }
            >
              Detect Location
            </StyledButton>
          )}
          {loading && <CircularProgress />}
          {data && (
            <>
              <Avatar src={responseObj.icon} sx={{ width: 60, height: 60 }} />
              <h1>
                <LocationOnIcon />
                {responseObj.name}
              </h1>
              <h3>{`Last Updated: ${responseObj.time}`}</h3>
              <h2>{`Temperature : ${responseObj.temperature} \u00B0C`}</h2>
              <h2>{`Humidity : ${responseObj.humidity}%`}</h2>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
export default App;
