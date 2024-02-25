let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

function getColour(depth) {
    if (depth > 89) return 'red';
    if (depth > 69) return  'orange';
    if (depth > 49) return  'yellow';
    if (depth > 29) return  'green';
    if (depth > 9) return  'lime';
    else return 'black';

};

d3.json(url).then(function(data) {
    console.log(data);

    let markerGroup = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            let markerSize = feature.properties.mag * 5;

            let markerColor = feature.geometry.coordinates[2]; 
            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: getColour(markerColor),
                color: 'black',
                weight: 2,
                opacity: 0.5,
                fillOpacity: 0.6
            });
        }
    });



    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Topographic Map": topo,
        "Street Map": street
    };

    let overlayMaps = {
        "Earthquakes": markerGroup
    };

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, markerGroup]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    const colors = {
        'red': '90+',
        'lightred': '70 - 89',
        'orange': '50 - 69',
        'khaki': '30 - 49',
        'limegreen': '10 - 29',
        'green': '-10 - 10'
    };
    
    
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend');
        let labels = [];
    
        for (const color in colors) {
            labels.push(
                '<i style="background:' + color + '"></i> ' +
                colors[color]);
        }
    
        div.innerHTML = labels.join('<br>');
        return div;
    };
    
    legend.addTo(myMap);
});

