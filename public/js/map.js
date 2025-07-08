
    const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: coordinates,
    zoom: 8,
    });


    const marker =  new maplibregl.Marker({color: 'red'})
    .setLngLat(coordinates)
    .setPopup(
        new maplibregl.Popup().setHTML("<p>Exact Location provided after booking</p>")
    )
    .addTo(map);
