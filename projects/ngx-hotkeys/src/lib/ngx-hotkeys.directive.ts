import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';

import 'mousetrap';

import {HotKeyMap} from './interfaces';
import {Hotkey} from './models';
import {NgxHotkeysService} from './ngx-hotkeys.service';

@Directive({
  selector: '[ngxHotkeys]',
  providers: [NgxHotkeysService]
})
export class NgxHotkeysDirective implements OnInit, OnDestroy {

  @Input()
  hotkeys: HotKeyMap[];

  private _mousetrapInstance: MousetrapInstance;
  private _hotkeysList: Hotkey[] = [];
  private _oldHotkeys: Hotkey[] = [];

  constructor(private _hotkeysService: NgxHotkeysService, private _elementRef: ElementRef) {
    this._mousetrapInstance = new Mousetrap(this._elementRef.nativeElement); // Bind hotkeys to the current element (and any children)
  }

  ngOnInit() {
    for (const hotkey of this.hotkeys) {
      const combo = Object.keys(hotkey)[0];
      const hotkeyObj: Hotkey = new Hotkey(combo, hotkey[combo]);
      const oldHotkey: Hotkey = <Hotkey>this._hotkeysService.get(combo);
      if (oldHotkey !== null) { // We let the user overwrite callbacks temporarily if you specify it in HTML
        this._oldHotkeys.push(oldHotkey);
        this._hotkeysService.remove(oldHotkey);
      }
      this._hotkeysList.push(hotkeyObj);
      this._mousetrapInstance.bind(hotkeyObj.combo, hotkeyObj.callback);
    }
  }

  ngOnDestroy() {
    for (const hotkey of this._hotkeysList) {
      this._mousetrapInstance.unbind(hotkey.combo);
    }
    this._hotkeysService.add(this._oldHotkeys);
  }
}
