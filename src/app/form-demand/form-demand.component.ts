import 'rxjs/Rx';
import { LatLng } from 'leaflet';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { AuthenticationService } from '../shared/authentication.service';
import { Demand } from './model/demand';
import { IDistrict, ITheme } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';
import { OSMNominatimService } from '../shared/osm-nominatim.service';

@Component( {
    moduleId: module.id,
    selector: 'form-demand',
    providers: [ MapeandoESService, AuthenticationService ],
    template: `<div class="col-lg-10 col-lg-offset-1">
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
                <div class="col-sm-6">
                    <label for="themes">Tema(s)</label>
                    <br>
                    <div class="checkbox-group">
                        <label *ngFor="let theme of themes">
                            <input type="checkbox" value="{{theme.id}}" (change)="toggleTheme($event, theme)"/>
                            <i class="fa fa-square-o fa-2x"></i>
                            <i class="fa fa-check-square-o fa-2x"></i>
                            <span> {{theme.name}}</span>
                        </label>
                    </div>
                </div>
                <div class="col-sm-6">
                    <label for="districts">Município(s) da Proposta</label>
                    <br>
                    <div class="checkbox-group">
                        <label *ngFor="let district of districts">
                            <input type="checkbox" name='{{district.name}}' value="{{district.id}}" (change)="toggleDistrict($event, district)"/>
                            <i class="fa fa-square-o fa-2x"></i>
                            <i class="fa fa-check-square-o fa-2x"></i>
                            <span> {{district.name}}</span>
                        </label>
                    </div>
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
            <button [disabled]="!demandForm.valid || !isCheckboxesValid" type="submit" class="btn btn-primary btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color btn-submit">
                Enviar <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                </button>
        </div>
    </form>
</div>`,
    styleUrls: [ settings.orchardModulePath + 'form-demand.component.css' ]
})
export class FormDemandComponent implements OnInit {
    demandForm: NgForm;
    @ViewChild( 'demandForm' ) currentForm: NgForm;

    @Input( 'latlng' ) currentlatlng: LatLng;
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
        pins: []
    };

    constructor( private router: Router,
        private mapeandoESService: MapeandoESService,
        private authenticationService: AuthenticationService,
        private oSMNominatimService: OSMNominatimService ) {
        /*this.authenticationService.getUserInfo()
            .then( user => this.user = user )
            .catch(() => {
                this.authenticationService.removeUser();
                this.router.navigate( [ 'login' ] );
            });*/
    }

    ngOnInit() {
        this.mapeandoESService.getDistricts().subscribe( districts => this.districts = districts );
        this.mapeandoESService.getCategories().subscribe( categories => this.categories = categories );
        this.mapeandoESService.getThemes().subscribe( themes => this.themes = themes );
        this.mapeandoESService.getSources().subscribe( sources => this.sources = sources );

        /*this.oSMNominatimService.getLocationName( e.latlng.lat, e.latlng.lng )
                .subscribe( locationInfo => console.log( locationInfo ) );*/
    }

    toggleDistrict( e: any, district: IDistrict ) {
        this.model.districts = this.toggleCheckbox( e, district, this.model.districts );
    }

    toggleTheme( e: any, theme: ITheme ) {
        this.model.themes = this.toggleCheckbox( e, theme, this.model.themes );
    }

    toggleCheckbox( e: any, obj: any, list: any[] ): any[] {
        return e.target.checked ? list.concat( [ obj ] ) : list.filter( item => item.id !== obj.id );
    }

    get isCheckboxesValid() {
        return this.model.districts.length > 0 && this.model.themes.length > 0;
    }

    onSubmit( model: Demand ) {
        if ( this.currentForm.valid ) {
            console.log( model );
        }

        let newDemand: any = {
            title: model.title,
            description: model.title,
            externalUserId: model.externalUserId,
            categoryId: model.categoryId,
            districts: model.districts,
            themes: model.themes,
            sourceId: model.sourceId,
            pins: [ this.currentlatlng ]
        };

        this.mapeandoESService.saveDemand( newDemand )
            .then(( response: any ) => this.onDemandSaved.emit() )
            .catch(( error: any ) => console.log( error ) );
    }

    logout() {
        this.authenticationService.logoutPopup();
        // this.authenticationService.removeUser();
        // this.router.navigate( [ 'login' ] );
    }
}
