import 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'oidc-client';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { AuthenticationService } from '../shared/authentication.service';
import { Demand } from './model/demand';
import { IDistrict, ITheme } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'form-sugestao',
    providers: [ MapeandoESService, AuthenticationService ],
    templateUrl: 'form-sugestao.template.html',
    styleUrls: [ settings.orchardModulePath + 'form-sugestao.component.css' ]
})
export class FormSugestaoComponent implements OnInit {
    districts: any[];
    categories: any[];
    themes: any[];
    sources: any[];

    model: Demand = {
        externalUserId: -1,
        categoryId: '-1',
        districts: [],
        themes: [],
        sourceId: '',
        title: '',
        description: '',
        pins: []
    };

    constructor( private router: Router,
                 private mapeandoESService: MapeandoESService,
                 private authenticationService: AuthenticationService ) {
        this.authenticationService.userLoadededEvent.subscribe(( user: User ) => {
            if ( !user ) {
                this.router.navigate( [ 'login' ] );
            }
        });
        this.authenticationService.getUser();
    }

    ngOnInit() {
        this.mapeandoESService.getDistricts().subscribe( districts => this.districts = districts );
        this.mapeandoESService.getCategories().subscribe( categories => this.categories = categories );
        this.mapeandoESService.getThemes().subscribe( themes => this.themes = themes );
        this.mapeandoESService.getSources().subscribe( sources => this.sources = sources );
    }

    toggleDistrict( e: any, district: IDistrict ) {
        this.model.districts = this.toggleCheckbox( e, district, this.model.districts );
    }

    toggleThemes( e: any, theme: ITheme ) {
        this.model.themes = this.toggleCheckbox( e, theme, this.model.themes );
    }

    toggleCheckbox( e: any, obj: any, list: any[] ): any[] {
        return e.target.checked ? list.concat( [ obj ] ) : list.filter( item => item.id !== obj.id );
    }

    sendDemand( data: Demand ) {
        let newDemand: any = {
            title: this.model.title,
            description: this.model.title,
            externalUserId: this.model.externalUserId,
            categoryId: this.model.categoryId,
            districts: this.model.districts,
            themes: this.model.themes,
            sourceId: this.model.sourceId,
            pins: this.model.pins
        };

        this.mapeandoESService.saveDemand( newDemand )
            .subscribe(( response: any ) => console.log( response ) );
    }
}
