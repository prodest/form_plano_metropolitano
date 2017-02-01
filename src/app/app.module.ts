import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormDemandComponent } from './form-demand/form-demand.component';
import { AppRoutingModule } from './app-routing.module';
import { ListDemandComponent } from './list-demand/list-demand.component';

@NgModule( {
  imports: [ BrowserModule, FormsModule, HttpModule, AppRoutingModule ],
  providers: [ { provide: APP_BASE_HREF, useValue: '/' }],
  declarations: [ AppComponent, LoginComponent, FormDemandComponent, ListDemandComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
