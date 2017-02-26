import 'rxjs/Rx';
// import 'leaflet';
import { LatLng } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.locatecontrol';
import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { settings } from '../shared/settings';
import { MapService } from '../shared/map.service';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { BaseIcon } from './base-icon.class';
import { geoJsonGrandeVitoria } from './grande-vitoria';
declare let L: any;

@Component( {
    moduleId: module.id,
    selector: 'map-demand',
    providers: [ MapService, MapeandoESService ],
    template: `<div id="map"></div>`,
    styleUrls: [ settings.orchardModulePath + 'map.component.css' ],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, OnChanges {
    @Output() onNewDemand = new EventEmitter<void>();
    @Output() onLocationChanged = new EventEmitter<LatLng>();

    @Input() showNewDemandButton: boolean = true;
    @Input() demands: any[] = [];
    @Input() currentLatLng: LatLng;

    zoomControl: any;
    marker: any = undefined;
    markersGroupDemands: any = undefined;
    baseIcon: any = new BaseIcon();

    private constant: number[];
    private multiple: number[];
    private polyX: number[];
    private polyY: number[];

    constructor( private mapService: MapService, private router: Router, private mapeandoESService: MapeandoESService ) { }

    newDemand() {
        this.mapService.map.closePopup();
        this.onNewDemand.emit();
    }

    ngOnInit() {
        this.translateGeoJson( geoJsonGrandeVitoria );

        let map = this.createMap();
        if ( this.currentLatLng ) {
            this.marker = L.marker( this.currentLatLng, {
                icon: new BaseIcon( { className: 'user-icon' }),
                draggable: true
            })
                .addTo( map );

            map.setView( this.currentLatLng, 13 );
        }

        // this.setUserLocation( map );
        this.mapService.map = map;
    }

    ngOnChanges( changes: SimpleChanges ) {
        // changes.prop contains the old and the new value...
        if ( this.mapService.map && changes[ 'demands' ] ) {
            this.loadMarkers( this.mapService.map );
        }
    }

    public disableMap() {
        this.mapService.map.dragging.disable();
        this.mapService.map.touchZoom.disable();
        this.mapService.map.doubleClickZoom.disable();
        this.mapService.map.scrollWheelZoom.disable();
        this.mapService.map.boxZoom.disable();
        this.mapService.map.keyboard.disable();
        this.mapService.map.off( 'click' );
        if ( this.mapService.map.tap ) { this.mapService.map.tap.disable(); }
        document.getElementById( 'map' ).style.cursor = 'default';

        this.zoomControl.disable();
        this.clearMarker( this.mapService.map );
        this.clearLocation();
    }

    public enableMap() {
        this.mapService.map.dragging.enable();
        this.mapService.map.touchZoom.enable();
        this.mapService.map.doubleClickZoom.enable();
        this.mapService.map.scrollWheelZoom.enable();
        this.mapService.map.boxZoom.enable();
        this.mapService.map.keyboard.enable();
        this.mapService.map.on( 'click', this.mapClick( this.mapService.map ) );
        if ( this.mapService.map.tap ) { this.mapService.map.tap.enable(); }
        document.getElementById( 'map' ).style.cursor = 'grab';

        this.zoomControl.enable();
    }

    private clearLocation() {
        this.currentLatLng = undefined;
    }

    private clearMarker( map: any ) {
        if ( this.marker ) {
            map.removeLayer( this.marker );
        }
    }

    /*private setUserLocation( map: any ) {
        let locateControl = L.control.locate( { position: 'topright', keepCurrentZoomLevel: true }).addTo( map );
        locateControl.start();
    }*/

    private popupTemplate( demand: any ) {
        let subTitleTemplate = '';
        demand.themes.forEach(( theme: any ) => {
            subTitleTemplate += `${theme.name}, `;
        });
        subTitleTemplate = subTitleTemplate.substring( 0, subTitleTemplate.length - 2 );
        if ( demand.districts.length > 0 ) {
            subTitleTemplate += '<i class="fa fa-map-marker" aria-hidden="true"></i>';
            demand.districts.forEach(( theme: any ) => {
                subTitleTemplate += `${theme.name}, `;
            });
            subTitleTemplate = subTitleTemplate.substring( 0, subTitleTemplate.length - 2 );
        }
        return `<h3>${demand.title}</h3>
                <h4>${subTitleTemplate}</h4>
                <p>${demand.description}</p>`;
    }

    private loadMarkers( map: any ) {
        if ( this.markersGroupDemands ) {
            map.removeLayer( this.markersGroupDemands );
        }

        this.markersGroupDemands = L.markerClusterGroup();
        this.markersGroupDemands.addLayers(
            this.demands
                .filter( demand => demand.pins && demand.pins.length > 0 && demand.pins[ 0 ].location )
                .map(( demand ) => {
                    let pin: any = demand.pins[ 0 ];
                    return L.marker( [ pin.location.lat, pin.location.lon ], { icon: this.baseIcon })
                        .bindPopup( this.popupTemplate( demand ), { offset: L.point( 12, 6 ) });
                }) );
        map.addLayer( this.markersGroupDemands );
    };

    private createMap() {
        let map = L.map( 'map', {
            zoomControl: false,
            center: L.latLng( -20.315894186649725, -40.29565483331681 ),
            zoom: 11,
            minZoom: 7,
            maxZoom: 18,
            maxBounds: L.latLngBounds( L.latLng( -21.361013117950915, -41.97223663330079 ),
                L.latLng( -17.853290114098012, -39.52228546142579 ) ),
            layers: [ this.mapService.baseMaps.OpenStreetMap ]
        });

        // Add zoom control
        this.zoomControl = L.control.zoom( { position: 'topright' }).addTo( map );
        L.control.scale().addTo( map );

        // Print clickble region on map
        let coords = geoJsonGrandeVitoria.geometries.coordinates.map( a => L.latLng( a[ 1 ], a[ 0 ] ) );
        L.polygon( coords, { stroke: false, opacity: 0.2 }).addTo( map );

        // Set map click
        map.on( 'click', this.mapClick( map ) );

        return map;
    }

    private mapClick( map: any ) {
        return ( e: any ) => {
            if ( !this.pointInPolygon( this.polyY, this.polyX, this.constant, this.multiple, { x: e.latlng.lng, y: e.latlng.lat }) ) {
                alert( 'Por favor, selecione uma região da Grande Vitória' );
                return;
            }

            if ( this.marker ) {
                map.removeLayer( this.marker );
            }

            console.log( e.latlng );
            this.currentLatLng = e.latlng;
            this.onLocationChanged.emit( e.latlng );

            this.marker = L.marker( e.latlng, {
                icon: new BaseIcon( { className: 'user-icon' }),
                draggable: true
            });

            if ( this.showNewDemandButton ) {
                this.marker.bindPopup( this.PopUpContent, { offset: L.point( 12, 6 ) });
            }
            this.marker.addTo( map );
            if ( this.showNewDemandButton ) {
                this.marker.openPopup();
            }

            this.marker.on( 'moveend', ( moveEvent: any ) => {
                let latlng = moveEvent.target._latlng;
                if ( this.pointInPolygon( this.polyY, this.polyX, this.constant, this.multiple, { x: latlng.lng, y: latlng.lat }) ) {
                    this.onLocationChanged.emit( latlng );
                } else {
                    this.marker.setLatLng( this.currentLatLng );
                }

            });
        };
    }

    private get PopUpContent(): HTMLElement {
        let btn = document.createElement( 'BUTTON' );
        btn.className = 'btn btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color';
        btn.textContent = 'Enviar Sugestão';
        btn.addEventListener( 'click', this.newDemand.bind( this ) );
        return btn;
    }

    //  Globals which should be set before calling these functions:
    //
    //  int    polyCorners  =  how many corners the polygon has (no repeats)
    //  float  polyX[]      =  horizontal coordinates of corners
    //  float  polyY[]      =  vertical coordinates of corners
    //  float  x, y         =  point to be tested
    //
    //  The following global arrays should be allocated before calling these functions:
    //
    //  float  constant[] = storage for precalculated constants (same size as polyX)
    //  float  multiple[] = storage for precalculated multipliers (same size as polyX)
    //
    //  (Globals are used in this example for purposes of speed.  Change as
    //  desired.)
    //
    //  USAGE:
    //  Call precalc_values() to initialize the constant[] and multiple[] arrays,
    //  then call pointInPolygon(x, y) to determine if the point is in the polygon.
    //
    //  The function will return YES if the point x,y is inside the polygon, or
    //  NO if it is not.  If the point is exactly on the edge of the polygon,
    //  then the function may return YES or NO.
    //
    //  Note that division by zero is avoided because the division is protected
    //  by the "if" clause which surrounds it.

    private translateGeoJson( polyGeoJson: any ) {
        this.polyX = [];
        this.polyY = [];

        polyGeoJson.geometries.coordinates.forEach(( coords: any ) => {
            this.polyX.push( coords[ 0 ] );
            this.polyY.push( coords[ 1 ] );
        });

        this.precalc_values( this.polyY, this.polyX );
    }

    private precalc_values( polyY: number[], polyX: number[] ) {
        let j = polyY.length - 1;
        this.constant = [];
        this.multiple = [];

        for ( let i = 0; i < polyY.length; i++ ) {
            if ( polyY[ j ] === polyY[ i ] ) {
                this.constant[ i ] = polyX[ i ];
                this.multiple[ i ] = 0;
            } else {
                this.constant[ i ] =
                    polyX[ i ] - ( polyY[ i ] * polyX[ j ] )
                    /
                    ( polyY[ j ] - polyY[ i ] ) + ( polyY[ i ] * polyX[ i ] ) / ( polyY[ j ] - polyY[ i ] );

                this.multiple[ i ] = ( polyX[ j ] - polyX[ i ] ) / ( polyY[ j ] - polyY[ i ] );
            }
            j = i;
        }
    }

    private pointInPolygon( polyY: any, polyX: any, constant: any, multiple: any, point: any ): boolean {
        let j: number = polyY.length - 1;
        let oddNodes = false;

        for ( let i = 0; i < polyY.length; i++ ) {
            if ( ( polyY[ i ] < point.y && polyY[ j ] >= point.y
                || polyY[ j ] < point.y && polyY[ i ] >= point.y ) ) {
                oddNodes = oddNodes !== ( point.y * multiple[ i ] + constant[ i ] < point.x );
            }
            j = i;
        }

        return oddNodes;
    }
}
