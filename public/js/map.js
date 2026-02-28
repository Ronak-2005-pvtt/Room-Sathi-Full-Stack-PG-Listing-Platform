console.log("Coordinates:", listingCoordinates);
console.log("Type:", typeof listingCoordinates);

if (!Array.isArray(listingCoordinates)) {
  console.error("Coordinates not array!");
}

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
  center: listingCoordinates,
  zoom: 10
});

new maplibregl.Marker()
  .setLngLat(listingCoordinates)
  .addTo(map);