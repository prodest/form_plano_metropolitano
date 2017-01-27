import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormSugestaoComponent } from './form-sugestao/form-sugestao.component';
import { AppRoutingModule } from './app-routing.module';
import { ListSugestaoComponent } from './list-sugestao/list-sugestao.component';

@NgModule( {
  imports: [ BrowserModule, FormsModule, HttpModule, AppRoutingModule ],
  declarations: [ AppComponent, LoginComponent, FormSugestaoComponent, ListSugestaoComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
