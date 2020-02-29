import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

import { Hotkey, HotkeyOptions } from '../interfaces';
import { HOTKEY_OPTIONS } from '../token';
import { share } from 'rxjs/internal/operators';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

const _defaultOptions: HotkeyOptions = {
  disableCheatSheet: false,
  cheatSheetTitle: 'Keyboard Shortcuts:',
  cheatSheetHotkey: 'shift.?',
  cheatSheetHotkeyDescription: 'Show / hide this help menu',
  cheatSheetCloseEsc: false,
  cheatSheetCloseEscDescription: 'Hide this help menu'
};

@Injectable({
  providedIn: 'root'
})
export class NgxHotkeysService implements OnDestroy {

  private document?: Document;

  private configuration: HotkeyOptions;
  private registeredHotkeys: Set<Hotkey> = new Set();
  private pausedHotkeys: Set<Hotkey> = new Set();

  private _cheatSheetToggled: Subject<any> = new Subject();
  private bindingSubscriptions: Map<string, Subscription> = new Map();

  private defaults: Partial<Hotkey>;

  constructor(
    private eventManager: EventManager,
    @Inject(HOTKEY_OPTIONS) private config?: HotkeyOptions,
    @Inject(DOCUMENT) doc?: any
  ) {
    this.document = doc;
    this.defaults = { element: this.document };

    this.configuration = { ..._defaultOptions, ...this.config };

    if (!this.configuration.disableCheatSheet) {
      this.register({
        combo: this.configuration.cheatSheetHotkey,
        handler: () => {
          this._cheatSheetToggled.next();
        },
        description: this.configuration.cheatSheetHotkeyDescription
      });
    }

    if (this.configuration.cheatSheetCloseEsc) {
      this.register({
        combo: 'esc',
        handler: () => {
          this._cheatSheetToggled.next(false);
        },
        description: this.configuration.cheatSheetCloseEscDescription
      });
    }
  }

  /**
   * Returns the registered hotkeys as array.
   * @returns all registered hotkeys
   */
  public get hotkeys(): Hotkey[] {
    return Array.from(this.registeredHotkeys);
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

  /**
   * Returns the options used to configure this service.
   */
  public get options(): HotkeyOptions {
    return this.configuration;
  }

  /**
   * Registers a new hotkey/new hotkeys with it's/their handler(s).
   * @param hotkey hotkeys to listen for
   * @param unpausing flag indicating if the hotkeys should be unpaused
   */
  public register(hotkey: Hotkey | Hotkey[], unpausing = false): void {
    let hotkeys: Hotkey[] = [].concat(hotkey);
    if (unpausing) {
      hotkeys = Array.from(this.pausedHotkeys);
    }
    hotkeys.forEach(h => {
      if (unpausing) {
        this.pausedHotkeys.delete(h);
      }
      this.registeredHotkeys.add(h);

      this.bindingSubscriptions.set(h.combo,
        this.bindToEventManager(h)
          .subscribe(() => {
            h.handler();
          }));
    });
  }

  /**
   * Removes a/the registered hotkey(s).
   * @param hotkey hotkey filter
   * @param pausing flag indicating if the hotkeys should be paused
   */
  public unregister(hotkey: Hotkey | Hotkey[], pausing = false): void {
    const hotkeys: Hotkey[] = [].concat(hotkey);

    hotkeys.forEach(h => {
      this.registeredHotkeys.delete(h);
      if (pausing) {
        this.pausedHotkeys.add(h);
      }
      this.unbindFromEventManager(h);
    });
  }

  /**
   * Returns all hotkeys matching the passed combo(s).
   * @param combo combo to match against
   * @returns all matched hotkeys
   */
  public get(combo?: string): Hotkey[] {
    return this.hotkeys.filter(h => h.combo === combo);
  }

  /**
   * Stops listening for the specified hotkeys.
   * @param hotkey hotkey filter
   */
  public pause(hotkey?: Hotkey | Hotkey[]): void {
    if (!hotkey) {
      return this.pause(this.hotkeys);
    }
    const hotkeys: Hotkey[] = [].concat(hotkey);
    this.unregister(hotkeys, true);
  }

  /**
   * Resumes listening for the specified hotkeys.
   * @param hotkey hotkey filter
   */
  public unpause(hotkey?: Hotkey | Hotkey[]): void {
    if (!hotkey) {
      return this.unpause(this.hotkeys);
    }
    const hotkeys: Hotkey[] = [].concat(hotkey);
    this.register(hotkeys, true);
  }

  /**
   * Resets all hotkeys.
   */
  public reset(): void {
    this.registeredHotkeys.forEach((h: Hotkey) => this.unbindFromEventManager(h));
    this.registeredHotkeys.clear();
    this.pausedHotkeys.clear();
  }

  public ngOnDestroy(): void {
    this.reset();
  }

  private bindToEventManager(hotkey: Hotkey): Observable<any> {
    const merged = { ...this.defaults, ...hotkey };
    const event = `keydown.${merged.combo.replace('+', '.')}`;

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

  private unbindFromEventManager(hotkey: Hotkey): void {
    const merged = { ...this.defaults, ...hotkey };

    const keySub = this.bindingSubscriptions.get(merged.combo);
    if (keySub && !keySub.closed) {
      keySub.unsubscribe();
      this.bindingSubscriptions.delete(merged.combo);
    }
  }
}
