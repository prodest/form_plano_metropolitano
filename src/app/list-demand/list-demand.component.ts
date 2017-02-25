import 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IDemand } from '@prodest/mapeandoes-typings';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { settings } from '../shared/settings';
// import { Location } from '../shared/core/location.class';

@Component( {
    moduleId: module.id,
    selector: 'list-demand',
    providers: [ MapeandoESService, FormBuilder ],
    template: `<div class="row suggestion-item" *ngFor="let demand of demands">
            <div class="col-sm-3 text-center">
                <div class="user-foto">
                    <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                </div>
                <div class="username">{{demand.externalUser ? demand.externalUser.name : ''}}</div>
                <div class="date-suggestion">{{demand.createdAt | date: 'dd/MM/yyyy' }}</div>
            </div>
            <div class="col-sm-9 text-left">
                <div class="aprove-reprove" *ngIf="showModeration">
                    <button class="btn btn-sm" 
                        (click)="approveDemand(demand)"
                        [ngClass]="{ 'btn-success': !demand.approved}" 
                        [disabled]="demand.approved">Aprovar</button>
                    <button class="btn btn-sm" 
                        (click)="rejectDemand(demand)"
                        [ngClass]="{ 'btn-danger': demand.approved}" 
                        [disabled]="!demand.approved">Rejeitar</button>
                </div>
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
        </div>`,
    styleUrls: [ settings.orchardModulePath + 'list-demand.component.css' ]
})
export class ListDemandComponent {
    @Input() demands: IDemand[];
    @Input() showModeration: boolean = false;

    constructor( private form: FormBuilder, private mapeandoESService: MapeandoESService ) {
    }

    approveDemand( demand: IDemand ) {
        demand.approved = true;
        this.updateDemand( demand )
            .catch(() => demand.approved = false );
    }

    rejectDemand( demand: IDemand ) {
        demand.approved = false;
        this.updateDemand( demand )
            .catch(() => demand.approved = true );
    }

    updateDemand( demand: IDemand ) {
        return this.mapeandoESService.updateDemand( demand );
    }
}
