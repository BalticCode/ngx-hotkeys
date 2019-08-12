export interface Hotkey {
  element?: any;
  /**
   * Key binding
   */
  combo: string;
  /**
   * Handler to call when binding is triggered
   */
  handler: () => void;
  /**
   * Description for the help menu
   */
  description?: string;
}

export interface HotkeyOptions {
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
