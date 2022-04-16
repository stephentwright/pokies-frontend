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
    //map.fitBounds(lgaLayer.getBounds());
    map.flyToBounds(lgaLayer.getBounds(), {'duration': 0.75})
}


//create a simple popup with basic LGA infomation
async function createLgaPopupInformation(lgaIds) {
    //build url for fetching;
    const url = '/alphabuild/resources/json/'+lgaIds+'-stats.json';

    //Fetch data
    const response = await fetch(url);
    const data = await response.json();
    const lgaInfo = data[0];

    //define the popup code injection
    const lgaPopupInfoCustom = `<div class="popup-container">  
                                <div class="rank-lga-name">
                                    <div class="icon"><p>#${lgaInfo.rank}</p></div>
                                    <div class="statistic"><p>${lgaInfo.lgaName} LGA</p></div>
                                </div>
                                <div class="general-stats">
                                    <div class="icon">
                                        <img src="/alphabuild/resources/img/clubs-icon64.png" alt="Number of clubs">
                                    </div>
                                    <div class="statistic"><p>${lgaInfo.premisesCount} clubs or venues</p></div>
                                    <div class="icon">
                                        <img src="/alphabuild/resources/img/pokies-icon64.png" alt="Number of Pokie machines">
                                    </div>
                                    <div class="statistic"><p>${lgaInfo.EGMs} pokie machines</p></div>
                                    <div class="icon">
                                        <img src="/alphabuild/resources/img/money-fire-icon64.png" alt="Net profit">
                                    </div>
                                    <div class="statistic"><p>${lgaInfo.profit} net profit (6 mth)</p></div>
                                    <div class="icon">
                                        <img src="/alphabuild/resources/img/people-icon64.png" alt="Number of Adults">
                                    </div>
                                    <div class="statistic"><p>255,215 adults (18+ years)</p></div>
                                    </div>
                                <div class="featured-stat">
                                    <div class="icon">
                                        <img src="/alphabuild/resources/img/avo-toast-icon64.png" alt="Smashed Avo Index">
                                    </div>
                                    <div class="statistic">
                                        <p>24 smashed avos (per adult)</p>
                                    </div>
                                </div>
                                </div>`;

    //add to the LGA-level popup information to the map                      
    lgaLayer.bindPopup(lgaPopupInfoCustom).addTo(map);
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
