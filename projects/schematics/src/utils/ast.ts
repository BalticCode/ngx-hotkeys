import { WorkspaceProject } from '@angular-devkit/core/src/experimental/workspace';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';

import { typescript, ts } from './version-agnostic-typescript';

/** Import and add module to root app module. */
export function addModuleImportToRootModule(host: Tree, moduleName: string, src: string,
    project: WorkspaceProject) {
    const modulePath = getAppModulePath(host, getProjectMainFile(project));
    addModuleImportToModule(host, modulePath, moduleName, src);
}

/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project: WorkspaceProject): string {
    const buildOptions = getProjectTargetOptions(project, 'build');

    if (!buildOptions.main) {
        throw new SchematicsException(`Could not find the project main file inside of the ` +
            `workspace config (${project.sourceRoot})`);
    }

    return buildOptions.main;
}

/** Resolves the architect options for the build target of the given project. */
function getProjectTargetOptions(project: WorkspaceProject, buildTarget: string) {
    if (project.targets &&
        project.targets[buildTarget] &&
        project.targets[buildTarget].options) {

        return project.targets[buildTarget].options;
    }

    if (project.architect &&
        project.architect[buildTarget] &&
        project.architect[buildTarget].options) {

        return project.architect[buildTarget].options;
    }

    throw new SchematicsException(
        `Cannot determine project target configuration for: ${buildTarget}.`);
}

function addModuleImportToModule(host: Tree, modulePath: string, moduleName: string,
    src: string) {

    const moduleSource = getSourceFile(host, modulePath);

    if (!moduleSource) {
        throw new SchematicsException(`Module not found: ${modulePath}`);
    }

    const changes = addImportToModule(moduleSource as any, modulePath, moduleName, src);
    const recorder = host.beginUpdate(modulePath);

    changes.forEach((change) => {
        if (change instanceof InsertChange) {
            recorder.insertLeft(change.pos, change.toAdd);
        }
    });

    host.commitUpdate(recorder);
}

function getSourceFile(host: Tree, path: string): typescript.SourceFile {
    const buffer = host.read(path);
    if (!buffer) {
        throw new SchematicsException(`Could not find file for path: ${path}`);
    }
    return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}
