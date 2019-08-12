export interface Schema {
    disableCheatSheet?: boolean;
    cheatSheetCloseEsc?: boolean;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * When true, does not import this component into the owning NgModule.
     */
    skipImport?: boolean;
}
