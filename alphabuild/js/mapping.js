// GLOBAL VARIABLES
const MAP_KEY = "pk.eyJ1Ijoic3RlcGhlbnR3cmlnaHQiLCJhIjoiY2twODhhcTJlMDZqdjJvb2Y2ZTBxZzZzNiJ9.T-ETd1zEPRxEruIkdjy49w";
const MAP_CONTROLS = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 16,
    minZoom: 6,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: MAP_KEY
}

// Set inital map to focus on Sydney and should be good for most viewports
let mapCenterLat = -33.85;
let mapCenterLng = 151.22;
let mapZoom = 11;

// Initalise a new Map and reset position of zoom controls;
let map = L.map('map-container', {zoomControl: false} ).setView([mapCenterLat, mapCenterLng], mapZoom);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',MAP_CONTROLS).addTo(map);
new L.Control.Zoom({ position: 'bottomright'}).addTo(map)

// Initialise an LGA layer to add data to later
let lgaLayer = new L.geoJSON().addTo(map);

//zoom to region selected;
function updateMapPosition(lat,long,zoom){
    map.flyTo(new L.LatLng(lat,long),zoom);
}

//fetch boundary and add to map
async function loadLgaPolygon(lgaIds) {
    //build url for fetching;
    const url = '/alphabuild/resources/geoJSON/'+lgaIds+'.geojson';
    
    //Fetch data
    const response = await fetch(url);
    const data = await response.json();
    
    //Add polygon to the map;
    lgaLayer.addData(data.features[0]);

    console.log(data.features[0].properties);

    //Update the new map centre and map zoom (i think we should get this from the GeoJson);
    mapCenterLat = lgaLayer.getBounds().getCenter().lat;
    mapCenterLong = lgaLayer.getBounds().getCenter().lng;
    console.log(mapCenterLat, mapCenterLong);
    updateMapPosition(mapCenterLat,mapCenterLng,mapZoom);
    
}


//create a simple popup with basic LGA infomation
async function createLgaPopupInformation(lgaIds) {
    //build url for fetching;
    const url = '/alphabuild/resources/json/'+lgaIds+'-stats.json';

    //Fetch data
    const response = await fetch(url);
    const data = await response.json();
    const lgaInfo = data[0];

    //create the boiler plate popup
    const lgaPopupInfo = `<h2>${lgaInfo.lgaNameClean} Local Government Area</h2>
                          <p>The total net profit for the period 1st Dec 2020 to 31 May 2021 was <b>$${lgaInfo["Net Profit"]}</b>. </p>
                          <p>There are <b>${lgaInfo["Premises Count"]}</b> clubs in the area with a total of <b>${lgaInfo.EGMs}</b> of electronic gaming machines (EGMs)</p>`;

    //add to the LGA-level popup information to the map                      
    lgaLayer.bindPopup(lgaPopupInfo).addTo(map);
}

//load venue information with a brief popup message about the venue;
async function loadVenueInformation (lgaIds) {
    //build the url for fetching
    const url='/alphabuild/resources/json/'+lgaIds+'-venues.json';

    //fetch data
    const reponse = await fetch(url);
    const data = await reponse.json();
    
    //loop through and add points to the map
    for (let i = 0; i < data.length; i++){

        // create the club infomation boiler plate
        const clubInfo = `<h2>${data[i]["Licence name"]}</h2>
                          <p>The number of electronic gaming machines (EGMs) is at the venue is currently <b>${data[i].EGMs}</b>   .</p>`;
        
        // add the marker to the map
        L.marker([data[i].Latitude, data[i].Longitude])
            .bindPopup(clubInfo)
            .addTo(map);
    }
}
