let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

d3.json(url).then(function(data){
    console.log(data)

    let markerGroup = L.geoJSON(data)

    console.log(markerGroup)
    

})

