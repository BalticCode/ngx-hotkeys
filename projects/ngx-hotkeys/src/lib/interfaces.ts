export interface IHotkey {
  /**
   * Key binding
   */
  combo: string | string[];
  /**
   * Handler to call when binding is triggered
   */
  handler: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean;
  /**
   * The type of event to listen for (for mousetrap)
   */
  specificEvent?: string;
  /**
   * An array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
   */
  allowIn?: string[];
  /**
   * Description for the help menu
   */
  description?: string;
  /**
   * Custom display format used in cheatsheet
   */
  format?: string[];
}

export interface IHotkeyOptions {
  /**
   * Disable the cheat sheet popover dialog? Default: false
   */
  disableCheatSheet?: boolean;
  /**
   * Specifies the title of the cheat sheet. Default: 'Keyboard Shortcuts:'
   */
  cheatSheetTitle?: string;
  /**
   * Key combination to trigger the cheat sheet. Default: '?'
   */
  cheatSheetHotkey?: string;
  /**
   * Description for the cheat sheet hot key in the cheat sheet. Default: 'Show / hide this help menu'
   */
  cheatSheetHotkeyDescription?: string;
  /**
   * Use also ESC for closing the cheat sheet. Default: false
   */
  cheatSheetCloseEsc?: boolean;
  /**
   * Description for the ESC key for closing the cheat sheet (if enabled). Default: 'Hide this help menu'
   */
  cheatSheetCloseEscDescription?: string;
}

export interface ExtendedKeyboardEvent extends KeyboardEvent {
  returnValue: boolean; // IE returnValue
}

export interface HotKeyMap {
  [combo: string]: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean;
}
