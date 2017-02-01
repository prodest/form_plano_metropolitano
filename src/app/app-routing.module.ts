import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormDemandComponent } from './form-demand/form-demand.component';
import { ListDemandComponent } from './list-demand/list-demand.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'form-sugestao', component: FormDemandComponent },
    { path: 'list-sugestao', component: ListDemandComponent },
    { path: '**', component: LoginComponent }
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }