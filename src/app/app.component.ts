import {Component} from '@angular/core';

import {NgxHotkeysService} from '@balticcode/ngx-hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private _hotkeysService: NgxHotkeysService) {
    this._hotkeysService.register({
      combo: 'shift+g',
      handler: () => {
        console.log('Typed hotkey');
      },
      description: 'Send a secret message to the console.'
    });
  }
}
