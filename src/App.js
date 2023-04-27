import { useEffect, useRef, useState } from 'react';
import './App.css';
import Map from './components/Map.jsx';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function App() {
	// a list of markers [{ name: 'location name', lng: 0.0, lat: 0.0 }]
	const [markers, setMarkers] = useState([]);
	// the actual map element on the page, drilled down to the <Map /> component
	const map = useRef(null);
	// the input field for picking a location
	const searchContainer = useRef(null);

	// when selected a location from search input, it creates a marker that is stored in markers state
	// it is then rendered in a ordered list as a button with its info as the text
	const handleLocationOnClick = e => {
		// the value property on buttons are strings so we split the string here to get both coords
		const coords = e.target.value.split(',');
		console.log('coords:', coords);
		// the map element has a method on it to fly to a location, it takes an object
		// in this case we fly to the coords we got from the value property of the button
		map.current.flyTo({
			center: [coords[0], coords[1]],
			zoom: 16,
		});
	};

	useEffect(() => {
		if (map) {
			// this creates the search input field with an options object in it's constructor
			const geocoder = new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl,
				// setting the marker property to false stops the geocoder placing a marker by default as we want to do it manually
				marker: false,
				placeholder: 'Enter a location',
			});

			// an event triggered by selecting a location from the search input field
			geocoder.on('result', e => {
				console.log('User selected a suggestion:', e.result);
				// clears the input field of text
				geocoder.clear();

				// creates a new marker, sets the position with setLngLat then adds it to the map with addTo
				const marker = new mapboxgl.Marker()
					.setLngLat(e.result.center)
					.addTo(map.current);

				// add the newly created marker to our markers state array, we only want the location name and the coords in this case
				setMarkers(markers => [
					{
						name: e.result.text,
						lng: e.result.center[0],
						lat: e.result.center[1],
					},
					...markers,
				]);

				// the method we used earlier to fly to the location, this time we fly to the new marker
				map.current.flyTo({
					center: [e.result.center[0], e.result.center[1]],
					zoom: 16,
				});
			});

			// adds the search input field to the DOM so we can manipulate it, without this the input is tied onto the map itself
			searchContainer.current.appendChild(geocoder.onAdd(map.current));
		}
	}, []);

	return (
		<div className='App'>
			{/* the search input element */}
			<div
				className='search-container'
				ref={searchContainer}
			></div>

			{/* a wrapper for the map element */}
			<div className='map-wrapper'>
				<Map map={map} />
			</div>

			{/* we create a list of markers */}
			<div>
				<ol>
					{markers.map((marker, i) => {
						return (
							<li key={i}>
								<button
									onClick={handleLocationOnClick}
									value={[marker.lng, marker.lat]}
								>
									{`Name: ${marker.name} - Lng: ${marker.lng} - Lat: ${marker.lat}`}
								</button>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
}

export default App;
