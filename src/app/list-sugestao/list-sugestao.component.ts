import 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { MapeandoESService } from '../shared/mapeandoes.service';
import { IDemand } from '@prodest/mapeandoes-typings';

@Component( {
    moduleId: module.id,
    selector: 'list-sugestao',
    providers: [ MapeandoESService ],
    templateUrl: 'list-sugestao.template.html',
    styleUrls: [ orchardModulePath + 'list-sugestao.component.css' ]
})
export class ListSugestaoComponent implements OnInit {
    demands: IDemand[] = undefined;

    constructor( private mapeandoESService: MapeandoESService ) {

    }

    ngOnInit() {
        this.mapeandoESService.getDemands().subscribe( demands => this.demands = demands );
    }
}
