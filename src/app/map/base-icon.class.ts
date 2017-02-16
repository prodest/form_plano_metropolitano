import 'leaflet';

let BaseIcon = L.DivIcon.extend( {
    options: {
        iconSize: [ 21, 36 ],
        iconAnchor: [ 10, 36 ],
        popupAnchor: [ -12, -35 ],
        className: 'base-icon',
        html: '<i class="fa fa-map-marker fa-3x" aria-hidden="true"></i>'
    }
});

export { BaseIcon };
