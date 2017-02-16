import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { FormDemandComponent } from './form-demand/form-demand.component';
// import { ListDemandComponent } from './list-demand/list-demand.component';
import { SuccessDemandComponent } from './success-demand/success-demand.component';
// import { MapComponent } from './map/map.component';
import { FormRootComponent } from './form-root/form-root.component';

const routes: Routes = [
    // { path: 'login', component: LoginComponent },
    // { path: 'participe', component: FormDemandComponent },
    // { path: 'list-demand', component: ListDemandComponent },
    // { path: 'map', component: ListDemandComponent },
    { path: 'success-demand', component: SuccessDemandComponent },
    { path: '**', component: FormRootComponent }
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
