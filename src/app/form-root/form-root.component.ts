import 'rxjs/Rx';
import { LatLng } from 'leaflet';
import { User } from 'oidc-client';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'form-root',
    providers: [ AuthenticationService ],
    template: `<login *ngIf="newDemand && !authorized"></login>
               <form-demand 
                    [user]="user" 
                    [latlng]="currentLatLng" 
                    (onDemandSaved)="onDemandSaved()"
                    *ngIf="newDemand && authorized"></form-demand> 
               <map-demand 
                    (onNewDemand)="onNewDemand()"
                    (onLocationChanged)="onLocationChanged($event)"></map-demand>`,
    styleUrls: [ settings.orchardModulePath + 'form-root.component.css' ]
})
export class FormRootComponent {

    user: any;
    newDemand: boolean = false;
    currentLatLng: LatLng = undefined;

    constructor( private router: Router,
        private authenticationService: AuthenticationService ) {
        this.clean();

        this.authenticationService.getUserInfo()
            .then( user => this.user = user )
            .catch(() => {
                this.authenticationService.removeUser();
                this.clean();
            });

        this.authenticationService.userLoadededEvent.subscribe(( user: User ) => {
            console.log( user.profile );
            this.user = user.profile;
        });
    }

    private get authorized() {
        return this.user && this.user.email;
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

    clean() {
        this.user = undefined;
    }
}
