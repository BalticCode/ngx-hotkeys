import { Rule, SchematicContext, Tree, chain, noop } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getWorkspace } from '@schematics/angular/utility/config';

import { Schema } from './schema';
import { addPackageToPackageJson } from '../utils/package-utils';
import { getProjectFromWorkspace } from '../utils/project-utils';
import { addModuleImportToRootModule } from '../utils/ast';

const pkgName = '@balticcode/ngx-hotkeys';
const version = '3.0.0';

export default function (options: Schema): Rule {
    return chain([
        addPackageJsonDependencies(),
        installPackageJsonDependencies(),
        options && options.skipImport ? noop() : addModuleToImports(options)
    ]);
}

function addPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {

        addPackageToPackageJson(host, `${pkgName}`, `~${version}`);
        context.logger.log('info', `✅️ Added "${pkgName}" to package.json`);

        return host;
    };
}

function installPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {

        context.addTask(new NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing package...`);

        return host;
    };
}

function addModuleToImports(options: Schema): Rule {
    return (host: Tree, context: SchematicContext) => {
        const workspace = getWorkspace(host);

        const project = getProjectFromWorkspace(
            workspace,
            // Takes the default project in case it's not provided by CLI
            options.project ? options.project : workspace.defaultProject
        );
        const moduleName = 'NgxHotkeysModule.forRoot()';

        addModuleImportToRootModule(host, moduleName, '@balticcode/ngx-hotkeys', project);
        context.logger.log('info', `✅️ "${moduleName}" is imported`);

        return host;
    };
}
