import 'rxjs/Rx';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { IDemand } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'filter-demand',
    providers: [ MapeandoESService, FormBuilder ],
    template: `
        <div class="row filter-items">
            <form>
                <div class="col-sm-2 col-md-2 col-lg-2 label-filtro">
                    <h4>Filtrar por:</h4>
                </div>
                <div class="col-sm-3 col-md-3 col-lg-3 filter-item">
                    <select class="form-control" name="themeFilter" [(ngModel)]="model.filters.theme" (change)="filter(model.filters)">
                        <option value="">Todos os Temas</option>
                        <option *ngFor="let theme of filters.themes" [ngValue]="theme">{{theme.name}}</option>
                    </select>
                </div>
                <!-- <div class="col-sm-3 col-md-3 col-lg-3 filter-item">
                    <select class="form-control" name="categoryFilter" [(ngModel)]="model.filters.category" (change)="filter(model.filters)">
                        <option value="">Todas as Categorias</option>
                        <option *ngFor="let category of filters.categories" [ngValue]="category">{{category.name}}</option>
                    </select>
                </div>-->
                <div class="col-sm-3 col-md-3 col-lg-3 filter-item">
                    <select class="form-control" name="districtFilter" [(ngModel)]="model.filters.district" (change)="filter(model.filters)">
                        <option value="">Todos os Municípios</option>
                        <option *ngFor="let district of filters.districts" [ngValue]="district">{{district.name}}</option>
                    </select>
                </div>
                <div class="col-sm-3 col-md-3 col-lg-3 filter-item">
                    <select class="form-control" name="sourceFilter" [(ngModel)]="model.filters.source" (change)="filter(model.filters)">
                        <option value="">Todas as Instituições</option>
                        <option *ngFor="let source of filters.sources" [ngValue]="source">{{source.name}}</option>
                    </select>
                </div>
            </form>
        </div>`,
    styleUrls: [ settings.orchardModulePath + 'filter-demand.component.css' ]
})
export class FilterDemandComponent implements OnInit {
    @Output( 'onFilterDemands' ) onFilterDemands = new EventEmitter<any>();

    private filters: any;

    model: any;

    constructor( private mapeandoESService: MapeandoESService, private form: FormBuilder ) {
        this.filters = {};
        this.model = {
            filters: {
                category: '',
                theme: '',
                source: '',
                district: ''
            }
        };
    }

    ngOnInit() {
        // this.mapeandoESService.getCategories().subscribe( categories => this.filters.categories = this.sort( categories ) );
        this.mapeandoESService.getThemes().subscribe( themes => this.filters.themes = this.sort( themes ) );
        this.mapeandoESService.getSources().subscribe( sources => this.filters.sources = this.sort( sources ) );
        this.mapeandoESService.getDistricts().subscribe( districts => this.filters.districts = this.sort( districts ) );
    }

    filter( filters: DemandFilters ) {
        if ( this.hasFilters( filters ) ) {
            this.onFilterDemands.emit( filters );
        } else {
            this.onFilterDemands.emit( undefined );
        }
    }

    private hasFilters( filters: DemandFilters ) {
        for ( let key in filters ) {
            if ( filters[ key ] !== '' ) {
                return true;
            }
        }
        return false;
    }

    private sort( list: any[] ) {
        return list.sort(( a, b ) => {
            if (a.name === 'Outros') { return 1; }
            if (b.name === 'Outros') { return -1; }
            return a.name.localeCompare( b.name );
        });
    }
}

interface DemandFilters {
    category: Object;
    theme: Object;
    source: Object;
    district: Object;
};
