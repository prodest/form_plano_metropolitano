// Angular
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Modules
import { ModalModule } from 'ngx-modal';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormDemandComponent } from './form-demand/form-demand.component';
import { ListDemandComponent } from './list-demand/list-demand.component';
import { SuccessDemandComponent } from './success-demand/success-demand.component';
import { MapComponent } from './map/map.component';
import { FormRootComponent } from './form-root/form-root.component';
import { FilterDemandComponent } from './filter-demand/filter-demand.component';

// Services
import { AuthenticationService } from './shared/authentication.service';
import { MapService } from './shared/map.service';
import { OSMNominatimService } from './shared/osm-nominatim.service';


@NgModule( {
  imports: [ BrowserModule, FormsModule, HttpModule, AppRoutingModule, ModalModule ],
  providers: [ { provide: APP_BASE_HREF, useValue: '/' }, AuthenticationService, MapService, OSMNominatimService ],
  declarations: [
    AppComponent,
    LoginComponent,
    FormDemandComponent,
    ListDemandComponent,
    SuccessDemandComponent,
    MapComponent,
    FormRootComponent,
    FilterDemandComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
