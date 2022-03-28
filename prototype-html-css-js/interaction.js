// environmental variables;
const mapKey = "pk.eyJ1Ijoic3RlcGhlbnR3cmlnaHQiLCJhIjoiY2twODhhcTJlMDZqdjJvb2Y2ZTBxZzZzNiJ9.T-ETd1zEPRxEruIkdjy49w";
const mapCentre = [-33.4488233,151.3786264];
const mapZoom = 10;


// basic initalisation of the map;
var map = L.map('map-container', { zoomControl: false} ).setView(mapCentre, mapZoom);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapKey
}).addTo(map);

// shift around the zoom controls;
new L.Control.Zoom({ position: 'bottomright'}).addTo(map)

// add a polygon of an LGA to the map
// TODO: refactor this bit to get a general ajax and loading of data mimicing an API endpoint
//       load geojson -> update popup info -> add as a layer 
var geojsonLayer = new L.GeoJSON.AJAX("/prototype-html-css-js/resources/central-coast.geojson");       
geojsonLayer.addTo(map);