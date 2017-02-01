import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserManager, User } from 'oidc-client';
import { settings } from './settings';

@Injectable()
export class AuthenticationService {

    oidcSettings: any = {
        authority: settings.authentication.authority,
        client_id: settings.authentication.client_id,
        redirect_uri: settings.authentication.redirect_uri,
        // popupWindowFeatures: ,
        // popupWindowTarget: ,
        // post_logout_redirect_uri: 'http://localhost:3000/',
        response_type: settings.authentication.response_type,
        scope: settings.authentication.scope,

        // silent_redirect_uri: 'http://localhost:3000',
        automaticSilentRenew: true,
        // silentRequestTimeout:10000,

        filterProtocolClaims: true,
        loadUserInfo: true
    };

    manager: UserManager = new UserManager( this.oidcSettings );
    userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();
    currentUser: User;
    loggedIn: boolean = false;

    authHeaders: Headers;

    constructor( private http: Http ) {
        this.manager.getUser()
            .then(( user ) => {
                if ( user ) {
                    this.loggedIn = true;
                    this.currentUser = user;
                    this.userLoadededEvent.emit( user );
                } else {
                    this.loggedIn = false;
                }
            })
            .catch(( err ) => {
                this.loggedIn = false;
            });
        this.manager.events.addUserUnloaded( e => this.loggedIn = false );

        this.manager.events.addUserLoaded(( user: User ) => this.userLoadededEvent.emit( user ) );
    }

    popupSignin(): Promise<User> {
        return this.manager.signinPopup();
    }

    clearState(): Promise<void> {
        return this.manager.clearStaleState();
    }

    getUser(): Promise<User> {
        return this.manager.getUser().then(( user ) => {
            this.userLoadededEvent.emit( user );
            return user;
        });
    }

    removeUser(): Promise<null> {
        return this.manager.removeUser().then(() => {
            this.userLoadededEvent.emit( null );
            return null;
        });
    }

    getAuthHeaders(): Promise<Headers> {
        return this.getUser().then(( user: any ) => {
            let headers = new Headers();
            headers.append( 'Authorization', user.token_type + ' ' + user.access_token );
            headers.append( 'Content-Type', 'application/json' );
            return headers;
        });
    }
}
