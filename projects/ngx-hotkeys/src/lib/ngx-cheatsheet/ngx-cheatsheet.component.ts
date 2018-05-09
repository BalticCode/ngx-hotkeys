import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Hotkey} from '../models';
import {NgxHotkeysService} from '../ngx-hotkeys.service';

@Component({
  selector: 'ngx-cheatsheet',
  templateUrl: './ngx-cheatsheet.component.html',
  styleUrls: ['./ngx-cheatsheet.component.scss']
})
export class NgxCheatsheetComponent implements OnInit, OnDestroy {

  @Input()
  public title = 'Keyboard Shortcuts:';

  public helpVisible = false;
  public hotkeys: Hotkey[];

  private _subscription: Subscription;

  constructor(private hotkeysService: NgxHotkeysService) {
  }

  ngOnInit(): void {
    this._subscription = this.hotkeysService.cheatSheetToggle
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

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  public toggleCheatSheet(): void {
    this.helpVisible = !this.helpVisible;
  }
}
