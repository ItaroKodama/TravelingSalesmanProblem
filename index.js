let map;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let labelIndex = 0;
const TILE_SIZE = 256;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.680, lng: 139.700 },
    zoom: 14,
  });

  // This event listener calls addMarker() when the map is clicked.
  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
    
  });

  
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map,
  });
  const coordInfoWindow = new google.maps.InfoWindow();
  coordInfoWindow.setContent(createInfoWindowContent(location));
  coordInfoWindow.setPosition(location);
  coordInfoWindow.open(map);
}

function createInfoWindowContent(latLng) {
  const worldCoordinate = project(latLng);
  return [
    "LatLng: " + latLng,
  ].join("<br>");
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

