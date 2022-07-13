var nthRound = 0;
var guessedDistance,
  earnedScore,
  userScore = 0;
var ifUserNotGuessed = true;

// --------------Modals--------------

const modal = document.querySelector(".modal");
const openModal = document.querySelector(".open-button");
const closeModal = document.querySelector(".close-button");

function countdown() {
  // --------Reveser-timer-----------
  const FULL_DASH_ARRAY = 283;
  const WARNING_THRESHOLD = 20;
  const ALERT_THRESHOLD = 15;

  const COLOR_CODES = {
    info: {
      color: "green",
    },
    warning: {
      color: "orange",
      threshold: WARNING_THRESHOLD,
    },
    alert: {
      color: "red",
      threshold: ALERT_THRESHOLD,
    },
  };

  var Minute = $("#revese-timer").data("minute");
  var Seconds = Math.round(60 * Minute);
  const TIME_LIMIT = Seconds;
  let timePassed = 0;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;
  let remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("revese-timer").innerHTML = `
	<div class="base-timer">
	  <svg class="base-timer__svg" viewBox="130 -20 400 400" xmlns="http://www.w3.org/2000/svg">
	    <g class="base-timer__circle">
	      <circle class="base-timer__path-elapsed" cx="350" cy="50" r="45"></circle>
	      <path
	        id="base-timer-path-remaining"
	        stroke-dasharray="283"
	        class="base-timer__path-remaining ${remainingPathColor}"
	        d="
	          M 50, 50
	          m -45, 0
	          a 45,45 0 1,0 90,0
	          a 45,45 0 1,0 -90,0
	        "
	      ></path>
	    </g>
	  </svg>
	  <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
	</div>
	`;

  function startTimer() {
    timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById("base-timer-label").innerHTML =
        formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
        showResult();
        onTimesUp();
      }
    }, 1000);
  }

  startTimer();

  function onTimesUp() {
    clearInterval(timerInterval);
    setTimeout(function () {
      $(".image-container").empty();
      round(pickingRandomNumer());
    }, 10000);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    }
  }

  function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  function setCircleDasharray() {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }
}

function nextRound() {
  setTimeout(function () {
    modal.close();
  }, 10000);
}

function showResult() {
  modal.showModal();
  document.getElementById(
    "modal"
  ).innerHTML = `<div>Round&nbsp;${nthRound}&nbsp;result:</div>
  <br>
  <div>You are&nbsp;${guessedDistance}&nbsp;km&nbsp;far away.</div>
  <div>You score is&nbsp;${earnedScore}.</div>`;
  nextRound();
}

function round(city) {
  nthRound++;
  console.log(nthRound);

  // ---------Distance Calculation -------------------
  function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    x = lat2;
    y = lon2;
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadiusKm * c);
  }

  // --------------------Score Calculation-----------------
  function score(distance) {
    var scored = (distance / 3000) * 100;
    return Math.round(scored);
  }

  //-------------------updating-roundInfo---------------

  function updateRoundInfo() {
    document.getElementById(
      "roundInfo"
    ).innerHTML = `<span class="updateRoundInfo">Round&nbsp;&nbsp;${nthRound}&nbsp;&nbsp;of&nbsp;&nbsp;10</span>`;
  }
  updateRoundInfo();

  //-------------------updating-leaderboard---------------

  function updateLeaderboard() {
    document.getElementById(
      "leaderboard"
    ).innerHTML = `<div class="leaderboard-header"><span>Leaderboard</span></div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[0].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${userScore}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[1].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[1].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[2].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[2].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[3].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[3].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[4].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[4].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[5].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[5].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[6].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[6].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[7].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[7].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[8].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[8].score}</div>
    <div class="player1">${players[0].rank}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[9].userName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${players[9].score}</div>`;
  }
  updateLeaderboard();

  // -------------------MapBox----------------------------
  var coordinates, selectedLongitude, selectedLatitude;
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2h1ZGhhbnNodTAwMTEiLCJhIjoiY2wxaGN3c2NuMDg4NDNqbWpzMXVyb2FoYyJ9.0zlYRvmxciYnQxxIVnK7YA";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/shudhanshu0011/cl1yojvjg006f14nu1h6gkcio",
    center: [64.83954108438542, 25.145937252911022],
    zoom: 3,
  });
  map.on("style.load", function () {
    map.on("click", function (e) {
      coordinates = e.lngLat;
      selectedLongitude = coordinates.lng;
      selectedLatitude = coordinates.lat;

      guessedDistance = distanceInKmBetweenEarthCoordinates(
        city.latitude,
        city.longitude,
        selectedLatitude,
        selectedLongitude
      );
      earnedScore = score(
        distanceInKmBetweenEarthCoordinates(
          city.latitude,
          city.longitude,
          selectedLatitude,
          selectedLongitude
        )
      );

      userScore += earnedScore;

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [selectedLongitude, selectedLatitude],
              [city.longitude, city.latitude],
            ],
          },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "red",
          "line-width": 3,
        },
      });
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [selectedLongitude, selectedLatitude],
                  },
                  properties: {
                    title: "Your Location",
                  },
                },
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [city.longitude, city.latitude],
                  },
                  properties: {
                    title: city.cityName,
                  },
                },
              ],
            },
          });
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });
  });

  // ----------------------------360 degree viewer---------------------------

  const panoramaImage = new PANOLENS.ImagePanorama(city.imageUrl);
  const imageContainer = document.querySelector(".image-container");

  const viewer = new PANOLENS.Viewer({
    container: imageContainer,
  });

  viewer.add(panoramaImage);

  if (ifUserNotGuessed) {
    userScore = 0;
    ifUserNotGuessed = true;
  }

  countdown();
}

var players = [
  player1,
  player2,
  player3,
  player4,
  player5,
  player6,
  player7,
  player8,
  player9,
  player10,
];

var items = [
  location1,
  location2,
  location3,
  location4,
  location5,
  location6,
  location7,
  location8,
  location9,
  location10,
  location11,
  location12,
  location13,
  location14,
  location15,
  location16,
  location17,
  location18,
  location19,
  location20,
  location21,
  location22,
  location23,
  location24,
  location25,
  location26,
  location27,
  location28,
  location29,
  location30,
  location31,
  location32,
  location33,
  location34,
  location35,
  location36,
  location37,
  location38,
  location39,
  location40,
  location41,
  location42,
  location43,
  location44,
  location45,
  location46,
  location47,
  location48,
  location49,
  location50,
];

function pickingRandomNumer() {
  var locations = items[Math.floor(Math.random() * items.length)];
  return locations;
}

// function match() {
//   for (var i = 1; i <= 10; i++) {
//     round(i, locations);
//   }
// }

// match();

round(pickingRandomNumer());
