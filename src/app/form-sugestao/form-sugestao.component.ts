import 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { Demand } from './model/demand';
import { IDistrict, ITheme } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'form-sugestao',
    providers: [ MapeandoESService ],
    template: `<div class="col-lg-10 col-lg-offset-1">
    <form>
       
        <div class="form-group">
            <label for="category">Categoria</label>
            <select name="category" class="form-control" required [(ngModel)]="model.categoryId">
                <option *ngFor="let category of categories" [value]="category.id">{{category.name}}</option>
            </select>
        </div>
        <div class="form-group">
            <div class="row">
            <div class="col-sm-6">
                <label for="themes">Tema(s)</label>
                <br>
                <div class="btn-group btn-group-vertical" data-toggle="buttons">
                    <label class="btn" *ngFor="let theme of themes">
                        <input type="checkbox" name='{{theme.name}}'value="{{theme.id}}"  (click)="toggleThemes($event, theme)"/><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i> <span> {{theme.name}}</span>
                    </label>                     

                </div>
            </div>
            <div class="col-sm-6">
                <label for="districts">Município(s)</label>
                <br>
                <div class="btn-group btn-group-vertical" data-toggle="buttons">
                    <label class="btn" *ngFor="let district of districts">
                        <input type="checkbox" name='{{district.name}}'value="{{district.id}}" (click)="toggleDistrict($event, disctrict)"/><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i> <span> {{district.name}}</span>
                    </label>                     

                </div>
            </div>
            </div>

        </div>

        <div class="form-group">
            <label for="source">Órgão</label>
            <select name="source" class="form-control" required [(ngModel)]="model.sourceId">
                <option *ngFor="let source of sources" [value]="source.id">{{source.name}}</option>
            </select>
        </div>
        <div class="form-group">
            <label for="title">Título</label>
            <input type="text" class="form-control" id="title" [(ngModel)]="model.title" required name="name">
        </div>
        <div class="form-group">
            <label for="description">Descrição</label>
            <textarea type="text" class="form-control" id="description" [(ngModel)]="model.description" name="text"></textarea>
        </div>
        <div class="form-group text-right">
            <button type="submit" class="btn btn-primary btn-md background-primary-button-background-color primary-button-border-border-color font-color-primary-button-color btn-submit" (click)="sendDemand(model)">
                Enviar <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
            </button>
        </div>

    </form>
</div>`,
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

    constructor( private mapeandoESService: MapeandoESService ) {
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
