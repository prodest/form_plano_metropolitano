import { Component } from '@angular/core';
import { settings } from './shared/settings';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: [ settings.orchardModulePath + 'app.component.css' ]
})
export class AppComponent  { name = 'Angular'; }
