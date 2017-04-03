import 'rxjs/Rx';
import { LatLng } from 'leaflet';
import { User } from 'oidc-client';
import { Component, trigger, state, style, transition, animate, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'form-root',
    providers: [ AuthenticationService, MapeandoESService ],
    template: `<login [autoShow]="true" (onUserLogin)="onLogin($event)" *ngIf="newDemand && !authorized"></login>
        <form-demand 
            [user]="user" 
            [latlng]="currentLatLng" 
            (onDemandSaved)="onDemandSaved()"
            (onUserNotSignedIn)="onUserNotSignedIn()"
            *ngIf="newDemand && authorized"></form-demand> 

        <div *ngIf="!newDemand">
            <div class="row info-mapa">
                <div class="col-lg-12">
                    <h4>Para enviar sugestôes
                    <button 
                        (click)="onNewDemand()"
                        class="btn-enviar-sugestao btn btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color">
                        CLIQUE AQUI
                    </button>
                    </h4>
                </div>
            </div>
            
            <div class="row info-mapa">
                <div class="col-lg-12">
                    <p class="titulo-contribuicoes">
                        Veja as contribuições enviadas pelos cidadãos metropolitanos:
                    </p>
                </div>
            </div>
            <map-demand (onNewDemand)="onNewDemand()" (onLocationChanged)="onLocationChanged($event)" [demands]="demands"></map-demand>
            <div class="row">
                <div class="col-lg-12">
                    <filter-demand (onFilterDemands)="onFilterDemands($event)"></filter-demand>
                    <list-demand [demands]="demands" [showModeration]="isModerator"></list-demand>
                </div>
            </div>`,
    styleUrls: [ settings.orchardModulePath + 'form-root.component.css' ]
})
export class FormRootComponent implements OnInit {
    user: any;
    newDemand: boolean = false;
    currentLatLng: LatLng = undefined;
    demands: any[] = [];

    constructor( private router: Router,
        private authenticationService: AuthenticationService,
        private mapeandoESService: MapeandoESService ) { }

    get isModerator(): boolean {
        if ( this.user && this.user.profile && this.user.profile.permissao ) {
            return this.authenticationService.userAuthorized( 'moderador', '', this.user.profile.permissao );
        }
        return false;
    }

    ngOnInit() {
        this.init();
    }

    loadDemands() {
        this.authenticationService.getValidUser()
            .then( user => {
                if ( user ) {
                    this.user = user;
                    if ( this.isModerator ) {
                        this.loadAllDemands();
                    }
                }
                this.loadAprovedDemands();
            })
            .catch(() => {
                this.authenticationService.removeUser();
                this.init();
            });
    }

    loadAprovedDemands( filters?: any ) {
        this.mapeandoESService.getDemands( filters ).subscribe( demands => this.demands = demands );
    }

    loadAllDemands( filters?: any ) {
        this.mapeandoESService.getSecureDemands( filters ).then( demands => this.demands = demands );;
    }

    private get authorized() {
        return this.user && this.user.profile && this.user.profile.email;
    }

    onFilterDemands( filters: any ) {
        if ( this.isModerator ) {
            this.mapeandoESService.getSecureDemands( filters ).then( demands => this.demands = demands );;
        } else {
            this.mapeandoESService.getDemands( filters ).subscribe( demands => this.demands = demands );;
        }
    }

    onNewDemand() {
        this.newDemand = true;
    }

    onLocationChanged( latlng: LatLng ) {
        this.currentLatLng = latlng;
    }

    onDemandSaved() {
        this.init();
    }

    onLogin( user: User ) {
        this.user = user;
    }

    onUserNotSignedIn() {
        this.init();
    }

    init() {
        this.newDemand = false;
        this.user = undefined;
        this.loadDemands();
    }
}
