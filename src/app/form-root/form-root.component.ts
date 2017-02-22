import 'rxjs/Rx';
import { LatLng } from 'leaflet';
import { User } from 'oidc-client';
import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'form-root',
    providers: [ AuthenticationService, MapeandoESService ],
    template: `<div class="animate-open">
            <login [autoShow]="true" (onUserLogin)="onLogin($event)" *ngIf="newDemand && !authorized"></login>
        </div>
        <form-demand 
            [user]="user" 
            [latlng]="currentLatLng" 
            (onDemandSaved)="onDemandSaved()"
            *ngIf="newDemand && authorized"></form-demand> 

        <div *ngIf="!newDemand">
            <h4>Para enviar uma sugestão clique no botão ao lado ou selecione um local no mapa.</h4>
            <div class="row info-mapa">
                <div class="col-lg-12">
                    <p class="titulo-contribuicoes">
                        Abaixo as contribuições enviadas pelos nossos cidadãos metropolitanos:
                    </p>
                    <button 
                        (click)="onNewDemand()"
                        class="btn-enviar-sugestao btn btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color">
                        Enviar Sugestão
                    </button>
                </div>
            </div>
            <map-demand (onNewDemand)="onNewDemand()" (onLocationChanged)="onLocationChanged($event)" [demands]="aprovedDemands"></map-demand>
            <div class="row">
                <div class="col-lg-12">
                    <filter-demand (onFilterDemands)="onFilterDemands($event)"></filter-demand>
                    <list-demand [demands]="aprovedDemands"></list-demand>
                </div>
            </div>
        </div>`,
    styleUrls: [ settings.orchardModulePath + 'form-root.component.css' ],
    animations: [
        trigger( 'loginState', [
            state( 'notVisible', style( {
                height: 'auto'
            }) ),
            state( 'visible', style( {
                height: 1
            }) ),
            transition( 'notVisible => visible', animate( '1000ms ease-in' ) ),
            transition( 'visible => notVisible', animate( '1000ms ease-out' ) )
        ] )
    ]
})
export class FormRootComponent {

    user: any;
    newDemand: boolean = false;
    currentLatLng: LatLng = undefined;
    aprovedDemands: any[] = [];

    constructor( private router: Router,
        private authenticationService: AuthenticationService,
        private mapeandoESService: MapeandoESService ) {
        this.clean();

        this.authenticationService.getUserInfo()
            .then( user => this.user = user )
            .catch(() => {
                this.authenticationService.removeUser();
                this.clean();
            });
    }

    ngOnInit() {
        this.mapeandoESService.getAllDemands()
            .subscribe( demands => this.aprovedDemands = demands );
    }

    private get authorized() {
        return this.user && this.user.email;
    }

    onFilterDemands( filters: any ) {
        if ( filters ) {
            this.mapeandoESService.getDemands( filters ).subscribe( demands => this.aprovedDemands = demands );
        } else {
            this.mapeandoESService.getAllDemands().subscribe( demands => this.aprovedDemands = demands );
        }
    }

    onNewDemand() {
        this.newDemand = true;
    }

    onLocationChanged( latlng: LatLng ) {
        this.currentLatLng = latlng;
    }

    onDemandSaved() {
        this.newDemand = false;
    }

    onLogin( user: User ) {
        this.user = user.profile;
    }

    clean() {
        this.user = undefined;
    }
}
