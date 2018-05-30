[![npm version](https://img.shields.io/npm/v/@balticcode/ngx-hotkeys.svg)](https://www.npmjs.com/package/@balticcode/ngx-hotkeys)
# ngx-hotkeys

An Angular module providing hotkey support.

Feel free to take a look at the [DEMO](https://balticcode.github.io/ngx-hotkeys/).

* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)

## Introduction
This module started as an updated port of [angular2-hotkeys](https://github.com/brtnshrdr/angular2-hotkeys) which originates from a personal need of a full Angular 6 compatible version. The original library was the last dependency forcing us to use the rxjs-compat.

## Installation
Install via npm:
```
npm install @balticcode/ngx-hotkeys --save
```
## Usage

#### Import `NgxLocalStorageModule`

```ts
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxHotkeysModule} from '@balticcode/ngx-hotkeys';

@NgModule({
    imports: [
        BrowserModule,
        NgxHotkeysModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
##### Configuration (`NgxHotkeysModule.forRoot(options?: IHotkeyOptions)`)

* __disableCheatSheet__
  * Type: `boolean?`
  * Disable the cheat sheet popover dialog.
  * Default: __false__
* __cheatSheetTitle__
  * Type: `string?`
  * Specify the cheat sheets title.
  * Default: __'Keyboard Shortcuts:'__
* __cheatSheetHotkey__
  * Type: `string?`
  * Key combination to trigger the cheat sheet.
  * Default: __'?'__
* __cheatSheetHotkeyDescription__
  * Type: `string?`
  * Description for the cheat sheet hot key in the cheat sheet.
  * Default: __'Show / hide this help menu'__
* __cheatSheetCloseEsc__
  * Type: `boolean?`
  * Use also ESC for closing the cheat sheet
  * Default: __false__
* __cheatSheetCloseEscDescription__
  * Type: `string?`
  * Description for the ESC key for closing the cheat sheet (if enabled).
  * Default: __'Hide this help menu'__
  
## API

### NgxHotkeysService

#### Methods

- `register(hotkey: IHotkey | IHotkey[], unpausing = false): void`: Registers a new hotkey/new hotkeys with it's/their handler(s).
- `unregister(hotkey: IHotkey | IHotkey[], pausing = false): void`: Removes a/the registered hotkey(s). 
- `get(combo?: string | string[]): IHotkey | IHotkey[]`: Returns all hotkeys matching the passed combo(s).
- `pause(hotkey?: IHotkey | IHotkey[]): void`: Stops listening for the specified hotkeys.
- `unpause(hotkey?: IHotkey | IHotkey[]): void`: Resumes listening for the specified hotkeys.
- `reset(): void`: Resets all hotkeys.

#### Properties

- `hotkeys` (`IHotkey[]`): Returns the registered hotkeys as array.
- `cheatSheetToggled` (`Observable<boolean>`): Returns an Observable stream indicating the cheatsheets visibility was toggled.

##### Example

```ts
import {Hotkey, NgxHotkeysService} from '@balticcode/ngx-hotkeys';

constructor(private _hotkeysService: NgxHotkeysService) {
  this._hotkeysService.register({
    combo: 'shift+g',
    handler: event => {
      console.log('Typed hotkey');
      return false; // Prevent bubbling
    },
    description: 'Sends a secret message to the console.'
  });
}
```

### NgxHotkeysDirective

#### Properties

- `hotkeys` (`HotKeyMap[]`): Array of hotkey mappings specific to the bound element.

### NgxCheatsheetComponent

#### Properties

- `title` (`string`): Determines the Cheatsheet title.
