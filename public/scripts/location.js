var latpos;
var longpos;
function getLocationData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      latpos = position.coords.latitude;
      longpos = position.coords.longitude;
      const actionText =
        "/weatherbylocation?latitude=" + latpos + "&longitude=" + longpos;
      document
        .querySelector("#weatherByLocationForm")
        .setAttribute("action", actionText);
      longitude = position.coords.longitude;
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getLocationData();
