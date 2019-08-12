import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';

import {HotKeyMap, IHotkey} from './interfaces';
import {NgxHotkeysService} from './ngx-hotkeys.service';

@Directive({
  selector: '[ngxHotkeys]',
  providers: [NgxHotkeysService]
})
export class NgxHotkeysDirective implements OnInit, OnDestroy {

  @Input()
  hotkeys: HotKeyMap[];

  private _hotkeysList: IHotkey[] = [];
  private _oldHotkeys: IHotkey[] = [];

  constructor(private _hotkeysService: NgxHotkeysService, private _elementRef: ElementRef) {
  }

  ngOnInit() {
    for (const hotkey of this.hotkeys) {
      const combo = Object.keys(hotkey)[0];
      const hotkeyObj: IHotkey = {
        combo: combo,
        handler: hotkey[combo]
      };
      const filtered: IHotkey[] = this._hotkeysService.get(combo);
      const oldHotkey: IHotkey = !!filtered && !!filtered.length ? filtered[0] : null;
      if (oldHotkey !== null) { // We let the user overwrite callbacks temporarily if you specify it in HTML
        this._oldHotkeys.push(oldHotkey);
        this._hotkeysService.unregister(oldHotkey);
      }
      this._hotkeysList.push(hotkeyObj);
      // this._mousetrapInstance.bind(hotkeyObj.combo, hotkeyObj.handler);
      // TODO bind
    }
  }

  ngOnDestroy() {
    for (const hotkey of this._hotkeysList) {
      // this._mousetrapInstance.unbind(hotkey.combo);
      // TODO unbind
    }
    this._hotkeysService.register(this._oldHotkeys);
  }
}
