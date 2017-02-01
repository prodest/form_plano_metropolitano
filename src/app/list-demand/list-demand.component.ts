import 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { IDemand } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'list-sugestao',
    providers: [ MapeandoESService, FormBuilder ],
    templateUrl: 'list-sugestao.template.html',
    styleUrls: [ settings.orchardModulePath + 'list-sugestao.component.css' ]
})
export class ListSugestaoComponent implements OnInit {
    private demands: IDemand[];
    private filters: any;

    model: any;

    constructor( private mapeandoESService: MapeandoESService, private form: FormBuilder ) {
        console.log( 'carrega ListSugestaoComponent' );
        this.demands = [];
        this.filters = {};
        this.model = {
            categoryFilter: '',
            themeFilter: '',
            sourceFilter: '',
            districtFilter: ''
        };
    }

    ngOnInit() {
        console.log( this );
        this.mapeandoESService.getCategories().subscribe( categories => this.filters.categories = categories );
        this.mapeandoESService.getThemes().subscribe( themes => this.filters.themes = themes );
        this.mapeandoESService.getSources().subscribe( sources => this.filters.sources = sources );
        this.mapeandoESService.getDistricts().subscribe( districts => this.filters.districts = districts );
        this.mapeandoESService.getDemands().subscribe( demands => this.demands = demands );
    }

    filter( e: any ) {
        console.log( e );
    }
}
