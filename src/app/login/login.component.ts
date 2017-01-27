import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from 'oidc-client';

@Component( {
    moduleId: module.id,
    selector: 'login',
    providers: [ AuthenticationService ], // , Router ],
    templateUrl: 'login.template.html',
    styleUrls: [ orchardModulePath + 'login.component.css' ],

})
export class LoginComponent {

    /**
     * Creates an instance of LoginComponent.
     * 
     * 
     * @memberOf LoginComponent
     */
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService ) {

        console.log( 'constructor LoginComponent' );
        this.authenticationService.userLoadededEvent.subscribe(( user: User ) => {
            if ( user ) {
                this.router.navigate( [ 'form-sugestao' ] );
            }
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf LoginComponent
     */
    login() {
        // window.location.href = `https://acessocidadao.es.gov.br/Conta/Entrar?ReturnUrl=${encodeURI( window.location.href )}`;
        this.authenticationService.popupSignin();
    }
}





