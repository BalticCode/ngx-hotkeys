import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgxCheatsheetComponent} from './ngx-cheatsheet/ngx-cheatsheet.component';
import {NgxHotkeysService} from './services/ngx-hotkeys.service';
import {HOTKEY_OPTIONS} from './token';
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
  static forRoot(options?: HotkeyOptions): ModuleWithProviders<NgxHotkeysModule> {
    return {
      ngModule: NgxHotkeysModule,
      providers: [
        NgxHotkeysService,
        {
          provide: HOTKEY_OPTIONS,
          useValue: options
        }
      ]
    };
  }
}
