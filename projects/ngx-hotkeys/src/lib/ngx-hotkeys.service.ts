import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { IHotkey, IHotkeyOptions } from './interfaces';
import { HotkeyOptions } from './token';
import { share } from 'rxjs/internal/operators';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

const _defaultOptions: IHotkeyOptions = {
  disableCheatSheet: false,
  cheatSheetTitle: 'Keyboard Shortcuts:',
  cheatSheetHotkey: 'shift.?',
  cheatSheetHotkeyDescription: 'Show / hide this help menu',
  cheatSheetCloseEsc: false,
  cheatSheetCloseEscDescription: 'Hide this help menu'
};

@Injectable()
export class NgxHotkeysService implements OnDestroy {

  private document?: Document;

  private _serviceOptions: IHotkeyOptions;
  private _registeredHotkeys: Set<IHotkey> = new Set();
  private _pausedHotkeys: Set<IHotkey> = new Set();

  private _cheatSheetToggled: Subject<any> = new Subject();

  private defaults: Partial<IHotkey>;

  constructor(
    @Inject(HotkeyOptions) private _options: IHotkeyOptions,
    private eventManager: EventManager,
    @Inject(DOCUMENT) doc?: any
  ) {
    this.document = doc;
    this.defaults = { element: this.document };

    this._serviceOptions = { ..._defaultOptions, ...this._options };

    if (!this._serviceOptions.disableCheatSheet) {
      this.register({
        combo: this._serviceOptions.cheatSheetHotkey,
        handler: () => {
          this._cheatSheetToggled.next();
        },
        description: this._serviceOptions.cheatSheetHotkeyDescription
      });
    }

    if (this._serviceOptions.cheatSheetCloseEsc) {
      this.register({
        combo: 'esc',
        handler: () => {
          this._cheatSheetToggled.next(false);
        },
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
      this.bindToEventManager(h)
      .subscribe(() => {
        h.handler();
      });
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
      // TODO unregister
      // this._mousetrapInstance.unbind(h.combo, h.specificEvent);
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
    // TODO clear all
    // this._mousetrapInstance.reset();
    this._registeredHotkeys.clear();
    this._pausedHotkeys.clear();
  }

  public ngOnDestroy(): void {
    this.reset();
  }

  private bindToEventManager(hotkey: Partial<IHotkey>): any {
    const merged = { ...this.defaults, ...hotkey };
    const event = `keydown.${merged.combo}`;

    return new Observable(observer => {
      const handler = (e: Event) => {
        e.preventDefault();
        observer.next(e);
      };

      const dispose = this.eventManager.addEventListener(
        merged.element,
        event,
        handler
      );

      return () => {
        dispose();
      };
    });
  }
}
