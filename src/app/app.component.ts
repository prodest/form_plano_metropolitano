import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: [ orchardModulePath + 'app.component.css' ]
})
export class AppComponent  { name = 'Angular'; }
