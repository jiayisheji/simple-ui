import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url
} from '@angular-devkit/schematics';
import { InsertChange, toFileName } from '@nrwl/workspace';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import * as ts from 'typescript';
import { addRoutesToModule } from '../utility/ast-utils';
import { PlaygroundComponentOptions } from './schema';

export default function (schema: PlaygroundComponentOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const options = normalizeOptions(schema);
    return chain([
      createFiles(options),
      externalSchematic('@schematics/angular', 'component', {
        name: options.folderName + '/overview',
        project: schema.project,
        prefix: 'doc',
        style: 'scss',
        skipImport: true,
        lintFix: true,
        skipTests: true
      }),
      externalSchematic('@schematics/angular', 'component', {
        name: options.folderName + '/api',
        project: options.project,
        prefix: 'doc',
        style: 'scss',
        skipImport: true,
        lintFix: true,
        skipTests: true
      }),
      externalSchematic('@schematics/angular', 'component', {
        name: options.folderName + '/examples',
        project: options.project,
        prefix: 'doc',
        style: 'scss',
        skipImport: true,
        lintFix: true,
        skipTests: true
      }),
      externalSchematic('@schematics/angular', 'module', {
        name: 'examples/' + options.fileName + '-example',
        project: options.project,
        lintFix: true
      }),
      addRouteDeclarationToNgModule(options),
      applyLintFix(`apps/simple-ui-doc/src/app/components/components-routing.module.ts`)
    ]);
  };
}

function addRouteDeclarationToNgModule(options: PlaygroundComponentOptions): Rule {
  return (host: Tree) => {
    const path = `apps/simple-ui-doc/src/app/components/components-routing.module.ts`;

    const text = host.read(path);
    if (!text) {
      throw new Error(`Couldn't find the module nor its routing module.`);
    }

    const sourceText = text.toString();
    const addDeclaration = addRoutesToModule(
      ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true),
      path,
      buildRoute(options)
    ) as InsertChange;

    const recorder = host.beginUpdate(path);
    recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
    host.commitUpdate(recorder);
    return host;
  };
}

function buildRoute(options: PlaygroundComponentOptions) {
  const relativeModulePath = `./${options.fileName}/${options.fileName}.module`;
  const moduleName = `${strings.classify(options.fileName)}Module`;
  const loadChildren = `() => import('${relativeModulePath}').then(m => m.${moduleName})`;

  return `{ path: '${options.fileName}', loadChildren: ${loadChildren} }`;
}

function createFiles(options: PlaygroundComponentOptions) {
  return mergeWith(
    apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options
      }),
      move('apps/simple-ui-doc/src/app/' + options.folderName)
    ])
  );
}

function normalizeOptions(options: PlaygroundComponentOptions) {
  const fileName = toFileName(options.name).replace(new RegExp('/', 'g'), '-');
  const folderName = `components/${fileName}`;
  return Object.assign(Object.assign({}, options), {
    fileName,
    folderName
  });
}
