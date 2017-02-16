import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ICategory, IDemand, IDistrict, ISource, ITheme } from '@prodest/mapeandoes-typings';
import { settings } from './settings';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class MapeandoESService {
    private baseUrl: string;

    constructor( private http: Http, private authenticationService: AuthenticationService ) {
        this.baseUrl = settings.apiBaseUrl;
    }

    getCategories(): Observable<ICategory[]> {
        return this.http.get( `${this.baseUrl}/categories` )
            .map(( response: Response ) => response.json() as ICategory[] );
    }

    getDistricts(): Observable<IDistrict[]> {
        return this.http.get( `${this.baseUrl}/districts` )
            .map(( response: Response ) => response.json() as IDistrict[] );
    }

    getAllDemands(): Observable<IDemand[]> {
        return this.http.get( `${this.baseUrl}/demands` )
            .map(( response: Response ) => response.json() as IDemand[] );
    }

    getUnfilteredAllDemands(): Promise<IDemand[]> {
        return this.authenticationService.getAuthHeaders().then( headers => {
            return this.http.get( `${this.baseUrl}/secure/demands`, { headers: headers })
                .map(( response: Response ) => response.json() as IDemand[] )
                .toPromise();
        });
    }

    getDemands( filters: any ): Observable<IDemand[]> {
        let body = { where: {} };
        for ( let key in filters ) {
            if ( filters[ key ] !== '' ) {
                body.where[ key + 'Id' ] = filters[ key ].id;
            }
        }

        return this.http.post( `${this.baseUrl}/demands/query`, body )
            .map(( response: Response ) => response.json().result as IDemand[] );
    }

    getUnfilteredDemands( filters: any ): Promise<IDemand[]> {
        let body = { where: {} };
        for ( let key in filters ) {
            if ( filters[ key ] !== '' ) {
                body.where[ key + 'Id' ] = filters[ key ].id;
            }
        }
        return this.authenticationService.getAuthHeaders().then( headers => {
            return this.http.post( `${this.baseUrl}/secure/demands/query`, body, { headers: headers } )
                .map(( response: Response ) => response.json().result as IDemand[] )
                .toPromise();
        });
    }

    getSources(): Observable<ISource[]> {
        return this.http.get( `${this.baseUrl}/sources` )
            .map(( response: Response ) => response.json() as ISource[] );
    }

    getThemes(): Observable<ITheme[]> {
        return this.http.get( `${this.baseUrl}/themes` )
            .map(( response: Response ) => response.json() as ITheme[] );
    }

    saveDemand( data: any ): Promise<any> {
        return this.authenticationService.getAuthHeaders().then( headers => {
            return this.http.post( `${this.baseUrl}/secure/demands`, data, { headers: headers })
                .map(( response: Response ) => response.json() )
                .toPromise();
        });
    }
}
