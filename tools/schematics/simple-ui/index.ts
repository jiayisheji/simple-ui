import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url
} from '@angular-devkit/schematics';
import { toFileName } from '@nrwl/workspace';
import { SimpleOptions } from './schema';

export default function (schema: SimpleOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const options = normalizeOptions(schema);

    return chain([
      createFiles(options),
      options.theme ? updateThemeBundle(options) : noop(),
      options.service
        ? externalSchematic('@schematics/angular', 'service', {
            name: schema.name,
            project: schema.project,
            path: options.folderName,
            skipTests: true,
            lintFix: true
          })
        : noop(),
      options.types
        ? externalSchematic('@schematics/angular', 'interface', {
            name: schema.name,
            project: schema.project,
            path: options.folderName,
            prefix: 'Sim',
            type: 'typings',
            flat: true
          })
        : noop(),
      options.directive
        ? externalSchematic('@schematics/angular', 'directive', {
            name: schema.name,
            project: schema.project,
            path: options.folderName,
            prefix: 'sim',
            skipTests: true,
            export: true,
            flat: true,
            lintFix: true
          })
        : noop(),
      externalSchematic('@schematics/angular', 'component', {
        name: schema.name,
        project: schema.project,
        path: options.folderName,
        viewEncapsulation: 'None',
        changeDetection: 'OnPush',
        prefix: 'sim',
        style: 'scss',
        export: true,
        flat: true,
        lintFix: true
      })
    ]);
  };
}

function createFiles(options: SimpleOptions) {
  return mergeWith(
    apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options
      }),
      move(options.folderName)
    ])
  );
}

function updateThemeBundle(options: SimpleOptions): Rule {
  return (tree: Tree) => {
    const themePath = `${options.projectRoot}/theme/_component-all-theme.scss`;
    const importPlaceholder = '/// @import component.theme';
    const includePlaceholder = '/// @include component.theme';
    const name = strings.dasherize(options.name);
    // 读取目标文件
    const text = tree.read(themePath);
    if (text === null) {
      throw new SchematicsException(`File ${themePath} does not exist.`);
    }
    // 获取内容
    const sourceText = text.toString('utf-8');

    // 替换后文件
    const replaceText = sourceText
      .replace(importPlaceholder, `@import '../${name}/${name}.component.theme';\n${importPlaceholder}`)
      .replace(includePlaceholder, `@include sim-${name}-theme($theme-or-config);\n  ${includePlaceholder}`);
    // 更新目标文件内容
    tree.overwrite(themePath, replaceText);
    return tree;
  };
}

function normalizeOptions(options: SimpleOptions) {
  const fileName = toFileName(options.name).replace(new RegExp('/', 'g'), '-');
  const projectRoot = `libs/${options.project}`;
  const folderName = `${projectRoot}/${fileName}`;
  return Object.assign(Object.assign({}, options), {
    projectRoot,
    fileName,
    folderName
  });
}
