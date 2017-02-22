import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { UserManager, User } from 'oidc-client';
import { settings } from './settings';

@Injectable()
export class AuthenticationService {

    oidcSettings: any = {
        authority: settings.authentication.authority,
        client_id: settings.authentication.client_id,
        // redirect_uri: settings.authentication.redirect_uri,
        popup_redirect_uri: settings.authentication.redirect_uri,
        popupWindowFeatures: 'location=no,toolbar=no,width=768,height=800,left=100,top=100',
        // popupWindowTarget: ,

        post_logout_redirect_uri: settings.authentication.post_logout_redirect_uri,
        redirectNavigator: settings.authentication.post_logout_redirect_uri,
        response_type: settings.authentication.response_type,
        scope: settings.authentication.scope,

        silent_redirect_uri: settings.authentication.silent_redirect_uri,
        automaticSilentRenew: true,
        // silentRequestTimeout:10000,
        revokeAccessTokenOnSignout: true,
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

    logoutPopup() {
        return this.manager.signoutPopup();
        /*return this.getAuthHeaders()
            .then( headers =>
                this.http.get( `${settings.authentication.authority}connect/endsession`, { headers: headers })
                    .map(( response: Response ) => response.json() ).toPromise()
                    .then( response => console.log( response ) )
                    .catch( error => console.log( error ) )
            );*/
    }

    getAuthHeaders(): Promise<Headers> {
        return this.getUser()
            .then(( user: any ) => {
                if ( user ) {
                    let headers = new Headers();
                    headers.append( 'Authorization', user.token_type + ' ' + user.access_token );
                    return headers;
                } else {
                    return {};
                }
            })
            .catch(() => { });
    }

    trySilentLogin() {
        return this.manager.signinSilent()
            .then( user => console.log( 'user', user ) )
            .catch( error => console.log( 'error', error ) );
    }

    getUserInfo(): Promise<any> {
        return this.getAuthHeaders()
            .then( headers =>
                this.http.get( `${settings.authentication.authority}connect/userinfo`, { headers: headers })
                    .map(( response: Response ) => response.json() ).toPromise()
            );
    }
}
