import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import 'mousetrap';

import {IHotkey, IHotkeyOptions} from './interfaces';
import {HotkeyOptions} from './token';
import {share} from 'rxjs/internal/operators';

const _defaultOptions: IHotkeyOptions = {
  disableCheatSheet: false,
  cheatSheetTitle: 'Keyboard Shortcuts:',
  cheatSheetHotkey: '?',
  cheatSheetHotkeyDescription: 'Show / hide this help menu',
  cheatSheetCloseEsc: false,
  cheatSheetCloseEscDescription: 'Hide this help menu'
};

@Injectable()
export class NgxHotkeysService implements OnDestroy {

  private _serviceOptions: IHotkeyOptions;
  private _registeredHotkeys: Set<IHotkey> = new Set();
  private _pausedHotkeys: Set<IHotkey> = new Set();
  private _mousetrapInstance: MousetrapInstance;
  private _cheatSheetToggled: Subject<any> = new Subject();
  private _preventIn = ['INPUT', 'SELECT', 'TEXTAREA'];

  constructor(@Inject(HotkeyOptions) private _options: IHotkeyOptions) {
    this._serviceOptions = Object.assign(_defaultOptions, this._options);
    Mousetrap.prototype.stopCallback = (event: KeyboardEvent, element: HTMLElement, combo: string, callback: Function) => {
      // if the element has the class "mousetrap" then no need to stop
      if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
        return false;
      }
      return (element.contentEditable && element.contentEditable === 'true');
    };
    this._mousetrapInstance = new (<any>Mousetrap)();
    if (!this._serviceOptions.disableCheatSheet) {
      this.register({
        combo: this._serviceOptions.cheatSheetHotkey,
        handler: function (event: KeyboardEvent) {
          this._cheatSheetToggled.next();
        }.bind(this),
        description: this._serviceOptions.cheatSheetHotkeyDescription
      });
    }

    if (this._serviceOptions.cheatSheetCloseEsc) {
      this.register({
        combo: 'esc',
        handler: function (event: KeyboardEvent) {
          this._cheatSheetToggled.next(false);
        }.bind(this),
        allowIn: ['HOTKEYS-CHEATSHEET'],
        description: this._serviceOptions.cheatSheetCloseEscDescription
      });
    }
  }

  /**
   * Returns the registered hotkeys as array.
   * @returns all registered hotkeys
   */
  public get hotkeys(): IHotkey[] {
    return Array.from(this._registeredHotkeys);
  }

  /**
   * Returns an Observable stream indicating the cheatsheets visibility was toggled.
   * @returns stream indicating the cheatsheets visibility was toggled
   */
  public get cheatSheetToggled(): Observable<boolean> {
    return this._cheatSheetToggled.asObservable().pipe(
      share()
    );
  }

  public get options(): IHotkeyOptions {
    return this._serviceOptions;
  }

  /**
   * Registers a new hotkey/new hotkeys with it's/their handler(s).
   * @param hotkey hotkeys to listen for
   * @param unpausing flag indicating if the hotkeys should be unpaused
   */
  public register(hotkey: IHotkey | IHotkey[], unpausing = false): void {
    let hotkeys: IHotkey[] = [].concat(hotkey);
    if (unpausing) {
      hotkeys = Array.from(this._pausedHotkeys);
    }
    hotkeys.forEach(h => {
      if (unpausing) {
        this._pausedHotkeys.delete(h);
      }
      this._registeredHotkeys.add(h);
      this.bindToMoustrap(h);
    });
  }

  /**
   * Removes a/the registered hotkey(s).
   * @param hotkey hotkey filter
   * @param pausing flag indicating if the hotkeys should be paused
   */
  public unregister(hotkey: IHotkey | IHotkey[], pausing = false): void {
    const hotkeys: IHotkey[] = [].concat(hotkey);

    hotkeys.forEach(h => {
      this._registeredHotkeys.delete(h);
      if (pausing) {
        this._pausedHotkeys.add(h);
      }
      this._mousetrapInstance.unbind(h.combo, h.specificEvent);
    });
  }

  /**
   * Returns all hotkeys matching the passed combo(s).
   * @param combo combo to match against
   * @returns all matched hotkeys
   */
  public get(combo?: string | string[]): IHotkey[] {
    return this.hotkeys.filter(h => h.combo === combo);
  }

  /**
   * Stops listening for the specified hotkeys.
   * @param hotkey hotkey filter
   */
  public pause(hotkey?: IHotkey | IHotkey[]): void {
    if (!hotkey) {
      return this.pause(this.hotkeys);
    }
    const hotkeys: IHotkey[] = [].concat(hotkey);
    this.unregister(hotkeys, true);
  }

  /**
   * Resumes listening for the specified hotkeys.
   * @param hotkey hotkey filter
   */
  public unpause(hotkey?: IHotkey | IHotkey[]): void {
    if (!hotkey) {
      return this.unpause(this.hotkeys);
    }
    const hotkeys: IHotkey[] = [].concat(hotkey);
    this.register(hotkeys, true);
  }

  /**
   * Resets all hotkeys.
   */
  public reset(): void {
    this._mousetrapInstance.reset();
    this._registeredHotkeys.clear();
    this._pausedHotkeys.clear();
  }

  public ngOnDestroy(): void {
    this.reset();
  }

  private bindToMoustrap(hotkey: IHotkey): void {

    this._mousetrapInstance.bind(hotkey.combo,
      (event: KeyboardEvent, combo: string) => {
        let shouldExecute = true;

        // if the callback is executed directly `hotkey.get('w').callback()`
        // there will be no event, so just execute the callback.
        if (event) {
          const target: HTMLElement = <HTMLElement>(event.target || event.srcElement); // srcElement is IE only
          const nodeName: string = target.nodeName.toUpperCase();

          // check if the input has a mousetrap class, and skip checking preventIn if so
          if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
            shouldExecute = true;
          } else if (this._preventIn.indexOf(nodeName) > -1 && hotkey.allowIn.map(allow => allow.toUpperCase()).indexOf(nodeName) === -1) {
            // don't execute callback if the event was fired from inside an element listed in preventIn but not in allowIn
            shouldExecute = false;
          }
        }

        if (shouldExecute) {
          return hotkey.handler.apply(this, [event, combo]);
        }
      },
      hotkey.specificEvent);
  }
}
