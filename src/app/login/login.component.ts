import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from 'oidc-client';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'login',
    providers: [ AuthenticationService ],
    template: `<div class="text-center">
                   <p>Para fazer sua sugestão é necessário entrar com sua conta do <b>Acesso Cidadão ES</b></p>
                   <div class="recent-read-more learn-more">
                   <button (click)="login()" 
                           title="Entrar pelo Acesso Cidadão"
                           class="btn btn-primary btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color">Entrar com o Acesso Cidadão</button>
                   </div>    
               </div>`,
    styleUrls: [ settings.orchardModulePath + 'login.component.css' ]
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





