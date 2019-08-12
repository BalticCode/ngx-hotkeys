import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {NgxHotkeysService} from '../ngx-hotkeys.service';
import {IHotkey} from '../interfaces';

@Component({
  selector: 'ngx-cheatsheet',
  templateUrl: './ngx-cheatsheet.component.html',
  styleUrls: ['./ngx-cheatsheet.component.scss']
})
export class NgxCheatsheetComponent implements OnInit, OnDestroy {

  @Input()
  title: string;

  helpVisible = false;
  hotkeys: IHotkey[];

  private _subscription: Subscription;

  private _map: any = {
    meta: '\u2318',           // ⌘
    shift: '\u21E7',          // ⇧
    left: '\u2190',           // ←
    right: '\u2192',          // →
    up: '\u2191',             // ↑
    down: '\u2193',           // ↓
    'return': '\u23CE',       // ⏎
    backspace: '\u232B'       // ⌫
  };

  constructor(private hotkeysService: NgxHotkeysService) {
    this.title = this.hotkeysService.options.cheatSheetTitle;
  }

  ngOnInit(): void {
    this._subscription = this.hotkeysService.cheatSheetToggled
      .subscribe((isOpen) => {
        if (isOpen !== false) {
          this.hotkeys = this.hotkeysService.hotkeys
            .filter(hotkey => hotkey.description);
        }

        if (isOpen === false) {
          this.helpVisible = false;
        } else {
          this.toggleCheatSheet();
        }
      });
  }

  formatHotkey(hotkey: IHotkey): string[] {
    if (!hotkey.format) {
      const combo: string = Array.isArray(hotkey.combo) ? hotkey.combo[0] : hotkey.combo;
      const sequence: string[] = combo.split(/[\s]/);
      for (let i = 0; i < sequence.length; i++) {
        sequence[i] = this.symbolize(sequence[i]);
      }
      hotkey.format = sequence;
    }
    return hotkey.format;
  }

  private symbolize(combo: string): string {
    const comboSplit: string[] = combo.split('.');
    for (let i = 0; i < comboSplit.length; i++) {
      // try to resolve command / ctrl based on OS:
      if (comboSplit[i] === 'mod') {
        if (window.navigator && window.navigator.platform.indexOf('Mac') >= 0) {
          comboSplit[i] = 'command';
        } else {
          comboSplit[i] = 'ctrl';
        }
      }
      comboSplit[i] = this._map[comboSplit[i]] || comboSplit[i];
    }
    return comboSplit.join(' + ');
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public toggleCheatSheet(): void {
    this.helpVisible = !this.helpVisible;
  }
}
