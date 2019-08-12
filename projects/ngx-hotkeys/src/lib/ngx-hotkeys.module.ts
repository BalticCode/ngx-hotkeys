import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgxCheatsheetComponent} from './ngx-cheatsheet/ngx-cheatsheet.component';
import {NgxHotkeysService} from './ngx-hotkeys.service';
import {HotkeyOptionsToken} from './token';
import {HotkeyOptions} from './interfaces';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxCheatsheetComponent
  ],
  exports: [
    NgxCheatsheetComponent
  ]
})
export class NgxHotkeysModule {
  static forRoot(options?: HotkeyOptions): ModuleWithProviders {
    return {
      ngModule: NgxHotkeysModule,
      providers: [
        NgxHotkeysService,
        {
          provide: HotkeyOptionsToken,
          useValue: options
        }
      ]
    };
  }
}
