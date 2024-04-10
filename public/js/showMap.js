mapboxgl.accessToken = mbxtoken;
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 9,
        center: campground.geometry.coordinates
    });

    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker({
        color: "#F44336",
   } ).setLngLat(campground.geometry.coordinates).addTo(map)
