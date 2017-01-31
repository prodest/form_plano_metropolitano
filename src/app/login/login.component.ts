import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from 'oidc-client';
import { settings } from '../shared/settings';
import { ListSugestaoComponent } from '../list-sugestao/list-sugestao.component';

@Component( {
    moduleId: module.id,
    selector: 'login',
    providers: [ AuthenticationService, ListSugestaoComponent ],
    template: `<div class="text-center">
                    <p>Para fazer sua sugestão é necessário entrar com sua conta do <b>Acesso Cidadão ES</b></p>
                    <div class="recent-read-more learn-more">
                    <button (click)="login()" 
                            title="Entrar pelo Acesso Cidadão" 
                            class="btn btn-primary btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color">Entrar com o Acesso Cidadão</button>
                    </div>    
               </div>
               <list-sugestao></list-sugestao>`,
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





