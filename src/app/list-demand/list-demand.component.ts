import 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { IDemand } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';
// import { Location } from '../shared/core/location.class';

@Component( {
    moduleId: module.id,
    selector: 'list-demand',
    providers: [ MapeandoESService, FormBuilder ],
    template: `<div class="row">
    <div class="col-lg-12">
        <hr />
        <div class="row">
            <div class="col-lg-12">
                <p class="text-center titulo-contribuicoes">Abaixo as contribuições enviadas pelos nossos cidadãos metropolitanos</p>
            </div>
        </div>
        <div class="row filter-items">
            <div class="col-sm-12 col-md-12 col-lg-12">
                <h4>Filtrar por:</h4>
            </div>
            <form>
                <div class="col-sm-6 col-md-4 filter-item">
                    <select class="form-control" name="themeFilter" [(ngModel)]="model.filters.theme" (change)="filter(model.filters)">
                        <option value="">Todos os Temas</option>
                        <option *ngFor="let theme of filters.themes" [ngValue]="theme">{{theme.name}}</option>
                    </select>
                </div>
                <!-- <div class="col-sm-6 col-md-3 filter-item">
                    <select class="form-control" name="categoryFilter" [(ngModel)]="model.filters.category" (change)="filter(model.filters)">
                        <option value="">Todas as Categorias</option>
                        <option *ngFor="let category of filters.categories" [ngValue]="category">{{category.name}}</option>
                    </select>
                </div>-->
                <div class="col-sm-6 col-md-4 filter-item">
                    <select class="form-control" name="districtFilter" [(ngModel)]="model.filters.district" (change)="filter(model.filters)">
                        <option value="">Todos os Municípios</option>
                        <option *ngFor="let district of filters.districts" [ngValue]="district">{{district.name}}</option>
                    </select>
                </div>
                <div class="col-sm-6 col-md-4 filter-item">
                    <select class="form-control" name="sourceFilter" [(ngModel)]="model.filters.source" (change)="filter(model.filters)">
                        <option value="">Todas as Instituições</option>
                        <option *ngFor="let source of filters.sources" [ngValue]="source">{{source.name}}</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="row suggestion-item" *ngFor="let demand of demands">
            <div class="col-sm-3 text-center">
                <div class="user-foto">
                    <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                </div>
                <div class="username">{{demand.externalUser ? demand.externalUser.name : ''}}</div>
                <div class="date-suggestion">{{demand.createdAt | date: 'dd/MM/yyyy' }}</div>
            </div>
            <div class="col-sm-9">
                <h4 class="title-suggestion">{{demand.title}}</h4>
                <div class="container-description">
                    <div class="theme-suggestion">
                        <span *ngFor="let theme of demand.themes; let last = last">{{theme.name}}<span *ngIf="!last">, </span></span>
                    </div>
                    <div class="district-suggestion">
                        <span *ngFor="let district of demand.districts; let last = last; let first = first">
                            <span *ngIf="first"><i class="fa fa-map-marker color-secondary-color" aria-hidden="true"></i></span> {{district ? district.name : ''}}
                        <span *ngIf="!last">,</span>
                        </span>
                    </div>
                    <div class="category-source">
                        <!--<span *ngIf="demand.category" class="category" title="Categoria"><i class="fa fa-tag  fa-rotate-90 icon-content color-secondary-color" aria-hidden="true"></i>{{demand.category.name}}</span>-->
                        <span *ngIf="demand.source" class="source" title="Origem"><i class="fa fa-group color-secondary-color" aria-hidden="true"></i> {{demand.source.name}}</span>
                    </div>
                    <div class="content-description">
                        <p>
                            {{demand.description}}
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>

</div>`,
    styleUrls: [ settings.orchardModulePath + 'list-demand.component.css' ]
})
export class ListDemandComponent implements OnInit {
    private demands: IDemand[];
    private filters: any;

    model: any;

    constructor( private mapeandoESService: MapeandoESService, private form: FormBuilder ) {

        console.log( 'carrega ListDemandComponent' );
        this.demands = [];
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
        this.mapeandoESService.getCategories().subscribe( categories => this.filters.categories = categories );
        this.mapeandoESService.getThemes().subscribe( themes => this.filters.themes = themes );
        this.mapeandoESService.getSources().subscribe( sources => this.filters.sources = sources );
        this.mapeandoESService.getDistricts().subscribe( districts => this.filters.districts = districts );
        // this.mapeandoESService.getAllDemands().subscribe( demands => this.demands = demands );
        this.mapeandoESService.getUnfilteredAllDemands().then( demands => this.demands = demands );
    }

    filter( filters: DemandFilters ) {
        if ( this.hasFilters( filters ) ) {
            this.mapeandoESService.getUnfilteredDemands( filters ).then( demands => this.demands = demands );
            // this.mapeandoESService.getDemands( filters ).subscribe( demands => this.demands = demands );
        } else {
            this.mapeandoESService.getUnfilteredAllDemands().then( demands => this.demands = demands );
            // this.mapeandoESService.getAllDemands().subscribe( demands => this.demands = demands );
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
}

interface DemandFilters {
    category: Object;
    theme: Object;
    source: Object;
    district: Object;
};
