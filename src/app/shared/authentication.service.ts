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
                console.log( 'get User Sucess', user );
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
        this.manager.events.addUserUnloaded(( e ) => {
            /*if ( !environment.production ) {
                console.log( 'user unloaded' );
            }*/
            this.loggedIn = false;
        });

        this.manager.events.addUserLoaded(( user: User ) => {
            this.userLoadededEvent.emit( user );
        });
    }

    popupSignin() {
        this.manager.signinPopup( { state: 'some data' })
            .then(( user ) => console.log( 'user signed in with popup', user ) )
            .catch( err => console.log( err ) );
    }

    clearState() {
        this.manager.clearStaleState().then( function () {
            console.log( 'clearStateState success' );
        }).catch( function ( e ) {
            console.log( 'clearStateState error', e.message );
        });
    }

    getUser() {
        this.manager.getUser().then(( user ) => {
            console.log( 'got user', user );
            this.userLoadededEvent.emit( user );
        }).catch( function ( err ) {
            console.log( err );
        });
    }

    removeUser() {
        this.manager.removeUser().then(() => {
            this.userLoadededEvent.emit( null );
            console.log( 'user removed' );
        }).catch( function ( err ) {
            console.log( err );
        });
    }

    startSigninMainWindow() {
        this.manager.signinRedirect( { data: 'some data' }).then( function () {
            console.log( 'signinRedirect done' );
        }).catch( function ( err ) {
            console.log( err );
        });
    }

    endSigninMainWindow() {
        this.manager.signinRedirectCallback().then( function ( user ) {
            console.log( 'signed in', user );
        }).catch( function ( err ) {
            console.log( err );
        });
    }

    startSignoutMainWindow() {
        this.manager.signoutRedirect().then( function ( resp ) {
            console.log( 'signed out', resp );
            setTimeout( 5000, () => {
                console.log( 'testing to see if fired...' );

            });
        }).catch( function ( err ) {
            console.log( err );
        });
    };

    endSignoutMainWindow() {
        this.manager.signoutRedirectCallback().then( function ( resp ) {
            console.log( 'signed out', resp );
        }).catch( function ( err ) {
            console.log( err );
        });
    };
    /**
     * Example of how you can make auth request using angulars http methods.
     * @param options if options are not supplied the default content type is application/json
     */
    AuthGet( url: string, options?: RequestOptions ): Observable<Response> {

        if ( options ) {
            options = this._setRequestOptions( options );
        } else {
            options = this._setRequestOptions();
        }
        return this.http.get( url, options );
    }
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthPut( url: string, data: any, options?: RequestOptions ): Observable<Response> {

        let body = JSON.stringify( data );

        if ( options ) {
            options = this._setRequestOptions( options );
        } else {
            options = this._setRequestOptions();
        }
        return this.http.put( url, body, options );
    }
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthDelete( url: string, options?: RequestOptions ): Observable<Response> {

        if ( options ) {
            options = this._setRequestOptions( options );
        } else {
            options = this._setRequestOptions();
        }
        return this.http.delete( url, options );
    }
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthPost( url: string, data: any, options?: RequestOptions ): Observable<Response> {

        let body = JSON.stringify( data );

        if ( options ) {
            options = this._setRequestOptions( options );
        } else {
            options = this._setRequestOptions();
        }
        return this.http.post( url, body, options );
    }

    /*    private _setAuthHeaders( user: any ) {
            this.authHeaders = new Headers();
            this.authHeaders.append( 'Authorization', user.token_type + " " + user.access_token );
            this.authHeaders.append( 'Content-Type', 'application/json' );
        }*/

    private _setRequestOptions( options?: RequestOptions ) {

        if ( options ) {
            options.headers.append( this.authHeaders.keys[ 0 ], this.authHeaders.values[ 0 ] );
        } else {
            options = new RequestOptions( { headers: this.authHeaders, body: '' });
        }

        return options;
    }

}
