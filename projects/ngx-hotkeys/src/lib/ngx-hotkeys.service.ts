import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

import 'mousetrap';

import {IHotkeyOptions} from './interfaces';
import {Hotkey} from './models';
import {HotkeyOptions} from './token';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class NgxHotkeysService implements OnDestroy {

  private _hotkeys: Hotkey[] = [];
  private _pausedHotkeys: Hotkey[] = [];
  private _mousetrapInstance: MousetrapInstance;
  private _cheatSheetToggle: Subject<any> = new Subject();

  private _preventIn = ['INPUT', 'SELECT', 'TEXTAREA'];

  constructor(@Inject(HotkeyOptions) private _options: IHotkeyOptions) {
    Mousetrap.prototype.stopCallback = (event: KeyboardEvent, element: HTMLElement, combo: string, callback: Function) => {
      // if the element has the class "mousetrap" then no need to stop
      if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
        return false;
      }
      return (element.contentEditable && element.contentEditable === 'true');
    };
    this._mousetrapInstance = new (<any>Mousetrap)();
    if (!this._options.disableCheatSheet) {
      this.add(new Hotkey(
        this._options.cheatSheetHotkey || 'x',
        function (event: KeyboardEvent) {
          this.cheatSheetToggle.next();
        }.bind(this),
        [],
        this._options.cheatSheetDescription || 'Show / hide this help menu',
      ));
    }

    if (this._options.cheatSheetCloseEsc) {
      this.add(new Hotkey(
        'esc',
        function (event: KeyboardEvent) {
          this.cheatSheetToggle.next(false);
        }.bind(this),
        ['HOTKEYS-CHEATSHEET'],
        this._options.cheatSheetCloseEscDescription || 'Hide this help menu',
      ));
    }
  }

  public get hotkeys(): Hotkey[] {
    return this._hotkeys;
  }

  public get cheatSheetToggle(): Subject<any> {
    return this._cheatSheetToggle;
  }

  add(hotkey: Hotkey | Hotkey[], specificEvent?: string): Hotkey | Hotkey[] {
    if (Array.isArray(hotkey)) {
      const temp: Hotkey[] = [];
      for (const key of hotkey) {
        temp.push(<Hotkey>this.add(key, specificEvent));
      }
      return temp;
    }
    this.remove(hotkey);
    this._hotkeys.push(<Hotkey>hotkey);
    this._mousetrapInstance.bind((<Hotkey>hotkey).combo, (event: KeyboardEvent, combo: string) => {
      let shouldExecute = true;

      // if the callback is executed directly `hotkey.get('w').callback()`
      // there will be no event, so just execute the callback.
      if (event) {
        const target: HTMLElement = <HTMLElement>(event.target || event.srcElement); // srcElement is IE only
        const nodeName: string = target.nodeName.toUpperCase();

        // check if the input has a mousetrap class, and skip checking preventIn if so
        if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
          shouldExecute = true;
        } else if (this._preventIn.indexOf(nodeName) > -1
          && (<Hotkey>hotkey).allowIn.map(allow => allow.toUpperCase()).indexOf(nodeName) === -1) {
          // don't execute callback if the event was fired from inside an element listed in preventIn but not in allowIn
          shouldExecute = false;
        }
      }

      if (shouldExecute) {
        return (<Hotkey>hotkey).callback.apply(this, [event, combo]);
      }
    }, specificEvent);
    return hotkey;
  }

  remove(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
    const temp: Hotkey[] = [];
    if (!hotkey) {
      for (const key of this._hotkeys) {
        temp.push(<Hotkey>this.remove(key));
      }
      return temp;
    }
    if (Array.isArray(hotkey)) {
      for (const key of hotkey) {
        temp.push(<Hotkey>this.remove(key));
      }
      return temp;
    }
    const index = this.findHotkey(<Hotkey>hotkey);
    if (index > -1) {
      this._hotkeys.splice(index, 1);
      this._mousetrapInstance.unbind((<Hotkey>hotkey).combo);
      return hotkey;
    }
    return null;
  }

  get(combo?: string | string[]): Hotkey | Hotkey[] {
    if (!combo) {
      return this._hotkeys;
    }
    if (Array.isArray(combo)) {
      const temp: Hotkey[] = [];
      for (const key of combo) {
        temp.push(<Hotkey>this.get(key));
      }
      return temp;
    }
    for (let i = 0; i < this._hotkeys.length; i++) {
      if (this._hotkeys[i].combo.indexOf(<string>combo) > -1) {
        return this._hotkeys[i];
      }
    }
    return null;
  }

  pause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
    if (!hotkey) {
      return this.pause(this._hotkeys);
    }
    if (Array.isArray(hotkey)) {
      const temp: Hotkey[] = [];
      for (const key of hotkey) {
        temp.push(<Hotkey>this.pause(key));
      }
      return temp;
    }
    this.remove(hotkey);
    this._pausedHotkeys.push(<Hotkey>hotkey);
    return hotkey;
  }

  unpause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
    if (!hotkey) {
      return this.unpause(this._pausedHotkeys);
    }
    if (Array.isArray(hotkey)) {
      const temp: Hotkey[] = [];
      for (const key of hotkey) {
        temp.push(<Hotkey>this.unpause(key));
      }
      return temp;
    }
    const index: number = this._pausedHotkeys.indexOf(<Hotkey>hotkey);
    if (index > -1) {
      this.add(hotkey);
      return this._pausedHotkeys.splice(index, 1);
    }
    return null;
  }

  reset() {
    this._mousetrapInstance.reset();
  }

  private findHotkey(hotkey: Hotkey): number {
    return this._hotkeys.indexOf(hotkey);
  }

  ngOnDestroy() {
    console.log('Service destroy');
    this.reset();
  }
}
