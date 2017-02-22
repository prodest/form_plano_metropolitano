import 'rxjs/Rx';
import { LatLng } from 'leaflet';
import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { AuthenticationService } from '../shared/authentication.service';
import { Demand } from './model/demand';
import { IDistrict, ITheme, IDemand } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';
import { OSMNominatimService } from '../shared/osm-nominatim.service';

@Component( {
    moduleId: module.id,
    selector: 'form-demand',
    providers: [ MapeandoESService, AuthenticationService ],
    template: `
    <div class="row">
        <div class="col-lg-10 col-lg-offset-1">
        <div class="row">
            <div class="col-lg-6 col-sm-6">
                <div class="form-group">
                    <label for="name">Nome</label>
                    <input name="name" class="form-control" disabled="disabled" value="{{user.nome}}" />
                </div>
            </div>
            <div class="col-lg-6 col-sm-6">
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input name="email" class="form-control" disabled="disabled" value="{{user.email}}" />
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="source">Instituição</label>
            <select name="source" class="form-control" required [(ngModel)]="model.sourceId" validationMessage="enter valid username">
                <option *ngFor="let source of sources" [value]="source.id">{{source.name}}</option>
            </select>
        </div>
        <form (ngSubmit)="onSubmit(model)" #demandForm="ngForm">
            <!-- <div class="form-group">
                <label for="category">Categoria</label>
                <select name="category" class="form-control" required [(ngModel)]="model.categoryId">
                    <option *ngFor="let category of categories" [value]="category.id">{{category.name}}</option>
                </select>
            </div>-->
            <div class="form-group">
                <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-12">
                        <label for="themes">Tema(s)</label>
                        <br>
                        <div class="checkbox-group">
                            <label *ngFor="let theme of themes" class="list-inline">
                                <input type="checkbox" value="{{theme.id}}" (change)="toggleTheme($event, theme)"/>
                                <i class="fa fa-square-o fa-2x"></i>
                                <i class="fa fa-check-square-o fa-2x"></i>
                                <span> {{theme.name}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="row">
                    <div class="col-sm-12 col-md-12 col-lg-12">
                        <label>Localização da Proposta</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12 col-md-5 col-lg-4">
                        <label class="radio-button">
                            <input name="radio-locatino" type="radio" value="district" 
                                   [(ngModel)]="model.locationType" 
                                   (click)="setMapView(false)" />
                            <i class="fa fa-circle-o fa-2x"></i>
                            <i class="fa fa-dot-circle-o fa-2x"></i>
                            <span>Por Município(s)</span>
                        </label>
                        <br>
                        <div class="checkbox-group">
                            <label *ngFor="let district of districts">
                                <input type="checkbox" 
                                    name='{{district.name}}' 
                                    value="{{district.id}}" 
                                    [checked]="district.checked"
                                    (change)="toggleDistrict($event, district)"
                                    [disabled]="model.locationType !== 'district'"/>
                                <i class="fa fa-square-o fa-2x"></i>
                                <i class="fa fa-check-square-o fa-2x"></i>
                                <span> {{district.name}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-7 col-lg-8">
                        <label class="radio-button">
                            <input name="radio-locatino" type="radio" value="geolocation" 
                                   [(ngModel)]="model.locationType"
                                   (click)="setMapView(true)" />
                            <i class="fa fa-circle-o fa-2x"></i>
                            <i class="fa fa-dot-circle-o fa-2x"></i>
                            <span>Pelo Mapa</span>
                        </label>
                        <br>
                        <map-demand #mapDemand
                            [showNewDemandButton]="false" 
                            [demands]="[]"
                            [currentLatLng]="this.currentlatlng"
                            (onNewDemand)="null" 
                            (onLocationChanged)="onLocationChanged($event)">
                        </map-demand>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="title">Título de sua contribuição</label>
                <input type="text" class="form-control" id="title" [(ngModel)]="model.title" required name="name">
            </div>
            <div class="form-group">
                <label for="description">Descrição</label>
                <textarea type="text" class="form-control" id="description" [(ngModel)]="model.description" name="text" required></textarea>
            </div>
            <div class="form-group text-right">
                <!-- <button class="btn btn-secondary btn-md btn-back-button btn-submit" (click)="logout()">
                    <i class="fa fa-long-arrow-left" aria-hidden="true"></i>
                    Utilizar outra conta
                    </button>-->
                <button [disabled]="!demandForm.valid || disableSubmit" type="submit" class="btn btn-primary btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color btn-submit">
                    Enviar <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                    </button>
            </div>
        </form>
    </div>
</div>`,
    styleUrls: [ settings.orchardModulePath + 'form-demand.component.css' ]
})
export class FormDemandComponent implements OnInit, AfterViewInit {
    demandForm: NgForm;
    @ViewChild( 'demandForm' ) currentForm: NgForm;
    @ViewChild( 'mapDemand' ) mapDemand: any;

    @Input( 'latlng' ) currentlatlng: LatLng = undefined;
    @Input( 'user' ) user: any;

    @Output() onDemandSaved = new EventEmitter<void>();

    districts: any[];
    categories: any[];
    themes: any[];
    sources: any[];

    model: Demand = {
        externalUserId: -1,
        categoryId: '-1',
        districts: [],
        themes: [],
        sourceId: '',
        title: '',
        description: '',
        pins: [],
        locationType: ''
    };

    constructor( private router: Router,
        private mapeandoESService: MapeandoESService,
        private authenticationService: AuthenticationService,
        private oSMNominatimService: OSMNominatimService ) { }

    ngOnInit() {
        this.mapeandoESService.getDistricts().subscribe( districts => this.districts = districts.map(( d: any ) => {
            d.checked = false;
            return d;
        }) );
        this.mapeandoESService.getCategories().subscribe( categories => this.categories = categories );
        this.mapeandoESService.getThemes().subscribe( themes => this.themes = themes );
        this.mapeandoESService.getSources().subscribe( sources => this.sources = sources );

        /*this.oSMNominatimService.getLocationName( e.latlng.lat, e.latlng.lng )
                .subscribe( locationInfo => console.log( locationInfo ) );*/

        this.model.locationType = this.currentlatlng ? 'geolocation' : 'district';
    }

    ngAfterViewInit() {
        this.setMapView( this.currentlatlng !== undefined );
    }

    setMapView( enable: boolean ) {
        if ( enable ) {
            this.model.districts = [];
            if ( this.districts ) {
                this.districts.forEach( i => i.checked = false );
            }
            this.mapDemand.enableMap();
        } else {
            this.mapDemand.disableMap();
            this.currentlatlng = undefined;
        }
    }

    toggleDistrict( e: any, district: any ) {
        district.checked = e.target.checked;
        this.model.districts = this.toggleCheckbox( e, district, this.model.districts );
    }

    toggleTheme( e: any, theme: ITheme ) {
        this.model.themes = this.toggleCheckbox( e, theme, this.model.themes );
    }

    toggleCheckbox( e: any, obj: any, list: any[] ): any[] {
        return e.target.checked ? list.concat( [ obj ] ) : list.filter( item => item.id !== obj.id );
    }

    get hasDefinedLocation() {
        return this.model.districts.length > 0 || this.currentlatlng !== undefined;
    }

    get disableSubmit(): boolean {
        return this.model.themes.length === 0 || !this.hasDefinedLocation;
    }

    onSubmit( model: Demand ) {
        if ( this.currentForm.valid ) {
            console.log( model );
        }

        let newDemand: any = {
            title: model.title,
            description: model.description,
            externalUserId: model.externalUserId,
            categoryId: model.categoryId,
            districts: model.districts.map( d => { delete d.checked; return d; }),
            themes: model.themes,
            sourceId: model.sourceId,
            pins: []
        };

        if ( this.currentlatlng ) {
            newDemand.pins.push( {
                location: {
                    lat: this.currentlatlng.lat,
                    lon: this.currentlatlng.lng
                }
            });
        }

        this.mapeandoESService.saveDemand( newDemand )
            .then(( response: any ) => this.onDemandSaved.emit() )
            .catch(( error: any ) => console.log( error ) );
    }

    onLocationChanged( latlng: LatLng ) {
        this.currentlatlng = latlng;
    }

    logout() {
        this.authenticationService.logoutPopup();
    }
}
