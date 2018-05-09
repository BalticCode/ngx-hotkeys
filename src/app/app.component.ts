import {Component} from '@angular/core';

import {Hotkey, NgxHotkeysService} from '@balticcode/ngx-hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private _hotkeysService: NgxHotkeysService) {
    this._hotkeysService.add(new Hotkey('shift+g', (event: KeyboardEvent): boolean => {
      console.log('Typed hotkey');
      return false; // Prevent bubbling
    }, undefined, 'Send a secret message to the console.'));
  }
}
