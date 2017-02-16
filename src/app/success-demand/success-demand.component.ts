import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'success-demand',
    template: `  <div class="text-center">
                    <p>Sugestão enviada.</p>
                    <div class="recent-read-more learn-more">
                    <button (click)="newDemand()" title="Nova Demanda" class="btn btn-primary btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color">Enviar nova sugestão</button>
                    </div>    
                </div>`,
    styleUrls: [ settings.orchardModulePath + 'success-demand.component.css' ]
})
export class SuccessDemandComponent {

    /**
     * Creates an instance of LoginComponent.
     * 
     * @param {Router} router
     * 
     * @memberOf LoginComponent
     */
    constructor( private router: Router ) { }

    /**
     * 
     * 
     * 
     * @memberOf LoginComponent
     */
    newDemand() {
        this.router.navigate( [ 'participe' ] );
    }
}





