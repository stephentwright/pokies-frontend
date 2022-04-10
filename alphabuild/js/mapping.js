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

    //deffine the popup code injection
    const customOptions = {
        'className': 'popup-container'
    }
    const lgaPopupInfoCustom = `  
                                <div class="rank-lga-name">
                                    <div class="icon"><p>#1</p></div>
                                    <div class="statistic"><p>${lgaInfo.lgaNameClean} LGA</p></div>
                                </div>
                                <div class="general-stats">
                                    <div class="icon">
                                        <img src="/components/popup-lga/resources/clubs-icon64.png" alt="Number of clubs">
                                    </div>
                                    <div class="statistic"><p>${lgaInfo["Premises Count"]} clubs or venues</p></div>
                                    <div class="icon">
                                        <img src="/components/popup-lga/resources/pokies-icon64.png" alt="Number of Pokie machines">
                                    </div>
                                    <div class="statistic"><p>${lgaInfo.EGMs} pokie machines</p></div>
                                    <div class="icon">
                                        <img src="/components/popup-lga/resources/money-fire-icon64.png" alt="Net profit">
                                    </div>
                                    <div class="statistic"><p>$${lgaInfo["Net Profit"]} net profit (6 mth)</p></div>
                                    <div class="icon">
                                        <img src="/components/popup-lga/resources/people-icon64.png" alt="Number of Adults">
                                    </div>
                                    <div class="statistic"><p>255,215 adults (18+ years)</p></div>
                                    </div>
                                <div class="featured-stat">
                                    <div class="icon">
                                        <img src="/components/popup-lga/resources/avo-toast-icon64.png" alt="Smashed Avo Index">
                                    </div>
                                    <div class="statistic">
                                        <p>24 smashed avos (per adult)</p>
                                    </div>
                                </div>
                            `;

    //add to the LGA-level popup information to the map                      
    lgaLayer.bindPopup(lgaPopupInfoCustom,customOptions).addTo(map);
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
