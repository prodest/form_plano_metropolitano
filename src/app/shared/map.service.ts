import { Map } from 'leaflet';
import 'leaflet.gridlayer.googlemutant';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MapService {
    public map: Map;
    public baseMaps: any;
    private vtLayer: any;

    constructor( private http: Http ) {
        this.baseMaps = {
            OpenStreetMap: L.tileLayer( 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            }),
             OSDefault: L.tileLayer( '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Esri: L.tileLayer( 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            }),
            CartoDB: L.tileLayer( 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            }),
            MapBox: L.tileLayer( 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvbGxtZW5lemVzIiwiYSI6ImNpejc5cW42YTAwMnQzMXFvbzl0d3RlNDMifQ.dI1h507huh6XDABHZ9FBoQ', {
                attribution: '&copy; <a href="https://www.mapbox.com/studio/welcome/">MapBox</a>'
            }),
            GoogleMaps: L.gridLayer.googleMutant( {
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            } )
        };
    }

    disableMouseEvent( elementId: string ) {
        let element = <HTMLElement>document.getElementById( elementId );

        L.DomEvent.disableClickPropagation( element );
        L.DomEvent.disableScrollPropagation( element );
    }

    toggleAirPortLayer() {
        if ( this.vtLayer ) {
            this.map.removeLayer( this.vtLayer );
            delete this.vtLayer;
        } else {
            this.http.get( 'data/airports.geojson' )
                .map( res => res.json() )
                .subscribe( result => {
                    this.vtLayer = L.vectorGrid.slicer( result );
                    this.vtLayer.addTo( this.map );
                });
        }
    }
}
