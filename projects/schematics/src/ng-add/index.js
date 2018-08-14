"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ngx_schematics_utils_1 = require("@balticcode/ngx-schematics-utils");
function addPackageJsonDependencies() {
    return (host, context) => {
        const dependencies = [{ type: ngx_schematics_utils_1.NodeDependencyType.Dependencies, version: '^2.1.3', name: '@balticcode/ngx-hotkeys' }];
        dependencies.forEach(dependency => {
            ngx_schematics_utils_1.addPackageJsonDependency(host, dependency);
            context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing packages...`);
        return host;
    };
}
function addModuleToImports(options) {
    return (host, context) => {
        const workspace = ngx_schematics_utils_1.getWorkspace(host);
        const project = ngx_schematics_utils_1.getProjectFromWorkspace(workspace, 
        // Takes the default project in case it's not provided by CLI
        options.project ? options.project : workspace.defaultProject);
        const moduleName = 'NgxHotkeysModule.forRoot()';
        ngx_schematics_utils_1.addModuleImportToRootModule(host, moduleName, '@balticcode/ngx-hotkeys', project);
        context.logger.log('info', `✅️ "${moduleName}" is imported`);
        return host;
    };
}
function default_1(options) {
    return schematics_1.chain([
        options && options.skipPackageJson ? schematics_1.noop() : addPackageJsonDependencies(),
        options && options.skipPackageJson ? schematics_1.noop() : installPackageJsonDependencies(),
        options && options.skipModuleImport ? schematics_1.noop() : addModuleToImports(options)
    ]);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map