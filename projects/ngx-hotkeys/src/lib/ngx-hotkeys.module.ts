import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgxCheatsheetComponent} from './ngx-cheatsheet/ngx-cheatsheet.component';
import {NgxHotkeysDirective} from './ngx-hotkeys.directive';
import {NgxHotkeysService} from './ngx-hotkeys.service';
import {HotkeyOptions} from './token';
import {IHotkeyOptions} from './interfaces';

@NgModule({
  imports: [CommonModule],
  declarations: [NgxCheatsheetComponent, NgxHotkeysDirective],
  exports: [NgxHotkeysDirective, NgxCheatsheetComponent],
  providers: [NgxHotkeysService]
})
export class NgxHotkeysModule {
  static forRoot(options?: IHotkeyOptions): ModuleWithProviders {
    return {
      ngModule: NgxHotkeysModule,
      providers: [
        NgxHotkeysService,
        {provide: HotkeyOptions, useValue: options}
      ]
    };
  }
}
