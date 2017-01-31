import 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { IDemand } from '@prodest/mapeandoes-typings';
import { settings } from '../shared/settings';

@Component( {
    moduleId: module.id,
    selector: 'list-sugestao',
    providers: [ MapeandoESService ],
    template: `<div>
    <p class="text-center">Abaixo as sugestões enviadas pelos nossos internautas</p>
    
        <div class="row suggestion-item" *ngFor="let demand of demands">
            <div class="col-sm-3 text-center">
                <div class="user-foto">
                    <i class="fa fa-user-circle-o" aria-hidden="true"></i>
                </div>
                <div class="username">Nome Usuário</div>
                <div class="date-suggestion">{{demand.createdAt | date: 'dd/MM/yyyy' }}</div>
            </div>
            <div class="col-sm-9">
                <h4 class="title-suggestion">{{demand.title}}</h4>
                <div class="container-description">
                    <div class="theme-suggestion">
                        <span *ngFor="let theme of demand.themes; let i = index"  >{{theme.name}}<span *ngIf=" i < [demand.themes.length - 1]">, </span> </span>
                    </div>
                    <div class="district-suggestion">
                        <span *ngIf=" demand.themes.length > 0"><i class="fa fa-map-marker color-secondary-color" aria-hidden="true"></i></span><span *ngFor="let district of demand.districts; let i = index" >{{district ? district.name : ''}} <span *ngIf=" i < [demand.themes.length - 1] &&  district ? district.name : ''">, </span> Vitória</span>
                    </div>
                    <div class="category-source">
                        <span class="category" title="Categoria"><i class="fa fa-tag  fa-rotate-90 icon-content color-secondary-color" aria-hidden="true"></i><span>Bicicletário </span></span>
                        <span class="source"  title="Origem"><i class="fa fa-group color-secondary-color" aria-hidden="true"></i> <span>Entidade de Classe</span></span>
                    </div>
                    <div class="content-description">
                        <p>
                            {{demand.description}} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt aliquam est et facilisis. Etiam dignissim convallis urna, et volutpat leo bibendum eu. Phasellus quis libero ac ante tempor vehicula. Aliquam faucibus, mi eu iaculis tincidunt, purus libero semper libero, nec convallis massa velit a metus. Aliquam tristique aliquam nibh eget convallis. Curabitur aliquam, nisl non vulputate sollicitudin, diam nunc euismod tortor, id sollicitudin mauris ante in lectus. Integer fringilla neque risus, quis scelerisque lectus faucibus vitae. Ut tristique, orci eget tincidunt sodales, nulla felis elementum nunc, eget finibus eros nulla sodales diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mi turpis, volutpat eget fringilla in, pharetra eget enim.                  
                        </p>
                    </div>
                </div>
            </div>
        </div>
    
</div>`,
    styleUrls: [ settings.orchardModulePath + 'list-sugestao.component.css' ]
})
export class ListSugestaoComponent implements OnInit {
    demands: IDemand[] = undefined;

    constructor( private mapeandoESService: MapeandoESService ) {

    }

    ngOnInit() {
        this.mapeandoESService.getDemands().subscribe( demands => this.demands = demands );
    }
}
