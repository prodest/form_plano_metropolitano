import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ICategory, IDemand, IDistrict, ISource, ITheme } from '@prodest/mapeandoes-typings';
import { settings } from './settings';

@Injectable()
export class MapeandoESService {
    baseUrl = settings.apiBaseUrl;

    constructor( private http: Http ) {

    }

    getCategories(): Observable<ICategory[]> {
        return this.http.get( `${this.baseUrl}/categories` )
            .map(( response: Response ) => response.json() as ICategory[] );
    }

    getDistricts(): Observable<IDistrict[]> {
        return this.http.get( `${this.baseUrl}/districts` )
            .map(( response: Response ) => response.json() as IDistrict[] );
    }

    getDemands(): Observable<IDemand[]> {
        return this.http.get( `${this.baseUrl}/demands` )
            .map(( response: Response ) => response.json() as IDemand[] );
    }

    getSources(): Observable<ISource[]> {
        return this.http.get( `${this.baseUrl}/sources` )
            .map(( response: Response ) => response.json() as ISource[] );
    }

    getThemes(): Observable<ITheme[]> {
        return this.http.get( `${this.baseUrl}/themes` )
            .map(( response: Response ) => response.json() as ITheme[] );
    }

    saveDemand( data: any ) {
        return this.http.post( `${this.baseUrl}/demands`, data )
            .map(( response: Response ) => response.json() );
    }
}
