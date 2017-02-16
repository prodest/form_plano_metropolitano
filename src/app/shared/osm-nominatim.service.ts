import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class OSMNominatimService {

    constructor( private http: Http ) {
    }

    getLocationName( lat: number, lng: number ): Observable<any> {
        return this.http
            .get( `http://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}` )
            .map(( res: Response ) => res.json() );
    }
}
