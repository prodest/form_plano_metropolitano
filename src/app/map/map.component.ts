import 'rxjs/Rx';
// import 'leaflet';
import { LatLng } from 'leaflet';
import 'leaflet.vectorgrid';
import 'leaflet.markercluster';
import 'leaflet.locatecontrol';
import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { settings } from '../shared/settings';
import { MapService } from '../shared/map.service';
import { BaseIcon } from './base-icon.class';
declare let L: any;

@Component( {
    moduleId: module.id,
    selector: 'map-demand',
    providers: [ MapService ],
    template: `<div id="map"></div>`,
    styleUrls: [ settings.orchardModulePath + 'map.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
    @Output() onNewDemand = new EventEmitter<void>();
    @Output() onLocationChanged = new EventEmitter<LatLng>();

    currentLatLng: LatLng;

    marker: any = undefined;

    points: any = [
        { lat: -20.230617558978773, lng: -40.2763159275055 },
        { lat: -20.244855959480313, lng: -40.26429963111878 },
        { lat: -20.247387074660265, lng: -40.297945261001594 },
        { lat: -20.226503965892964, lng: -40.309961557388306 },
        { lat: -20.29802183605071, lng: -40.31064820289612 },
        { lat: -20.3136277, lng: -40.2969136 },
        { lat: -20.3132016, lng: -40.2963147 }
    ];

    baseIcon: any = new BaseIcon();

    constructor( private mapService: MapService, private router: Router ) { }

    newDemand() {
        this.mapService.map.closePopup();
        this.onNewDemand.emit();
    }

    ngOnInit() {
        let map = L.map( 'map', {
            zoomControl: false,
            center: L.latLng( -20.315894186649725, -40.29565483331681 ),
            zoom: 11,
            minZoom: 7,
            maxZoom: 18,
            maxBounds: L.latLngBounds( L.latLng( -21.361013117950915, -41.97223663330079 ),
                L.latLng( -17.853290114098012, -39.52228546142579 ) ),
            layers: [ this.mapService.baseMaps.MapBox ]
        });

        L.control.zoom( { position: 'topright' }).addTo( map );
        L.control.scale().addTo( map );

        map.on( 'click', ( e: any ) => {
            if ( this.marker ) {
                map.removeLayer( this.marker );
            }

            console.log( e.latlng );
            this.onLocationChanged.emit( e.latlng );

            this.marker = L.marker( e.latlng, {
                icon: new BaseIcon( { className: 'user-icon' }),
                draggable: true
            })
                .bindPopup( this.PopUpContent, {
                    offset: L.point( 12, 6 )
                })
                .addTo( map )
                .openPopup();


            this.marker.on( 'moveend', ( moveEvent: any ) => {
                this.onLocationChanged.emit( moveEvent.target._latlng );
            });
        });

        let markersGroup = L.markerClusterGroup();

        markersGroup.addLayers(
            this.points.map(
                ( latLng: any, i: number ) =>
                    L.marker( latLng, { icon: this.baseIcon })
                        .bindPopup( 'Marker ' + i, { offset: L.point( 12, 6 ) })
            )
        );

        map.addLayer( markersGroup );

        let locateControl = L.control.locate( { position: 'topright', keepCurrentZoomLevel: true }).addTo( map );
        locateControl.start();

        this.mapService.map = map;
    }

    private get PopUpContent(): HTMLElement {
        let btn = document.createElement( 'BUTTON' );
        btn.className = 'btn btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color';
        btn.textContent = 'Enviar Sugestão';
        btn.addEventListener( 'click', this.newDemand.bind( this ) );
        return btn;
    }
}
