//urls for data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
let plateurl = 'static/js/PB2002_boundaries.json';

//colour changes for depth of the earthquakes
function getColour(depth) {
    if (depth > 89) return 'red';
    if (depth > 69) return 'orangered';
    if (depth > 49) return 'orange';
    if (depth > 29) return 'yellow';
    if (depth > 9) return 'limegreen';
    else return 'green';
}
//combine both plate and earthquake data and promise
Promise.all([
    d3.json(url),
    d3.json(plateurl)
]).then(function([earthquakeData, plateData]) {
    console.log(earthquakeData);
    console.log(plateData);

    //design markers and popups for markers
    let markerGroup = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            let markerSize = feature.properties.mag * 5;
            let markerColour = feature.geometry.coordinates[2]; //to get the depth, is item 3
            let popupContent = `
            <b>Magnitude:</b> ${feature.properties.mag}<br>
            <b>Place:</b> ${feature.properties.place}<br>
            <b>Tsunami:</b> ${feature.properties.tsunami ? "Yes" : "No"}<br>
            <b>ID:</b> ${feature.id}<br>
            <b>Time:</b> ${new Date(feature.properties.time).toLocaleString()}
        `;
        let marker = L.circleMarker(latlng, {
            radius: markerSize,
            fillColor: getColour(markerColour),
            color: 'black',
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.9
        }).bindPopup(popupContent);

            return marker;
        }
    });

    //start to create and layer map and tiles
    let plateLayer = L.geoJSON(plateData);
        
    let sattelite = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Satellite": sattelite,
        "Topographic Map": topo,
        "Street Map": street
    };

    let overlayMaps = {
        "Tectonic Plates": plateLayer,
        "Earthquakes": markerGroup
    };

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [sattelite, markerGroup]
    });

    //add controls to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //colour displays for the legend
    const colours = {
        'red': '90+',
        'orangered': '70 - 89',
        'orange': '50 - 69',
        'yellow': '30 - 49',
        'limegreen': '10 - 29',
        'green': '-10 - 10'
    };
    
    //add legend to the map
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        let labels = [];
        for (const colour in colours) {
            labels.push(
                '<i style="background:' + colour + '"></i> ' +
                colours[colour]);
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);
});