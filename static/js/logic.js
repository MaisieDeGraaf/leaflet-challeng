let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

d3.json(url).then(function(data){
    console.log(data)

    let markerGroup = L.geoJSON(data)

    console.log(markerGroup)

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    
    let topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    let overlayMaps = {
        earthquakes: markerGroup
    };

    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, markerGroup]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

})

