<a name="4.0.0"></a>
# [4.0.0](https://github.com/BalticCode/ngx-hotkeys/compare/3.0.2...4.0.0) (2022-05-09)

### BREAKING CHANGES

* library requires `13.2.3` as the minimum version of `@angular/core` now due to changes made to `@angular/compiler` and `@angular/core` ([#44994](https://github.com/angular/angular/pull/44994))
* removed schematic support

<a name="3.0.2"></a>
# [3.0.2](https://github.com/BalticCode/ngx-hotkeys/compare/3.0.1...3.0.2) (2020-02-29)

### Bug fixes

* **API**
  * expose `Hotkey`and `HotkeyOptions` ([#8](https://github.com/BalticCode/ngx-hotkeys/issues/8))

<a name="3.0.1"></a>
# [3.0.1](https://github.com/BalticCode/ngx-hotkeys/compare/3.0.0...3.0.1) (2018-08-19)

### Fixes

* Fixed schematics

<a name="3.0.0"></a>
# [3.0.0](https://github.com/BalticCode/ngx-hotkeys/compare/2.1.3...3.0.0) (2018-08-17)

### Features

* complete rewrite of the library
  * removed external dependencies
  * use Angular mechanics to listen to shortcuts

<a name="2.1.3"></a>
# [2.1.3](https://github.com/BalticCode/ngx-hotkeys/compare/2.0.0...2.1.3) (2018-08-14)

### Features

* **Angular**
  * Added schematics support ([#2](https://github.com/BalticCode/ngx-hotkeys/issues/2))

<a name="2.0.0"></a>
# [2.0.0](https://github.com/BalticCode/ngx-hotkeys/compare/1.0.0...2.0.0) (2018-05-30)

### Update instructions
Beside running `npm install @balticcode/ngx-hotkeys@2.0.0` you can also remove [mousetrap](https://www.npmjs.com/package/mousetrap) from your projects dependencies by running `npm uninstall mousetrap --save`.

### Breaking Changes
* **module configuration:** instead of providing an empty object you can now completely ommit the parameter to use the default options.
* **NgxHotkeysService:** rewritten the API (see [README](https://github.com/BalticCode/ngx-hotkeys/blob/master/README.md) for a complete list).

### Bug Fixes
* **dependencies:** moving [mousetrap](https://www.npmjs.com/package/mousetrap) from the libraries `peerDependencies` to `dependencies`

<a name="1.0.0"></a>
# 1.0.0 (2018-05-09)
* initial release
