var latpos;
var longpos;

//function for location data and locationform action attribute
function getLocationData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      document.querySelector("#locationWarning").innerHTML="";
      latpos = position.coords.latitude;
      longpos = position.coords.longitude;
      const actionText =
        "/weatherbylocation?latitude=" + latpos + "&longitude=" + longpos;
      document.querySelector("#weatherByLocationForm").setAttribute("action", actionText);
      longitude = position.coords.longitude;
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

//run function when load
getLocationData();
