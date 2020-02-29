import { Component } from '@angular/core';

import { NgxHotkeysService, Hotkey } from '@balticcode/ngx-hotkeys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private hotkeysService: NgxHotkeysService) {

    const hotkey: Hotkey = {
      combo: 'shift+g',
      handler: () => {
        console.log('Typed hotkey');
      },
      description: 'Send a secret message to the console.'
    };

    this.hotkeysService.register(hotkey);
  }
}
