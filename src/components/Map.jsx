import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import React, { useRef, useEffect } from 'react';

// react loads from .env automatically, we just have to create the .env reference it
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = ({ map }) => {
	// the map element
	const mapContainer = useRef(null);

	useEffect(() => {
		if (map.current) return; // initialize map only once
		// creates the map
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-0.127758, 51.507351],
			zoom: 9,
		});

		// a custom marker element that uses a div element with a image through css
		const markerElement = document.createElement('div');
		markerElement.className = 'custom-marker';

		// creates the map marker using the above element in its constructor
		const marker = new mapboxgl.Marker({ element: markerElement })
			.setLngLat([-0.127758, 51.507351]) // London coordinates
			.addTo(map.current);
	});

	return (
		<div
			className='map-container'
			ref={mapContainer}
		/>
	);
};

export default Map;
