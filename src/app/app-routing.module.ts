import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormSugestaoComponent } from './form-sugestao/form-sugestao.component';
import { ListSugestaoComponent } from './list-sugestao/list-sugestao.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'form-sugestao', component: FormSugestaoComponent },
    { path: 'list-sugestao', component: ListSugestaoComponent },
    { path: '**', component: LoginComponent }
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }